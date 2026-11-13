'use strict';
// Uso: node status.js [ruta-transcript.jsonl]   (sin argumento: el más reciente del proyecto actual)
const fs = require('fs');
const os = require('os');
const path = require('path');
const L = require('./lib');
L.safeMain(() => {
  let t = process.argv[2];
  if (!t) {
    const slug = process.cwd().replace(/[^A-Za-z0-9]/g, '-');
    const d = path.join(os.homedir(), '.claude', 'projects', slug);
    const fl = fs.readdirSync(d).filter((f) => f.endsWith('.jsonl'))
      .map((f) => ({ f: path.join(d, f), m: fs.statSync(path.join(d, f)).mtimeMs }))
      .sort((a, b) => b.m - a.m);
    t = fl[0] && fl[0].f;
  }
  const u = L.contextUsage(t);
  console.log(u
    ? `Contexto: ${u.pct}% (${u.used} de ${u.window} tokens). Umbral ${L.THRESHOLD_PCT}%.${u.pct > L.THRESHOLD_PCT ? ' Escribe /compact.' : ''}`
    : 'Contexto: desconocido');
  console.log('Resúmenes en: ' + L.resumenesRoot());
});
