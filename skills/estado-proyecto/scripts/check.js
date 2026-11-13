'use strict';
// Hook Stop. Bloquea UNA vez si hubo ediciones de código sin ESTADO.md actualizado.
// Siempre sale con 0 (la señal de bloqueo va por stdout como JSON). Sin dependencias.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const TAIL_BYTES = 512 * 1024;
const MARK = '<!-- estado-proyecto -->';
const EDIT_TOOLS = new Set(['Edit', 'Write', 'NotebookEdit']);
const REASON = 'Actualiza ESTADO.md (≤15 líneas: hecho/queda/siguiente paso/verificar) y commitéalo';

function readStdinJson() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    const v = raw.trim() ? JSON.parse(raw) : {};
    return v && typeof v === 'object' ? v : {};
  } catch (e) {
    return {};
  }
}

function tailEntries(file) {
  const out = [];
  if (!file || !fs.existsSync(file)) return out;
  const fd = fs.openSync(file, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    const len = Math.min(size, TAIL_BYTES);
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, size - len);
    let s = buf.toString('utf8');
    if (size > len) s = s.slice(s.indexOf('\n') + 1); // descartar la línea cortada
    for (const line of s.split('\n')) {
      if (!line.trim()) continue;
      try { out.push(JSON.parse(line)); } catch (e) { /* línea rota: se ignora */ }
    }
  } finally {
    fs.closeSync(fd);
  }
  return out;
}

// Mensaje real del usuario (no un resultado de herramienta): inicia el turno.
function isRealUser(e) {
  if (!e || e.type !== 'user' || e.isMeta) return false;
  const c = e.message && e.message.content;
  if (typeof c === 'string') return c.trim() !== '';
  return Array.isArray(c) && c.some((b) => b && b.type === 'text');
}

function editedInLastTurn(entries) {
  let start = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (isRealUser(entries[i])) { start = i + 1; break; }
  }
  for (let i = start; i < entries.length; i++) {
    const e = entries[i];
    const c = e && e.type === 'assistant' && e.message && e.message.content;
    if (Array.isArray(c) && c.some((b) => b && b.type === 'tool_use' && EDIT_TOOLS.has(b.name))) return true;
  }
  return false;
}

// Rutas modificadas según git (con -z para no depender de comillas).
function changedFiles(cwd) {
  const r = spawnSync('git', ['-C', cwd, 'status', '--porcelain', '-z', '-uall'], { encoding: 'utf8' });
  if (r.error || r.status !== 0) return null;
  const parts = r.stdout.split('\0').filter(Boolean);
  const files = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    files.push(p.slice(3));
    if (p[0] === 'R' || p[0] === 'C') i++; // el siguiente elemento es la ruta original
  }
  return files;
}

// Ruta del cwd dentro del repo (git da las rutas desde la raíz del repo).
function prefix(cwd) {
  const r = spawnSync('git', ['-C', cwd, 'rev-parse', '--show-prefix'], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : '';
}

// ESTADO.md si no existe o lleva la marca; si no, ESTADO-CLAUDE.md.
function stateFileName(cwd) {
  try {
    const p = path.join(cwd, 'ESTADO.md');
    if (!fs.existsSync(p)) return 'ESTADO.md';
    const first = fs.readFileSync(p, 'utf8').split(/\r?\n/, 1)[0].trim();
    return first === MARK ? 'ESTADO.md' : 'ESTADO-CLAUDE.md';
  } catch (e) {
    return 'ESTADO.md';
  }
}

function main() {
  const input = readStdinJson();
  if (input.stop_hook_active === true) return;
  const cwd = input.cwd || process.cwd();
  if (!editedInLastTurn(tailEntries(input.transcript_path))) return;
  const files = changedFiles(cwd);
  if (!files) return; // no es repo git
  const state = prefix(cwd) + stateFileName(cwd);
  const norm = (f) => f.replace(/\\/g, '/');
  const others = files.filter((f) => norm(f) !== state);
  if (!others.length) return;
  if (files.some((f) => norm(f) === state)) return;
  process.stdout.write(JSON.stringify({ decision: 'block', reason: REASON }));
}

try { main(); } catch (e) { /* nunca romper la sesión */ }
process.exit(0);
