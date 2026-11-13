'use strict';
// node scripts/install-claude.js [--uninstall] [--copy] [--force] [--only=a,b]
// Instala en Claude Code: enlaces (junction) a las skills, hooks en settings.json y bloques en CLAUDE.md.
// Variables para pruebas: CLAUDE_HOME (por defecto ~/.claude), CLAUDE_SETTINGS_PATH, CLAUDE_MD_PATH.
// Generaliza el instalador de resumen-continuo. Adaptado de ponytail (MIT), ver THIRD_PARTY_NOTICES.md
const fs = require('fs');
const os = require('os');
const path = require('path');

const args = process.argv.slice(2);
const uninstall = args.includes('--uninstall');
const copy = args.includes('--copy');
const force = args.includes('--force');
const onlyArg = args.find((a) => a.startsWith('--only='));
const only = onlyArg ? onlyArg.slice(7).split(',').filter(Boolean) : null;

const REPO = path.resolve(__dirname, '..');
const CLAUDE_HOME = process.env.CLAUDE_HOME || path.join(os.homedir(), '.claude');
const SETTINGS = process.env.CLAUDE_SETTINGS_PATH || path.join(CLAUDE_HOME, 'settings.json');
const CLAUDE_MD = process.env.CLAUDE_MD_PATH || path.join(CLAUDE_HOME, 'CLAUDE.md');
const SKILLS_DIR = path.join(CLAUDE_HOME, 'skills');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const slash = (p) => p.replace(/\\/g, '/');

// [evento, 'skill/scripts/archivo.js', matcher, marca que identifica la entrada como nuestra]
const HOOKS = [
  ['UserPromptSubmit', 'resumen-continuo/scripts/on-user-prompt.js', null, 'resumen-continuo/scripts/'],
  ['Stop', 'resumen-continuo/scripts/on-stop.js', null, 'resumen-continuo/scripts/'],
  ['PreCompact', 'resumen-continuo/scripts/pre-compact.js', null, 'resumen-continuo/scripts/'],
  ['PostCompact', 'resumen-continuo/scripts/post-compact.js', null, 'resumen-continuo/scripts/'],
  ['SessionStart', 'resumen-continuo/scripts/session-start.js', 'compact|resume', 'resumen-continuo/scripts/'],
  ['Stop', 'estado-proyecto/scripts/check.js', null, 'estado-proyecto/scripts/check.js'],
];
const MARKS = [...new Set(HOOKS.map((h) => h[3]))];
const selected = (skill) => !only || only.includes(skill);
const hookCmd = (rel) => `node "${slash(path.join(SKILLS_DIR, ...rel.split('/')))}"`;
const isOurs = (g) => (g.hooks || []).some((h) => {
  const c = slash(String(h.command || ''));
  return MARKS.some((m) => c.includes(m));
});

function backup(file) {
  if (fs.existsSync(file)) fs.copyFileSync(file, `${file}.bak-${STAMP}`);
}

function installSettings() {
  let raw = '{}';
  if (fs.existsSync(SETTINGS)) {
    raw = fs.readFileSync(SETTINGS, 'utf8');
    if (raw.trim()) JSON.parse(raw); // corrupto: aborta antes de tocar nada
  }
  const s = raw.trim() ? JSON.parse(raw) : {};
  s.hooks = s.hooks || {};
  const events = [...new Set(HOOKS.map((h) => h[0]))];
  for (const ev of events) {
    const list = (s.hooks[ev] || []).filter((g) => !isOurs(g)); // quita también las entradas viejas
    if (!uninstall) {
      for (const [e, rel, matcher] of HOOKS) {
        if (e !== ev || !selected(rel.split('/')[0])) continue;
        const g = { hooks: [{ type: 'command', command: hookCmd(rel) }] };
        if (matcher) g.matcher = matcher;
        list.push(g);
      }
    }
    if (list.length) s.hooks[ev] = list; else delete s.hooks[ev];
  }
  if (!Object.keys(s.hooks).length) delete s.hooks;
  if (!uninstall) {
    s.autoCompactWindow = 250000;
    s.cleanupPeriodDays = 3650;
  } else {
    delete s.autoCompactWindow;
    delete s.cleanupPeriodDays;
  }
  const out = JSON.stringify(s, null, 2) + '\n';
  JSON.parse(out); // validar antes de escribir
  backup(SETTINGS);
  fs.mkdirSync(path.dirname(SETTINGS), { recursive: true });
  fs.writeFileSync(SETTINGS, out);
  JSON.parse(fs.readFileSync(SETTINGS, 'utf8')); // validar después
  console.log(`${uninstall ? 'Hooks quitados de' : 'Hooks instalados en'} ${SETTINGS}`);
}

