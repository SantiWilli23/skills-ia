'use strict';
// node test/run.js — prueba el hook Stop con repos git temporales y transcripts sintéticos.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const CHECK = path.join(__dirname, '..', 'scripts', 'check.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'estado-test-'));
let fails = 0;
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FAIL ') + m); if (!c) fails++; };
const git = (cwd, ...a) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd, encoding: 'utf8' });
const j = (o) => JSON.stringify(o) + '\n';

function repo(name) {
  const d = path.join(tmp, name);
  fs.mkdirSync(d);
  git(d, 'init', '-q');
  fs.writeFileSync(path.join(d, 'app.js'), 'x\n');
  git(d, 'add', '-A');
  git(d, 'commit', '-qm', 'base');
  return d;
}
function transcript(name, edit) {
  const f = path.join(tmp, name + '.jsonl');
  let s = j({ type: 'user', message: { content: 'turno viejo' } }) +
    j({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Edit', input: {} }] } }) + // edición de un turno anterior
    j({ type: 'user', message: { content: [{ type: 'text', text: 'hazlo' }] } });
  if (edit) s += j({ type: 'assistant', message: { content: [{ type: 'tool_use', name: edit, input: {} }] } }) +
    j({ type: 'user', message: { content: [{ type: 'tool_result', content: 'ok' }] } });
  s += j({ type: 'assistant', message: { content: [{ type: 'text', text: 'listo' }] } });
  fs.writeFileSync(f, s);
  return f;
}
function run(input, raw) {
  return spawnSync('node', [CHECK], { input: raw !== undefined ? raw : JSON.stringify(input), encoding: 'utf8' });
}
const blocked = (r) => { try { return JSON.parse(r.stdout).decision === 'block'; } catch (e) { return false; } };

// 1. edición + cambios sin ESTADO.md -> bloquea
let d = repo('a');
fs.writeFileSync(path.join(d, 'app.js'), 'y\n');
let r = run({ cwd: d, transcript_path: transcript('a', 'Edit') });
ok(r.status === 0 && blocked(r) && r.stdout.includes('Actualiza ESTADO.md'), 'edición + cambios sin ESTADO.md: bloquea');

// 2. stop_hook_active -> no bloquea
r = run({ cwd: d, transcript_path: transcript('a2', 'Edit'), stop_hook_active: true });
ok(r.status === 0 && r.stdout === '', 'stop_hook_active true: no bloquea');

// 3. ESTADO.md modificado -> no bloquea
fs.writeFileSync(path.join(d, 'ESTADO.md'), '<!-- estado-proyecto -->\n# Estado\n');
r = run({ cwd: d, transcript_path: transcript('a3', 'Write') });
ok(r.status === 0 && r.stdout === '', 'ESTADO.md entre los modificados: no bloquea');

// 4. sin ediciones en el turno -> no bloquea (aunque haya cambios)
d = repo('b');
fs.writeFileSync(path.join(d, 'app.js'), 'y\n');
r = run({ cwd: d, transcript_path: transcript('b', null) });
ok(r.status === 0 && r.stdout === '', 'sin Edit/Write en el turno: no bloquea');

// 5. sin cambios en git -> no bloquea
d = repo('c');
r = run({ cwd: d, transcript_path: transcript('c', 'Edit') });
ok(r.status === 0 && r.stdout === '', 'sin cambios en git: no bloquea');

// 6. solo ESTADO.md cambiado -> no bloquea
d = repo('d');
fs.writeFileSync(path.join(d, 'ESTADO.md'), '<!-- estado-proyecto -->\n');
r = run({ cwd: d, transcript_path: transcript('d', 'Edit') });
ok(r.status === 0 && r.stdout === '', 'solo cambió ESTADO.md: no bloquea');

// 7. ESTADO.md ajeno (sin marca): exige ESTADO-CLAUDE.md
d = repo('e');
fs.writeFileSync(path.join(d, 'ESTADO.md'), '# Notas del usuario\n');
git(d, 'add', '-A'); git(d, 'commit', '-qm', 'estado ajeno');
fs.writeFileSync(path.join(d, 'app.js'), 'z\n');
fs.writeFileSync(path.join(d, 'ESTADO.md'), '# Notas del usuario\nmás\n');
r = run({ cwd: d, transcript_path: transcript('e', 'Edit') });
ok(blocked(r), 'ESTADO.md sin marca modificado no cuenta: bloquea');
fs.writeFileSync(path.join(d, 'ESTADO-CLAUDE.md'), '<!-- estado-proyecto -->\n');
r = run({ cwd: d, transcript_path: transcript('e2', 'Edit') });
ok(r.stdout === '', 'con ESTADO-CLAUDE.md modificado: no bloquea');

// 8. no es repo git / transcript inexistente / JSON corrupto / stdin vacío
const nogit = path.join(tmp, 'nogit'); fs.mkdirSync(nogit);
r = run({ cwd: nogit, transcript_path: transcript('n', 'Edit') });
ok(r.status === 0 && r.stdout === '', 'no es repo git: sale 0 sin bloquear');
r = run({ cwd: d, transcript_path: path.join(tmp, 'no-existe.jsonl') });
ok(r.status === 0 && r.stdout === '', 'transcript inexistente: sale 0');
r = run(null, '{ esto no es json');
ok(r.status === 0 && r.stdout === '', 'JSON corrupto: sale 0');
r = run(null, '');
ok(r.status === 0 && r.stdout === '', 'stdin vacío: sale 0');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? `\n${fails} fallo(s)` : '\nTodo OK');
process.exit(fails ? 1 : 0);
