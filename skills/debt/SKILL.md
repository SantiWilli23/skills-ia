---
name: debt
description: Lista todos los comentarios `shortcut:` del código como libro de deuda técnica. Informe de una sola vez, sin cambiar nada. Usar para "deuda", "qué atajos dejamos", "lista los shortcuts".
---

<!-- Adaptado de ponytail-debt (MIT), https://github.com/dietrichgebert/ponytail, © 2026 DietrichGebert. Ver THIRD_PARTY_NOTICES.md -->

# Debt

Cada atajo deliberado (ver `minimo-necesario`) se marca con un comentario `shortcut: <límite>, <cuándo mejorar>`. Esta skill los reúne en un libro para que un aplazamiento no se vuelva permanente sin que nadie lo note.

## Reglas portables

### Escanear

Busca en el repo los marcadores de comentario, sin `.git` ni lo que ignoren los `.gitignore` (dependencias, salida de build, cachés):

`git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?shortcut:'` (añade otros prefijos de comentario si tu lenguaje los usa)

Si el usuario nombra su propia palabra marcador, busca esa. Cada resultado es una fila. Salta los que no sean un aplazamiento (p. ej. una nota sobre un atajo de teclado).

### Salida

Una fila por marcador, agrupadas por archivo:

`<archivo>:<línea>, <qué se simplificó>. límite: <el límite>. mejora: <cuándo revisarlo>.`

Marca con `sin-disparador` los comentarios que no nombran cuándo mejorar: son los que se pudren en silencio. Si el usuario lo quiere, añade el autor con `git blame -L<línea>,<línea>`.

Cierra con `<N> marcadores, <M> sin disparador.` Si no hay ninguno: `Sin deuda de atajos. Libro limpio.`

### Límites

Solo lee e informa. Para guardarlo, que el usuario lo pida y se escribe en un archivo (p. ej. `DEUDA.md`).

## Solo en Claude Code (no aplicable en otras IAs)

- Se puede usar Grep en vez del comando de `git grep`; el resultado es el mismo.

<!-- compacto -->
Debt: busca en el repo los comentarios `shortcut:` (por ejemplo con `git grep -nE '(#|//|/[*]) ?shortcut:'`) y haz un libro de deuda: una fila por marcador, `<archivo>:<línea>, <qué se simplificó>. límite: <límite>. mejora: <cuándo revisarlo>`. Los que no nombran cuándo mejorar llevan la etiqueta `sin-disparador`. Cierra con "<N> marcadores, <M> sin disparador." o "Sin deuda de atajos." Solo informa; guardarlo en un archivo solo si el usuario lo pide.
<!-- /compacto -->
<!-- una-linea: Lista los comentarios `shortcut:` como libro de deuda técnica; solo informa. -->
