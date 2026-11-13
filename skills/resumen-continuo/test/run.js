'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const S = path.join(__dirname, '..', 'scripts');
const F = path.join(__dirname, 'fixtures');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-test-'));
const env = Object.assign({}, process.env, { RESUMEN_CONTINUO_DIR: path.join(tmp, 'res') });
let fails = 0;
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FAIL ') + m); if (!c) fails++; };

function run(script, input, extraEnv) {
  const r = spawnSync('node', [path.join(S, script)], { input, env: Object.assign({}, env, extraEnv || {}), encoding: 'utf8' });
  return r;
}
const fx = (n) => fs.readFileSync(path.join(F, n), 'utf8');

// Transcript sintético con un wrap_up y usage (300000 tokens = 30%)
const tr = path.join(tmp, 't.jsonl');
const mk = (o) => JSON.stringify(o) + '\n';
fs.writeFileSync(tr,
  mk({ type: 'user', isSidechain: false, message: { content: 'hola' } }) +
  mk({ type: 'assistant', isSidechain: true, message: { usage: { input_tokens: 999999 } } }) +
  mk({ type: 'assistant', isSidechain: false, message: { usage: { input_tokens: 10, cache_creation_input_tokens: 90, cache_read_input_tokens: 299900 }, content: [{ type: 'tool_use', name: 'mcp__ccd_turn__wrap_up', input: { recap: 'Marcador añadido y guardado.' } }] } }));

const sessFile = path.join(env.RESUMEN_CONTINUO_DIR, 'Mi-App', 'sess-test.md');

let r = run('on-user-prompt.js', fx('user-prompt.json'));
ok(r.status === 0 && fs.existsSync(sessFile), 'user-prompt crea el archivo de sesión');
ok(fs.existsSync(path.join(env.RESUMEN_CONTINUO_DIR, 'Mi-App', 'INDEX.md')), 'INDEX.md creado');

r = run('on-stop.js', fx('stop.json').replace('__TRANSCRIPT__', tr.replace(/\\/g, '\\\\')));
const txt = fs.readFileSync(sessFile, 'utf8');
ok(r.status === 0 && txt.includes('Marcador añadido y guardado.'), 'stop usa el recap del wrap_up');
ok(txt.includes('30%'), 'stop registra 30% de contexto');
ok(r.stdout.includes('systemMessage') && r.stdout.includes('/compact'), 'stop avisa /compact sobre 25%');

r = run('on-stop.js', JSON.stringify({ session_id: 'sess-test', cwd: 'C:\\Proyectos\\Mi App', stop_hook_active: true, last_assistant_message: 'NO' }));
ok(r.status === 0 && !fs.readFileSync(sessFile, 'utf8').includes('NO\n') && r.stdout === '', 'stop con stop_hook_active no hace nada');

r = run('on-stop.js', fx('stop.json').replace('__TRANSCRIPT__', 'no-existe.jsonl'));
ok(r.status === 0 && fs.readFileSync(sessFile, 'utf8').includes('Listo, he añadido'), 'stop sin transcript usa last_assistant_message');

r = run('pre-compact.js', fx('pre-compact.json'));
ok(r.status === 0 && r.stdout.length > 100 && r.stdout.length <= 10000 && r.stdout.includes('Pendientes'), 'pre-compact imprime instrucciones');

r = run('post-compact.js', fx('post-compact.json'));
ok(r.status === 0 && fs.readFileSync(sessFile, 'utf8').includes('## Compactación 1 (auto,'), 'post-compact añade Compactación 1');
run('post-compact.js', fx('post-compact.json'));
ok(fs.readFileSync(sessFile, 'utf8').includes('## Compactación 2 (auto,'), 'post-compact numera la 2');

r = run('session-start.js', fx('session-start.json'));
let j = null; try { j = JSON.parse(r.stdout); } catch (e) {}
ok(r.status === 0 && j && j.hookSpecificOutput.hookEventName === 'SessionStart' && j.hookSpecificOutput.additionalContext.includes('sess-test.md') && j.hookSpecificOutput.additionalContext.length <= 6000, 'session-start devuelve additionalContext <= 6000');

for (const s of ['on-user-prompt.js', 'on-stop.js', 'pre-compact.js', 'post-compact.js', 'session-start.js']) {
  r = run(s, fx('corrupto.json'));
  ok(r.status === 0, `${s} con JSON corrupto sale con 0`);
  r = run(s, '');
  ok(r.status === 0, `${s} con stdin vacío sale con 0`);
}

// lib sobre un transcript real (solo lectura)
const L = require(path.join(S, 'lib.js'));
// Opcional: RESUMEN_TEST_TRANSCRIPT=<ruta a un .jsonl real> (solo lectura)
const realFile = process.env.RESUMEN_TEST_TRANSCRIPT || null;
if (realFile) {
  const u = L.contextUsage(realFile);
  console.log('     transcript real: ' + realFile + ' -> ' + JSON.stringify(u));
  ok(u && u.pct > 0 && u.pct <= 100, 'lib mide un % razonable en transcript real');
} else {
  console.log('SKIP transcript real no encontrado');
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(fails ? `\n${fails} fallo(s)` : '\nTodo OK');
process.exit(fails ? 1 : 0);
