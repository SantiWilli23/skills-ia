---
name: plan-primero
description: Flujo obligatorio antes de programar. Usar siempre que el usuario pida crear, cambiar, arreglar o añadir algo en código. Primero se revisa el código y se hace un plan; se le muestra al usuario; solo cuando lo acepta se programa.
---

# Plan primero, programar después

Se aplica a todo pedido que implique tocar código. Preguntas, lecturas y explicaciones no necesitan este flujo.

## Reglas portables

### Fase 1: Planificar (no se escribe código)

1. Revisa el código real (archivos, funciones, quién llama a qué) antes de planificar.
2. Prepara el plan: archivos a tocar, pasos en orden, riesgos, cómo verificar que funciona y qué dudas quedan.

### Fase 2: Mostrar el plan y esperar

1. Muestra al usuario el plan en español, corto y claro (qué se hará, archivos, riesgos).
2. Si hay decisiones que de verdad son suyas, pregúntaselas.
3. **No programes nada hasta que el usuario acepte** ("ya", "dale", "ok", "acepto" o similar). Si pide cambios, ajusta el plan y vuelve a mostrarlo.

### Fase 3: Programar (solo tras la aceptación)

1. Sigue el plan aceptado sin rediseñarlo; si algo no cuadra, repórtalo en vez de improvisar.
2. Cuando termines, comprueba el resultado (diff, prueba o ejecución) antes de decir que está listo. Informa de lo que falló o no pudiste comprobar.
3. Al terminar, actualiza ESTADO.md (skill estado-proyecto) y commitéalo con el cambio; al subagente que programa pásale las reglas de minimo-necesario y verifica con revision.

### Notas

- Cambios triviales (una línea, un texto, un color) pueden saltarse la Fase 1: di en una frase qué harás, espera el "ya" y hazlo.
- Respeta las demás reglas del proyecto.

## Solo en Claude Code (no aplicable en otras IAs)

Subagentes y elección de modelo; el `effort` solo se fija porque el usuario lo pidió aquí.

- Fase 1: lanza un subagente con `Agent`: `subagent_type: Plan` (solo lectura), `model`: `opus` (Opus 5.5) en la mayoría de los casos, `fable` (Fable 5.2) para tareas muy grandes o ambiguas, rediseños o arquitectura; `effort`: `medium` si es un cambio acotado, `high` si hay varios archivos o sistemas, riesgo o bugs difíciles. En el prompt incluye el pedido con sus palabras, el contexto conocido (rutas, ramas, memoria) y que revise primero el código real con Grep/Read.
- Fase 2: las decisiones del usuario se preguntan con `AskUserQuestion`; informa de qué modelo y esfuerzo se usó.
- Fase 3: subagente con `Agent`: `subagent_type: general-purpose`, `model: sonnet` (Sonnet 5.5), `effort: low`. El prompt lleva el plan aceptado completo, los archivos exactos y cómo verificar.

<!-- compacto -->
Plan primero: cuando el usuario pida crear, cambiar o arreglar código, NO programes de inmediato. 1) Revisa el código real. 2) Muestra un plan corto en español: archivos a tocar, pasos, riesgos, cómo verificar, dudas. 3) Espera a que el usuario acepte ("ya", "dale", "ok"); si pide cambios, ajusta el plan. 4) Solo entonces programa, siguiendo el plan sin rediseñarlo; si algo no cuadra, repórtalo. 5) Verifica el resultado e informa de lo que falló o no pudiste comprobar. Cambios triviales: una frase de qué harás, esperar el "ya" y hacerlo. Al terminar, actualiza ESTADO.md (estado-proyecto).
<!-- /compacto -->
<!-- una-linea: Antes de programar, muestra un plan corto y espera la aceptación del usuario ("ya"); después implementa y verifica. -->
