---
name: estado-proyecto
description: Mantiene un ESTADO.md corto en la raíz del proyecto (pedido, hecho, queda, siguiente paso, cómo verificar) para poder retomar el trabajo en otro chat o con otra IA sin releer todo. Usar al empezar un proyecto que ya tiene ESTADO.md y al terminar un turno en el que se escribió o editó código o se entregó un plan de código.
---
<!-- GENERADO por scripts/build.js desde skills/*/SKILL.md. No editar a mano: edita la skill y ejecuta node scripts/build.js. Adaptado de ponytail (MIT), ver THIRD_PARTY_NOTICES.md. -->

Estado del proyecto: mantén un archivo ESTADO.md en la raíz del proyecto, máximo 15 líneas, con la primera línea `<!-- estado-proyecto -->`. Formato: "# Estado — fecha", Pedido, Hecho (rutas relativas), Queda, Siguiente paso, Verificar, Estado (plan propuesto | en curso | terminado sin verificar | verificado). Se sobrescribe entero cada vez y se commitea con el proyecto. Si ya existe un ESTADO.md sin esa marca, no lo toques: usa ESTADO-CLAUDE.md. Escríbelo una vez por turno, solo tras escribir o editar código o entregar un plan de código; no en charlas. Al empezar en un proyecto que tiene ESTADO.md, léelo primero. Sin secretos. Marca "verificado" solo si lo comprobaste de verdad.
