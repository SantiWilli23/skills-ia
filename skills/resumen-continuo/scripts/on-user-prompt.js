'use strict';
const L = require('./lib');
L.safeMain(() => {
  const i = L.readStdinJson();
  const p = L.clip(i.prompt, 300);
  if (!p) return;
  L.appendToSession(i, `\n### ${L.now()} · Usuario\n${p}\n`, p);
});
