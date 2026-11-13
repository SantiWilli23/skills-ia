'use strict';
const fs = require('fs');
const L = require('./lib');
const LIMIT = 6000;
L.safeMain(() => {
  const i = L.readStdinJson();
  const { file, dir } = L.sessionFile(i);
  if (!fs.existsSync(file)) return;
  const head = `Resumen continuo de esta sesión guardado en: ${file}\nÍndice del proyecto: ${dir}\\INDEX.md\nÚltimos turnos (el archivo completo tiene todo; léelo si necesitas más):\n\n`;
  const text = fs.readFileSync(file, 'utf8');
  const room = LIMIT - head.length;
  const body = text.length > room ? '…' + text.slice(text.length - room + 1) : text;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: (head + body).slice(0, LIMIT) },
  }));
});
