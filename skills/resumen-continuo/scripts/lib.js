'use strict';
// Utilidades compartidas. Sin dependencias. Nunca lanzar errores hacia fuera.
const fs = require('fs');
const os = require('os');
const path = require('path');

const TAIL_BYTES = 512 * 1024;
const THRESHOLD_PCT = 25;

function readStdinJson() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    if (!raw.trim()) return {};
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : {};
  } catch (e) {
    return {};
  }
}

function resumenesRoot() {
  return process.env.RESUMEN_CONTINUO_DIR || path.join(os.homedir(), '.claude', 'resumenes');
}

function sanitize(s) {
  return String(s || 'sin-proyecto').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'sin-proyecto';
}

function projectName(cwd) {
  const base = path.basename(String(cwd || '').replace(/[\\/]+$/, ''));
  return sanitize(base);
}

function sessionFile(input) {
  const proj = projectName(input.cwd);
  const dir = path.join(resumenesRoot(), proj);
  const id = sanitize(input.session_id || 'sesion');
  return { dir, file: path.join(dir, id + '.md'), id, proj };
}

function now() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function clip(s, n) {
  s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// Solo añade; nunca borra. Crea el INDEX con una línea por sesión.
function appendToSession(input, text, firstLine) {
  const { dir, file, id, proj } = sessionFile(input);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(file)) {
    fs.appendFileSync(file, `# Sesión ${id}\n\nProyecto: ${proj} · cwd: ${input.cwd || '?'} · inicio: ${now()}\n\n`);
  }
  fs.appendFileSync(file, text);
  try {
    const idx = path.join(dir, 'INDEX.md');
    let cur = '';
    try { cur = fs.readFileSync(idx, 'utf8'); } catch (e) {}
    if (!cur.includes(id)) {
      fs.appendFileSync(idx, `- ${now()} · ${id} · ${clip(firstLine || '', 120)}\n`);
    }
  } catch (e) {}
  return file;
}

function readTail(file, bytes) {
  const fd = fs.openSync(file, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    const len = Math.min(size, bytes || TAIL_BYTES);
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, size - len);
    let s = buf.toString('utf8');
    if (size > len) s = s.slice(s.indexOf('\n') + 1); // descartar línea cortada
    return s;
  } finally {
    fs.closeSync(fd);
  }
}

function tailEntries(transcriptPath) {
  const out = [];
  try {
    if (!transcriptPath || !fs.existsSync(transcriptPath)) return out;
    for (const line of readTail(transcriptPath).split('\n')) {
      if (!line.trim()) continue;
      try { out.push(JSON.parse(line)); } catch (e) {}
    }
  } catch (e) {}
  return out;
}

function windowSize() {
  return process.env.CLAUDE_CODE_DISABLE_1M_CONTEXT === '1' ? 200000 : 1000000;
}

// Devuelve {used, window, pct} o null si se desconoce.
function contextUsage(transcriptPath, entries) {
  try {
    entries = entries || tailEntries(transcriptPath);
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (e && e.type === 'assistant' && e.isSidechain === false && e.message && e.message.usage) {
        const u = e.message.usage;
        const used = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
        const w = windowSize();
        return { used, window: w, pct: Math.round((used / w) * 1000) / 10 };
      }
    }
  } catch (e) {}
  return null;
}

// Último "recap" de mcp__ccd_turn__wrap_up en las entradas dadas.
function lastRecap(entries) {
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    const c = e && e.message && e.message.content;
    if (e && e.type === 'assistant' && Array.isArray(c)) {
      for (let j = c.length - 1; j >= 0; j--) {
        const b = c[j];
        if (b && b.type === 'tool_use' && b.name === 'mcp__ccd_turn__wrap_up' && b.input && b.input.recap) {
          return String(b.input.recap);
        }
      }
    }
  }
  return null;
}

function safeMain(fn) {
  try { fn(); } catch (e) {
    try { process.stderr.write('resumen-continuo: ' + (e && e.message) + '\n'); } catch (e2) {}
  }
  process.exit(0);
}

module.exports = {
  THRESHOLD_PCT, readStdinJson, resumenesRoot, projectName, sessionFile, now, clip,
  appendToSession, readTail, tailEntries, contextUsage, lastRecap, windowSize, safeMain, sanitize,
};
