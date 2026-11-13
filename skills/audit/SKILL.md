---
name: audit
description: Auditoría de calidad de un repo entero (o de una carpeta): bugs, fallos de seguridad, qué se rompe con carga real, código arriesgado sin tests, rutas lentas y qué borrar, fusionar o dividir. Informe ordenado, una sola vez, sin cambiar nada. Usar para "audita este código", "revisa todo el repo", "busca código sobrante", "¿qué puedo borrar?".
---

<!-- Adaptado de ponytail-audit (MIT), https://github.com/dietrichgebert/ponytail, © 2026 DietrichGebert. Ver THIRD_PARTY_NOTICES.md -->

# Audit

Audita el repo entero como el desarrollador senior que acaba de heredarlo y al que llamarán cuando se rompa. Orden de importancia: correcto, seguro, aguanta la carga, probado, rápido, ajustado. Es un informe que el usuario pidió, así que dalo completo.

## Reglas portables

### 1. Mapear primero

- Audita lo que el usuario nombre: una carpeta, un paquete o todo el repo.
- Lee el README, la configuración de despliegue y construcción, la lista de dependencias, los puntos de entrada (main, rutas, handlers, jobs, comandos) y los tests.
- Busca la carga esperada (una persona con un script o muchos usuarios a la vez) y di cuál supusiste.
- Sigue los flujos principales de punta a punta y lee del todo: entradas de usuarios, dinero, autenticación, escritura de datos, tareas en segundo plano, lo compartido entre procesos.
- Repo grande: profundiza donde un fallo cuesta más, no archivo por archivo. Di qué partes no leíste.

### 2. Qué buscar

1. **Bug:** resultado erróneo, fallo, caso límite olvidado, llamadores que no coinciden con lo que devuelve una función, la misma regla aplicada distinto en dos sitios.
2. **Riesgo:** seguridad (inyección, aleatoriedad débil, secretos en el código, entradas sin comprobar), pérdida de datos (errores tragados, escrituras en mal orden, sin transacción).
3. **Escala:** carreras comprobar-y-escribir, trabajo repetido por cada proceso, memoria que solo crece, una consulta por elemento, O(n^2), estado por proceso que debería compartirse.
4. **Falta test:** lógica arriesgada sin un test que falle cuando se rompa. Un buen test, no cobertura.
5. **Velocidad:** lo grande es problema; lo pequeño, sugerencia.
6. **Ajustado:** borrar (código muerto, opciones y flags sin usar), reutilizar (dos funciones que hacen lo mismo), librería estándar o nativa en vez de dependencia, abstracciones sin necesidad (interfaz con una implementación, envoltorio que solo pasa llamadas), fusionar copias casi iguales, dividir una función que hace varios trabajos (por trabajo, nunca por número de líneas).

### 3. Comprobar antes de informar

- Cada hallazgo necesita un caso concreto; sin caso, no hay hallazgo.
- Antes de llamar "sin usar" a un código, busca en todo el árbol, incluidos tests, fixtures, configuración y referencias dinámicas por texto.
- Un atajo con comentario `shortcut:` que nombra su límite es una decisión, no un hallazgo, salvo que la carga ya lo supere.
- Propón el arreglo más pequeño, preferiblemente borrando código. Nada de gustos de estilo ni "quizá".

### 4. Salida

Español sencillo, frases cortas. Empieza con `Qué hace este repo:` en dos o tres frases y la carga supuesta. Luego los hallazgos, lo más importante primero, en tres grupos (omite los vacíos): Hay que arreglar, Conviene arreglar, Opcional. Numerados en todos los grupos; máximo 20 (di cuántos menores dejaste fuera). Cada uno: título en negrita con archivo:líneas y cuatro viñetas cortas (Qué es, Problema, Arreglo, Si no se arregla).

Termina con `Veredicto:` una línea (sano, o qué arreglar primero), `Ajustado: se pueden quitar N líneas y M dependencias.` si aplica, y `Sin comprobar:` las partes que no leíste o no pudiste ejecutar. Si no hay nada: `Sano. Nada que arreglar.` y una línea con lo que comprobaste. Informe de una sola vez; no cambia código.

## Solo en Claude Code (no aplicable en otras IAs)

- En repos grandes se puede repartir el mapeo entre subagentes de solo lectura (`Explore`) y juntar sus conclusiones; el informe final lo escribe el agente principal.

<!-- compacto -->
Audit: audita el repo (o la carpeta que nombre el usuario) como el senior que acaba de heredarlo. Primero mapea: README, despliegue, dependencias, puntos de entrada, tests y la carga esperada (di cuál supusiste). Lee a fondo donde un fallo cuesta más: entradas de usuarios, dinero, autenticación, escritura de datos. Busca bugs, riesgos (seguridad, pérdida de datos), problemas de escala, lógica arriesgada sin test, lentitud real y código que sobra (muerto, duplicado, lo que ya hace la librería estándar; antes de llamarlo "sin usar" búscalo en todo el árbol). Cada hallazgo necesita un caso concreto. Un `shortcut:` con su límite es una decisión. Salida en español sencillo: "Qué hace este repo", hallazgos numerados (Hay que arreglar / Conviene / Opcional, máx. 20) con Qué es, Problema, Arreglo, Si no se arregla; cierra con Veredicto, Ajustado y Sin comprobar. No cambies código.
<!-- /compacto -->
<!-- una-linea: Auditoría de todo el repo (bugs, seguridad, escala, tests, código sobrante) en un informe ordenado; no cambia nada. -->
