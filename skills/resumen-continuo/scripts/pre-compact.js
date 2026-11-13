'use strict';
const L = require('./lib');
L.safeMain(() => {
  L.readStdinJson();
  const t = [
    'Resume la conversación en español para poder continuar sin perder nada. Incluye, con estos apartados:',
    '1. Objetivo: qué quiere lograr el usuario y para qué.',
    '2. Decisiones tomadas y por qué (incluye las descartadas).',
    '3. Archivos y rutas: cada archivo creado o modificado con su ruta absoluta y qué cambió; comandos y URLs importantes.',
    '4. Estado actual: qué funciona, qué está a medias, resultados de pruebas y errores abiertos.',
    '5. Pendientes: próximos pasos concretos en orden.',
    '6. Preferencias del usuario: idioma, estilo, reglas que pidió (por ejemplo plan primero y programar con "ya", nunca /clear).',
    '7. Resumen acumulado: si ya existía un resumen anterior, condénsalo y fúndelo en este, sin perder datos clave ni repetir.',
    'Sé concreto y breve: sin relleno, conserva nombres, rutas, números y comandos exactos.',
  ].join('\n');
  process.stdout.write(t.slice(0, 10000));
});
