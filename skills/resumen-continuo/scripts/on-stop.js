'use strict';
const L = require('./lib');
L.safeMain(() => {
  const i = L.readStdinJson();
  if (i.stop_hook_active === true) return;
  const entries = L.tailEntries(i.transcript_path);
  const recap = L.lastRecap(entries);
  const summary = recap ? L.clip(recap, 800) : L.clip(i.last_assistant_message, 400);
  const u = L.contextUsage(i.transcript_path, entries);
  const pctTxt = u ? `${u.pct}% (${u.used} de ${u.window} tokens)` : 'desconocido';
  if (summary) {
    L.appendToSession(i, `**Resumen del turno:** ${summary}\n*Contexto: ${pctTxt}*\n`, '');
  }
  if (u && u.pct > L.THRESHOLD_PCT) {
    process.stdout.write(JSON.stringify({
      systemMessage: `Contexto al ${u.pct}% (umbral ${L.THRESHOLD_PCT}%). Escribe /compact para compactar; Claude no puede hacerlo por ti. Tus chats no se borran.`,
    }));
  }
});
