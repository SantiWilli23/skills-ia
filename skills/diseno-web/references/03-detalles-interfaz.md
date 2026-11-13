# 03 - Detalles de interfaz

Resumido de vercel-labs/web-interface-guidelines (command.md, MIT, © 2025 Vercel Labs). Reescrito; ver `SOURCES.md`. (No se usa vercel-labs/agent-skills/web-design-guidelines.)

## Foco

- Todo elemento interactivo con foco visible; usa `:focus-visible` mejor que `:focus`.
- Nunca `outline: none` sin un sustituto visible.
- Controles compuestos: `:focus-within`. Cabeceras fijas y capas no deben tapar el elemento enfocado.

## Formularios

- `name` con sentido, `autocomplete` correcto y `type`/`inputmode` adecuados (email, tel, url, number).
- Nunca bloquees pegar. Etiquetas clicables; casilla/radio y etiqueta comparten zona de clic.
- El botón de enviar sigue activo hasta que empieza la petición; luego, indicador de carga.
- Errores junto al campo y foco en el primer error al enviar. Placeholders con ejemplo y terminados en "…".
- Sin corrector ortográfico en correos, códigos y usuarios. Avisa antes de salir con cambios sin guardar.
- Acciones destructivas: confirmación o ventana de deshacer, nunca inmediatas.

## Contenido y estados

- Contenedores que aguanten textos largos (`truncate`, `line-clamp`, `break-words`); en flex, `min-w-0` en los hijos.
- Estados vacíos diseñados. Contenido de usuarios: pensar en entrada corta, media y larguísima.
- La URL refleja el estado (filtros, pestañas, paginación). Enlaces reales para navegar (clic medio y Ctrl/Cmd+clic funcionan); `<button>` para acciones.

## Tipografía fina

Puntos suspensivos reales "…", comillas curvas, espacios duros en "10 MB" y atajos, `font-variant-numeric: tabular-nums` en columnas de cifras, `text-wrap: balance` en títulos, `Intl.*` para fechas y números.

## Imágenes

`width` y `height` explícitos (evita CLS); `loading="lazy"` bajo el pliegue; la imagen crítica del primer pantallazo con `fetchpriority="high"`. Vídeo corto en silencio mejor que GIF animado, con imagen fija alternativa.

## Rendimiento de interfaz

Listas largas (>50): virtualizar o `content-visibility: auto`. No leer layout durante el render; agrupar lecturas y escrituras del DOM. `preconnect` a dominios de recursos; precargar la fuente crítica con `font-display: swap`.

## Táctil y gestos

`touch-action: manipulation`; `overscroll-behavior: contain` en modales y paneles; gestos de arrastre o pellizco con alternativa de toque/clic y teclado; `autoFocus` con moderación (solo escritorio, un campo principal). Pantallas a sangre con `env(safe-area-inset-*)`.

## Modo oscuro y temas

`color-scheme: dark` en `<html>` para temas oscuros (barras y controles nativos). Diseñar la elevación en oscuro, no invertir el claro.

## Accesibilidad rápida

Botones con icono: `aria-label`; iconos decorativos: `aria-hidden`; HTML semántico antes que ARIA; jerarquía de encabezados y enlace "saltar al contenido"; avisos asíncronos con `aria-live="polite"`.
