'use strict';
// node scripts/build.js [--check]
// Genera AGENTS.md, plataformas/* y commands/*.toml desde skills/*/SKILL.md.
// Con --check no escribe: sale con 1 si algo está desincronizado o pasa un límite.
// Adaptado de ponytail (MIT), https://github.com/dietrichgebert/ponytail, © 2026 DietrichGebert. Ver THIRD_PARTY_NOTICES.md
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');

// Skills que van siempre activas en AGENTS.md y en el prompt corto; el resto se invoca por comando.
const ALWAYS_ON = ['sin-conformismo', 'minimo-necesario', 'plan-primero', 'estado-proyecto', 'resumen-continuo'];
const GROQ_FULL = ['sin-conformismo', 'minimo-necesario', 'plan-primero'];
const LIMITS = { chatgpt_field: 1500, groq_tokens: 2000, gemini_app: 8000, agents: 12000 };
const estTokens = (s) => Math.ceil(s.length / 3); // estimación prudente para español

const norm = (s) => s.replace(/\r\n/g, '\n');
const read = (p) => norm(fs.readFileSync(p, 'utf8'));

function loadSkills() {
  const dir = path.join(ROOT, 'skills');
  const skills = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const f = path.join(dir, name, 'SKILL.md');
    if (!fs.existsSync(f)) continue;
    const txt = read(f);
    const fm = /^---\n([\s\S]*?)\n---/.exec(txt);
    const desc = fm && /^description:\s*(.+)$/m.exec(fm[1]);
    const comp = /<!-- compacto -->\n([\s\S]*?)\n<!-- \/compacto -->/.exec(txt);
    const one = /<!-- una-linea: ([\s\S]*?) -->/.exec(txt);
    const errs = [];
    if (!desc) errs.push('falta description en el frontmatter');
    if (!comp) errs.push('falta el bloque <!-- compacto -->');
    if (!one) errs.push('falta <!-- una-linea: ... -->');
    if (!/^## Solo en Claude Code/m.test(txt)) errs.push('falta la sección "## Solo en Claude Code"');
    if (errs.length) throw new Error(`skills/${name}/SKILL.md: ${errs.join('; ')}`);
    skills.push({ name, description: desc[1].trim(), compact: comp[1].trim(), one: one[1].trim() });
  }
  return skills;
}

function build(skills) {
  const out = new Map(); // ruta relativa -> contenido
  const by = Object.fromEntries(skills.map((s) => [s.name, s]));
  const always = ALWAYS_ON.map((n) => by[n]).filter(Boolean);
  const onDemand = skills.filter((s) => !ALWAYS_ON.includes(s.name));
  const GEN = 'GENERADO por scripts/build.js desde skills/*/SKILL.md. No editar a mano: edita la skill y ejecuta node scripts/build.js. Adaptado de ponytail (MIT), ver THIRD_PARTY_NOTICES.md.';

  // AGENTS.md (siempre activo)
  let a = `<!-- ${GEN} -->\n# Reglas siempre activas (skills-ia)\n\nHabla en español sencillo. Si algo de abajo no se puede hacer en esta IA (hooks, subagentes, elegir modelo), omítelo sin avisar.\n`;
  for (const s of always) a += `\n## ${s.name}\n\n${s.compact}\n`;
  if (onDemand.length) {
    a += `\n## Bajo demanda\n\nEstas skills se piden con su nombre (comando \`/nombre\` o pidiéndolo):\n\n`;
    for (const s of onDemand) a += `- ${s.name}: ${s.one}\n`;
  }
  out.set('AGENTS.md', a);

  // Gemini app web (Skills): un archivo por skill
  for (const s of skills) {
    out.set(`plataformas/gemini-app/${s.name}.md`,
      `---\nname: ${s.name}\ndescription: ${s.description}\n---\n<!-- ${GEN} -->\n\n${s.compact}\n`);
  }

  // ChatGPT: instrucciones personalizadas (2 campos) y archivos para un Proyecto
  const f1 = 'Hablo español. Prefiero respuestas cortas y claras, sin relleno, y que me expliques los términos técnicos. (Añade aquí tu oficio, tu nivel y tus proyectos habituales.)';
  const f2 = 'Sigue siempre estas reglas:\n' + always.map((s) => `- ${s.one}`).join('\n') +
    '\nSi algo requiere hooks, subagentes o elegir modelo, ignóralo sin avisar. Si te pego el archivo compacto de una skill, síguelo.';
  out.set('plataformas/chatgpt/custom-instructions.md',
    `<!-- ${GEN} -->\n# Instrucciones personalizadas de ChatGPT\n\nPega cada bloque en su campo (Ajustes > Personalización > Instrucciones personalizadas). Cada campo admite 1500 caracteres.\n\n## Campo 1: ¿Qué debería saber ChatGPT sobre ti?\n\n\`\`\`\n${f1}\n\`\`\`\n\n## Campo 2: ¿Cómo quieres que responda ChatGPT?\n\n\`\`\`\n${f2}\n\`\`\`\n`);
  out.set('plataformas/chatgpt/_campos', JSON.stringify([f1, f2])); // solo para validar; no se escribe
  for (const s of skills) {
    out.set(`plataformas/chatgpt/proyecto/${s.name}.md`, `<!-- ${GEN} -->\n# ${s.name}\n\n${s.compact}\n`);
  }

  // Groq: prompt de sistema corto (límite de tokens del plan gratis)
  let g = 'Eres un asistente que responde en español sencillo. Sigue estas reglas.\n';
  for (const n of GROQ_FULL) g += `\n## ${n}\n${by[n].compact}\n`;
  g += '\n## Otras reglas\n';
  for (const s of skills.filter((x) => !GROQ_FULL.includes(x.name))) g += `- ${s.one}\n`;
  g += '\nSi algo requiere hooks, subagentes o elegir modelo, ignóralo sin avisar.\n';
  out.set('plataformas/groq/system-prompt.md', g);

  // Comandos Gemini CLI / Antigravity (formato como ponytail)
  for (const s of skills) {
    out.set(`commands/${s.name}.toml`,
      `# ${GEN}
description = ${JSON.stringify(s.one)}\nprompt = ${JSON.stringify(s.compact + ' Contexto o destino que indica el usuario: {{args}}')}\n`);
  }
  return out;
}