function blocks() {
  const f = path.join(REPO, 'claude', 'CLAUDE-bloques.md');
  const txt = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  const out = [];
  const re = /<!-- skills-ia:([\w-]+) -->\n([\s\S]*?)\n<!-- \/skills-ia:\1 -->/g;
  let m;
  while ((m = re.exec(txt))) out.push({ name: m[1], text: m[0] });
  return out;
}

function installClaudeMd() {
  const cur = fs.existsSync(CLAUDE_MD) ? fs.readFileSync(CLAUDE_MD, 'utf8').replace(/\r\n/g, '\n') : '';
  let txt = cur;
  const esc = (n) => n.replace(/[-]/g, '\\-');
  for (const b of blocks()) {
    const marked = new RegExp(`<!-- skills-ia:${esc(b.name)} -->[\\s\\S]*?<!-- /skills-ia:${esc(b.name)} -->`);
    if (uninstall) { txt = txt.replace(marked, '').replace(/\n{3,}/g, '\n\n'); continue; }
    if (marked.test(txt)) { txt = txt.replace(marked, () => b.text); continue; }
    // sección "## Sin conformismo" ya existente sin marcadores: se reemplaza para no duplicar
    const head = b.name === 'sin-conformismo' && /^## Sin conformismo[ \t]*$/m.exec(txt);
    if (head) {
      const rest = txt.slice(head.index + head[0].length);
      const next = /^## /m.exec(rest);
      const end = next ? head.index + head[0].length + next.index : txt.length;
      txt = txt.slice(0, head.index) + b.text + '\n' + (next ? '\n' : '') + txt.slice(end);
    } else {
      txt = txt.replace(/\s+$/, '') + (txt.trim() ? '\n\n' : '') + b.text + '\n';
    }
  }
  txt = txt.replace(/\s+$/, '') + (txt.trim() ? '\n' : '');
  if (txt === cur) { console.log('CLAUDE.md sin cambios'); return; }
  backup(CLAUDE_MD);
  fs.mkdirSync(path.dirname(CLAUDE_MD), { recursive: true });
  fs.writeFileSync(CLAUDE_MD, txt);
  console.log(`${uninstall ? 'Bloques quitados de' : 'Bloques instalados en'} ${CLAUDE_MD}`);
}

function lstat(p) { try { return fs.lstatSync(p); } catch (e) { return null; } }
function removeLink(p) { try { fs.unlinkSync(p); } catch (e) { fs.rmdirSync(p); } }

function linkSkills() {
  const names = fs.readdirSync(path.join(REPO, 'skills')).filter((n) => fs.existsSync(path.join(REPO, 'skills', n, 'SKILL.md')) && selected(n));
  fs.mkdirSync(SKILLS_DIR, { recursive: true });
  for (const n of names) {
    const target = path.join(REPO, 'skills', n);
    const link = path.join(SKILLS_DIR, n);
    const st = lstat(link);
    if (uninstall) {
      if (st && st.isSymbolicLink()) { removeLink(link); console.log(`Quitado el enlace ${link}`); }
      else if (st) console.log(`Se deja ${link} (no es un enlace; bórralo tú si era una copia)`);
      continue;
    }
    if (st) {
      if (st.isSymbolicLink()) removeLink(link);
      else if (force) fs.renameSync(link, `${link}.bak-${STAMP}`);
      else { console.log(`AVISO: ${link} ya existe y es una carpeta real; no se toca (usa --force para respaldarla y reemplazarla)`); continue; }
    }
    if (copy) fs.cpSync(target, link, { recursive: true });
    else fs.symlinkSync(target, link, 'junction');
    console.log(`${copy ? 'Copiada' : 'Enlazada'} ${n} -> ${link}`);
  }
}

try {
  if (!fs.existsSync(path.join(REPO, 'skills'))) throw new Error('no encuentro la carpeta skills/ junto a scripts/');
  // Validar antes de tocar nada: settings.json corrupto aborta todo.
  if (fs.existsSync(SETTINGS) && fs.readFileSync(SETTINGS, 'utf8').trim()) JSON.parse(fs.readFileSync(SETTINGS, 'utf8'));
  linkSkills();
  installSettings();
  installClaudeMd();
  console.log(uninstall ? 'Desinstalado. Los resúmenes de ~/.claude/resumenes se conservan.' : 'Listo. Reinicia Claude Code para que cargue los hooks.');
} catch (e) {
  console.error('Error (revisa antes de repetir): ' + e.message);
  process.exit(1);
}
