---
name: diseno-web
description: Skill maestra de diseño web y de interfaces. Úsala para crear o mejorar landing pages, sitios, apps y componentes con dirección visual propia, tipografía, color, movimiento, accesibilidad (WCAG 2.2), sistema de diseño, responsive y conversión. Triggers - "diseña una web", "landing page", "mejora este diseño", "que no parezca plantilla", "paleta", "tipografía", "accesibilidad", "design system", "tokens", "animación", "UI", "UX".
---

# Diseño web - skill maestra

Índice y flujo. Carga solo la referencia que necesites. El contenido de las referencias es propio, resumido y reescrito a partir de fuentes abiertas (ver `references/SOURCES.md`).

## 1. Flujo

1. **Brief** (preguntar solo lo que no se pueda deducir): público, objetivo, UNA acción principal, marca existente (logo, colores, tono), stack.
2. **Dirección visual concreta** (`01`): tema, paleta de 4-6 colores, tipografía, composición. Revisarla contra el brief: si sirve para cualquier web, no es una dirección.
3. **Tokens** (`05`, `07`): colores por rol, escala tipográfica, espaciado, radios, sombras, movimiento.
4. **Estructura** (`02` si es una página que convierte; `03` para app).
5. **Detalles** (`03`, `07`, `08`): formularios, foco, imágenes, estados vacíos, animación con propósito.
6. **Accesibilidad** (`04`): contraste, teclado, lectores de pantalla.
7. **Verificación** (`06`): probar en 375, 768 y 1280 px, teclado, modo oscuro, rendimiento.

## 2. Pedido -> referencia

| Pedido | Referencia |
|---|---|
| Estilo, identidad, "que no parezca plantilla" | `references/01-direccion-visual.md` |
| Landing, propuesta de valor, CTA, prueba social | `references/02-landing-pages.md` |
| Formularios, foco, imágenes, táctil, modo oscuro, i18n | `references/03-detalles-interfaz.md` |
| Accesibilidad, WCAG 2.2, teclado, ARIA | `references/04-accesibilidad.md` |
| Sistema de diseño, tokens, shadcn/Tailwind | `references/05-sistema-de-diseno.md` |
| Checklist final de entrega | `references/06-checklist-entrega.md` |
| Tipografía y color en detalle | `references/07-tipografia-color.md` |
| Movimiento y animación | `references/08-movimiento.md` |
| Fuentes y licencias | `references/SOURCES.md` |

## 3. Anti-patrones

- Gradiente morado/azul genérico y "tarjetas de cristal" sin motivo.
- Tipografía por defecto (la fuente del sistema o la que usas en todo) sin haberla elegido.
- Tarjetas idénticas con el mismo radio y la misma sombra para todo.
- Varios CTA que compiten; texto como "Enviar" o "Saber más".
- Etiquetas en mayúsculas sobre cada título, numeración 01/02/03 sin que haya secuencia.
- Animar todo al entrar; quitar el foco con `outline: none`.

## 4. Si el tema se sale

Si hace falta una norma o herramienta que no domino (una librería nueva, una versión reciente), usa la skill `aprender-tema` antes de improvisar.

## Solo en Claude Code (no aplicable en otras IAs)

- `preview_start` / navegador integrado y `resize_window` con `mobile`, `tablet` y `desktop` para capturas en 375, 768 y 1280 px.
- Revisión: `design:accessibility-review`, `design:design-critique`; para gráficos, `dataviz`.
- Si el tema se sale de lo cubierto aquí, `aprender-tema`.

<!-- compacto -->
Diseño web: brief (público, objetivo, UNA acción principal, marca, stack) -> dirección visual concreta con paleta de 4-6 colores y tipografía elegida -> tokens -> estructura -> detalles -> accesibilidad -> verificación. Evita: gradiente morado genérico, tipografía por defecto, tarjetas idénticas, varios CTA que compiten. Mínimos: contraste 4.5:1 (texto) y 3:1 (grandes y controles); foco visible, nunca quites el outline sin sustituto; objetivos táctiles de al menos 24 px (44 recomendado); respeta prefers-reduced-motion; anima solo transform y opacity; LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1; imágenes con ancho y alto; prueba en 375, 768 y 1280 px. Una sola acción principal por pantalla.
<!-- /compacto -->
<!-- una-linea: Diseño web con dirección visual propia, landing, accesibilidad WCAG 2.2, sistema de diseño y verificación en 375/768/1280. -->
