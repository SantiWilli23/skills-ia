'use strict';
// Chat por terminal con Groq usando plataformas/groq/system-prompt.md. Node 18+, sin dependencias.
//   export GROQ_API_KEY=...   (la clave SOLO se lee del entorno; este archivo nunca la guarda)
//   node plataformas/groq/chat.js            chat interactivo
//   node plataformas/groq/chat.js --once "pregunta"
// Opcionales: GROQ_MODEL (por defecto llama-3.3-70b-versatile), GROQ_RESUMEN_FILE (por defecto ./groq-resumen.md),
// GROQ_API_URL (solo para pruebas). Cada turno se añade al archivo de resumen y se recuerdan los últimos al empezar.
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const RESUMEN = process.env.GROQ_RESUMEN_FILE || path.join(process.cwd(), 'groq-resumen.md');
const MAX_RESUMEN_CHARS = 3000; // el plan gratis tiene pocos tokens: solo el final del resumen
const MAX_TURNS_IN_MEMORY = 6;

const KEY = process.env.GROQ_API_KEY;
if (!KEY) {
  console.error('Falta GROQ_API_KEY. Ejemplo: export GROQ_API_KEY=tu_clave (no se guarda en ningún archivo).');
  process.exit(1);
}

const system = fs.readFileSync(path.join(__dirname, 'system-prompt.md'), 'utf8');
let previo = '';
try {
  const t = fs.readFileSync(RESUMEN, 'utf8');
  previo = t.length > MAX_RESUMEN_CHARS ? t.slice(-MAX_RESUMEN_CHARS) : t;
} catch (e) { /* primera vez */ }

const history = [];

async function ask(text) {
  history.push({ role: 'user', content: text });
  const messages = [{ role: 'system', content: system + (previo ? `\n\nResumen de conversaciones anteriores:\n${previo}` : '') }]
    .concat(history.slice(-MAX_TURNS_IN_MEMORY * 2));
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, messages }),
  });
  if (!res.ok) {
    history.pop();
    throw new Error(`Groq respondió ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  const answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!answer) { history.pop(); throw new Error('Respuesta sin contenido'); }
  history.push({ role: 'assistant', content: answer });
  const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s).replace(/\s+/g, ' ');
  fs.appendFileSync(RESUMEN, `- ${new Date().toISOString().slice(0, 16)} Usuario: ${clip(text, 300)} | Respuesta: ${clip(answer, 500)}\n`);
  return answer;
}

async function main() {
  const i = process.argv.indexOf('--once');
  if (i !== -1) {
    console.log(await ask(process.argv.slice(i + 1).join(' ')));
    return;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`Groq (${MODEL}). Escribe tu mensaje; "salir" para terminar.`);
  const loop = () => rl.question('> ', async (line) => {
    if (!line.trim() || line.trim() === 'salir') { rl.close(); return; }
    try { console.log('\n' + (await ask(line)) + '\n'); } catch (e) { console.error('Error: ' + e.message); }
    loop();
  });
  loop();
}

main().catch((e) => { console.error('Error: ' + e.message); process.exit(1); });
