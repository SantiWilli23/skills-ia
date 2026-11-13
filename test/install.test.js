'use strict';
// node test/install.test.js — prueba install-claude.js solo contra copias temporales.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const INSTALL = path.join(__dirname, '..', 'scripts', 'install-claude.js');
const home = fs.mkdtempSync(path.join(os.tmpdir(), 'install-test-'));
let fails = 0;
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FAIL ') + m); if (!c) fails++; };
const env = Object.assign({}, process.env, { CLAUDE_HOME: home, CLAUDE_SETTINGS_PATH: path.join(home, 'settings.json'), CLAUDE_MD_PATH: path.join(home, 'CLAUDE.md') });
const run = (...a) => spawnSync('node', [INSTALL, ...a], { env, encoding: 'utf8' });
const old = { type: 'command', command: 'node "C:/Users/otro/.claude/skills/resumen-continuo/scripts/on-stop.js"' };
fs.writeFileSync(env.CLAUDE_SETTINGS_PATH, JSON.stringify({ model: 'x', hooks: { Stop: [{ hooks: [old] }, { hooks: [{ type: 'command', command: 'echo mio' }] }] } }));
fs.writeFileSync(env.CLAUDE_MD_PATH, '# Mío\n\n## Sin conformismo\n\ntexto viejo\n\n## Otra cosa\n\nsigue\n');

let r = run();
ok(r.status === 0, 'instala con exit 0');
r = run(); // segunda vez: no duplica
let s = JSON.parse(fs.readFileSync(env.CLAUDE_SETTINGS_PATH, 'utf8'));
const cmds = (ev) => (s.hooks[ev] || []).map((g) => g.hooks[0].command);
ok(s.model === 'x' && cmds('Stop').includes('echo mio'), 'conserva lo que no es nuestro');
ok(cmds('Stop').filter((c) => c.includes('resumen-continuo/scripts/on-stop.js')).length === 1 && !cmds('Stop').some((c) => c.includes('/otro/')), 'reemplaza la entrada vieja sin duplicar');
ok(cmds('Stop').some((c) => c.includes('estado-proyecto/scripts/check.js')), 'añade el Stop de estado-proyecto');
ok(['UserPromptSubmit', 'PreCompact', 'PostCompact', 'SessionStart'].every((e) => cmds(e).length === 1), 'los 5 hooks de resumen-continuo');
ok(s.hooks.SessionStart[0].matcher === 'compact|resume' && s.autoCompactWindow === 250000 && s.cleanupPeriodDays === 3650, 'matcher y ajustes');
ok(/^node "[A-Za-z]:\/|^node "\//.test(cmds('Stop')[1]) && !cmds('Stop')[1].includes('\\'), 'rutas con barras normales');
const md = fs.readFileSync(env.CLAUDE_MD_PATH, 'utf8');
ok((md.match(/## Sin conformismo/g) || []).length === 1 && !md.includes('texto viejo') && md.includes('## Otra cosa') && md.includes('skills-ia:estado-proyecto'), 'CLAUDE.md: reemplaza sin duplicar y añade estado-proyecto');
ok(fs.existsSync(path.join(home, 'skills', 'estado-proyecto', 'SKILL.md')), 'enlace a las skills funciona');
ok(fs.readdirSync(home).some((f) => f.startsWith('settings.json.bak-')), 'hace backup de settings.json');

r = run('--uninstall');
s = JSON.parse(fs.readFileSync(env.CLAUDE_SETTINGS_PATH, 'utf8'));
ok(r.status === 0 && cmds('Stop').length === 1 && cmds('Stop')[0] === 'echo mio' && !s.autoCompactWindow, '--uninstall quita solo lo nuestro');
ok(!fs.readFileSync(env.CLAUDE_MD_PATH, 'utf8').includes('skills-ia:') && !fs.existsSync(path.join(home, 'skills', 'estado-proyecto')), '--uninstall quita bloques y enlaces');

fs.writeFileSync(env.CLAUDE_SETTINGS_PATH, '{roto');
r = run();
ok(r.status === 1 && fs.readFileSync(env.CLAUDE_SETTINGS_PATH, 'utf8') === '{roto', 'settings corrupto: aborta sin tocar');

fs.rmSync(home, { recursive: true, force: true });
console.log(fails ? `\n${fails} fallo(s)` : '\nTodo OK');
process.exit(fails ? 1 : 0);
