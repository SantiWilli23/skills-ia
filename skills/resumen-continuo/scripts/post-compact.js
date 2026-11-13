'use strict';
const fs = require('fs');
const L = require('./lib');
L.safeMain(() => {
  const i = L.readStdinJson();
  const s = i.compact_summary;
  if (!s) return;
  const { file } = L.sessionFile(i);
  let n = 1;
  try { n = (fs.readFileSync(file, 'utf8').match(/^## Compactación \d+/gm) || []).length + 1; } catch (e) {}
  const kind = i.trigger === 'auto' ? 'auto' : 'manual';
  L.appendToSession(i, `\n## Compactación ${n} (${kind}, ${L.now()})\n${s}\n`, 'Compactación');
});
