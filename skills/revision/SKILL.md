---
name: revision
description: Revisión de calidad de un cambio (diff, rama, PR o archivos): ¿la lógica es correcta, es segura, aguanta la carga real, el código arriesgado tiene test, es rápido y sobra algo? Lee el código conectado, no solo el diff. Usar para "revisa esto", "code review", "revisa el último commit", "¿está sobreingeniado?".
---

<!-- Adaptado de ponytail-review (MIT), https://github.com/dietrichgebert/ponytail, © 2026 DietrichGebert. Ver THIRD_PARTY_NOTICES.md -->

# Revisión

Revisa un cambio como el desarrollador senior al que llamarán cuando se rompa. Orden de importancia: correcto, seguro, aguanta la carga, probado, rápido, ajustado. Ajustado también importa: cada línea extra hay que leerla, probarla y arreglarla después. Es un informe que el usuario pidió, así que dalo completo.

## Reglas portables

### 1. Entender primero

- Revisa lo que el usuario nombre: cambios sin commit o en staging, una rama, un enlace de PR o archivos. Si no nombra nada: los cambios sin commit, o el último commit si no hay.
- Lee el diff y luego el código que toca: llamadores de cada función cambiada, las funciones que llama, los tests y el README.
- Sigue el flujo real: por dónde entran los datos, qué se guarda, qué sale.
- Un cambio puede romper código que no toca. Si cambia una firma, un valor devuelto o un comportamiento, busca todos los llamadores.
- Busca la carga esperada en el repo (README, configuración de despliegue): una persona ejecutando un script o muchos usuarios y procesos a la vez. Juzga la escala con eso y di qué carga supusiste.

### 2. Qué buscar

1. **Bug:** resultado erróneo, fallo, caso límite olvidado (vacío, cero, último elemento, redondeo, zonas horarias), un llamador roto por el cambio, un arreglo en un llamador mientras la función compartida sigue rota.
2. **Riesgo:** fallos de seguridad (inyección, aleatoriedad débil, secretos, falta de comprobación de entradas de usuarios), pérdida de datos (errores tragados, escrituras en mal orden, sin transacción).
3. **Escala:** bien para un usuario, mal para muchos: carreras comprobar-y-escribir, el mismo trabajo hecho por cada proceso, memoria o listas que solo crecen, una consulta por elemento, O(n^2) con entradas grandes, estado por proceso que debería compartirse.
4. **Falta test:** lógica nueva arriesgada (una rama, un parser, dinero, seguridad, escritura de datos, un arreglo de bug) sin un test que falle cuando se rompa. Un buen test, no cobertura.
5. **Velocidad:** las lentitudes grandes son problemas. Las mejoras pequeñas (trabajo repetido en un bucle caliente) son sugerencias.
6. **Ajustado:** código que no debería existir o debería ser más pequeño: borrar (código muerto, opciones sin usar, funciones especulativas), reutilizar (el repo ya tiene esa función: nombra la ruta), librería estándar o nativa en vez de código propio o una dependencia nueva, abstracciones con una sola implementación, copias casi iguales que hay que fusionar, una función que hace varios trabajos sin relación (dividir por trabajo, nunca por número de líneas).

### 3. Comprobar antes de informar

- Cada hallazgo necesita un caso concreto: "esta entrada o situación lleva a este resultado erróneo". Sin caso, no hay hallazgo.
- Relee las líneas y confirma: el llamador existe, el valor de verdad puede estar vacío, el código de verdad no se usa.
- Un atajo marcado con un comentario `shortcut:` que nombra su límite es una decisión, no un hallazgo, salvo que la carga esperada ya lo supere.
- Propón el arreglo más pequeño que funcione. Prefiere los que borran código. Nunca añadas capas.
- Nada de gustos de estilo ni "quizá", ni preocupaciones vagas.

### 4. Salida

Español sencillo: frases cortas, palabras de todos los días. Explica un término técnico la primera vez. Quien lee puede no haber visto nunca este código.

Empieza con `Qué hace este cambio:` en dos o tres frases y la carga que supusiste. Luego los hallazgos en tres grupos (omite los vacíos): **Hay que arreglar** (bug, seguridad, pérdida de datos, rompe con la carga esperada), **Conviene arreglar** (código arriesgado sin test, lentitud real, duplicación, función que mezcla trabajos, código que sobra) y **Opcional** (mejoras pequeñas). Numera los hallazgos en todos los grupos para que el usuario diga "arregla el 2 y el 5". Cada hallazgo lleva un título en negrita con archivo:líneas y cuatro viñetas, cada una de una o dos frases cortas: Qué es, Problema, Arreglo, Si no se arregla.

Termina con `Veredicto: Se puede publicar.` o `Veredicto: arregla antes el 1 y el 3.`, `Ajustado: se pueden quitar N líneas.` si hay hallazgos de ese tipo, y `Sin comprobar:` una línea si algo importaba y no pudiste comprobarlo. Si no hay nada: `Qué hace este cambio:`, luego `Se ve bien. Publicar.` y una línea con lo que comprobaste.

Solo lista hallazgos; no cambia código.

## Solo en Claude Code (no aplicable en otras IAs)

- Para revisar el resultado de un subagente que programó, usa esta skill sobre su diff antes de decirle al usuario que está listo.
- Puede apoyarse en `git diff`, `git show` y Grep para encontrar llamadores.

<!-- compacto -->
Revisión: revisa el cambio que nombre el usuario (si no, los cambios sin commit o el último commit) como el senior al que llamarán cuando se rompa. Lee el diff y el código conectado: llamadores de cada función cambiada, tests, README, y la carga esperada. Busca en este orden: bugs (casos límite, llamadores rotos), riesgos (seguridad, pérdida de datos), escala (carreras, una consulta por elemento, memoria que crece), falta de test en lógica arriesgada, lentitud real, y sobra (código muerto, lo que ya hace la librería estándar o el repo, abstracciones con una sola implementación). Cada hallazgo necesita un caso concreto; sin caso, no hay hallazgo. Un atajo con comentario `shortcut:` es una decisión. Propón el arreglo más pequeño, preferiblemente borrando código. Español sencillo. Formato: "Qué hace este cambio", hallazgos numerados (Hay que arreglar / Conviene / Opcional) con Qué es, Problema, Arreglo, Si no se arregla; cierra con Veredicto y Sin comprobar. Si no hay nada: "Se ve bien. Publicar." No cambies código.
<!-- /compacto -->
<!-- una-linea: Revisa un cambio: bugs, seguridad, escala, tests y código que sobra, con un caso concreto por hallazgo; no cambia código. -->
