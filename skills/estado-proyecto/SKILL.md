---
name: estado-proyecto
description: Mantiene un ESTADO.md corto en la raíz del proyecto (pedido, hecho, queda, siguiente paso, cómo verificar) para poder retomar el trabajo en otro chat o con otra IA sin releer todo. Usar al empezar un proyecto que ya tiene ESTADO.md y al terminar un turno en el que se escribió o editó código o se entregó un plan de código.
---

# Estado del proyecto

## Reglas portables

- El archivo es `ESTADO.md` en la raíz del proyecto, máximo 15 líneas, y su primera línea es la marca `<!-- estado-proyecto -->`.
- Si ya existe un `ESTADO.md` SIN esa marca, no se toca: se usa `ESTADO-CLAUDE.md` con el mismo formato.
- Al empezar a trabajar en un proyecto que tiene `ESTADO.md`, léelo primero.
- Se SOBRESCRIBE entero cada vez (no es un historial) y se COMMITEA con el proyecto, junto al cambio.
- Se escribe una sola vez por turno, y solo tras escribir o editar código o entregar un plan de código. No en charlas ni en tareas sin código.
- Sin secretos (claves, tokens, contraseñas, datos personales).

Formato (todo en español, rutas relativas al proyecto):

```
<!-- estado-proyecto -->
# Estado — AAAA-MM-DD
Pedido: lo que pidió el usuario, en una línea.
Hecho: lo que ya está (rutas relativas: src/app.js, test/run.js).
Queda: lo que falta.
Siguiente paso: la acción concreta que sigue.
Verificar: cómo comprobar que funciona (comando o pasos).
Estado: plan propuesto | en curso | terminado sin verificar | verificado
```

`Estado: verificado` solo si se comprobó de verdad (tests ejecutados, app abierta). Si no se pudo comprobar algo, dilo en `Queda`.

## Solo en Claude Code (no aplicable en otras IAs)

Un hook `Stop` (`scripts/check.js`) bloquea el cierre del turno una vez si en el turno hubo `Edit`/`Write`/`NotebookEdit`, hay cambios sin commitear aparte del archivo de estado y el archivo de estado no está entre los modificados. Imprime `{"decision":"block","reason":"Actualiza ESTADO.md (≤15 líneas: hecho/queda/siguiente paso/verificar) y commitéalo"}`. Si `stop_hook_active` es true, si no es un repo git o ante cualquier error, sale con 0 sin bloquear. Se instala con `node scripts/install-claude.js` desde la raíz del repo `skills-ia`.

<!-- compacto -->
Estado del proyecto: mantén un archivo ESTADO.md en la raíz del proyecto, máximo 15 líneas, con la primera línea `<!-- estado-proyecto -->`. Formato: "# Estado — fecha", Pedido, Hecho (rutas relativas), Queda, Siguiente paso, Verificar, Estado (plan propuesto | en curso | terminado sin verificar | verificado). Se sobrescribe entero cada vez y se commitea con el proyecto. Si ya existe un ESTADO.md sin esa marca, no lo toques: usa ESTADO-CLAUDE.md. Escríbelo una vez por turno, solo tras escribir o editar código o entregar un plan de código; no en charlas. Al empezar en un proyecto que tiene ESTADO.md, léelo primero. Sin secretos. Marca "verificado" solo si lo comprobaste de verdad.
<!-- /compacto -->
<!-- una-linea: Al terminar un turno con código, actualiza ESTADO.md (≤15 líneas: hecho, queda, siguiente paso, verificar) y commitéalo; léelo al empezar. -->