function validate(out) {
  const errs = [];
  const fields = JSON.parse(out.get('plataformas/chatgpt/_campos'));
  fields.forEach((f, i) => { if (f.length >= LIMITS.chatgpt_field) errs.push(`ChatGPT campo ${i + 1}: ${f.length} >= ${LIMITS.chatgpt_field} caracteres`); });
  const g = out.get('plataformas/groq/system-prompt.md');
  if (estTokens(g) >= LIMITS.groq_tokens) errs.push(`Groq system-prompt: ~${estTokens(g)} tokens >= ${LIMITS.groq_tokens}`);
  if (out.get('AGENTS.md').length > LIMITS.agents) errs.push(`AGENTS.md: ${out.get('AGENTS.md').length} > ${LIMITS.agents} caracteres`);
  for (const [p, c] of out) if (p.startsWith('plataformas/gemini-app/') && c.length > LIMITS.gemini_app) errs.push(`${p}: ${c.length} > ${LIMITS.gemini_app} caracteres`);
  return errs;
}

function main() {
  const skills = loadSkills();
  const out = build(skills);
  const errs = validate(out);
  out.delete('plataformas/chatgpt/_campos');
  if (errs.length) { console.error('Límites superados:\n- ' + errs.join('\n- ')); process.exit(1); }

  if (check) {
    const bad = [];
    for (const [p, c] of out) {
      const f = path.join(ROOT, p);
      if (!fs.existsSync(f) || read(f) !== c) bad.push(p);
    }
    // archivos generados que ya no corresponden a ninguna skill
    for (const base of ['plataformas', 'commands']) {
      const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
      for (const f of walk(path.join(ROOT, base))) {
        const rel = path.relative(ROOT, f).replace(/\\/g, '/');
        if (!out.has(rel) && /\.(md|toml)$/.test(rel) && !rel.startsWith('plataformas/groq/chat')) bad.push(rel + ' (sobra)');
      }
    }
    if (bad.length) { console.error('Desincronizado (ejecuta node scripts/build.js):\n- ' + bad.join('\n- ')); process.exit(1); }
    console.log(`OK: ${out.size} archivos generados al día, límites respetados.`);
    return;
  }
  for (const [p, c] of out) {
    const f = path.join(ROOT, p);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, c);
  }
  const g = out.get('plataformas/groq/system-prompt.md');
  console.log(`Generados ${out.size} archivos. Groq ~${estTokens(g)} tokens; AGENTS.md ${out.get('AGENTS.md').length} caracteres.`);
}

try { main(); } catch (e) { console.error('build: ' + e.message); process.exit(1); }
