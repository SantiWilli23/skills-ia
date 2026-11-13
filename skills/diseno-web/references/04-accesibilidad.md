# 04 - Accesibilidad (WCAG 2.2)

Resumido de addyosmani/web-quality-skills (accessibility, MIT, © 2026 Addy Osmani). Reescrito; ver `SOURCES.md`.

## Marco

Cuatro principios: perceptible, operable, comprensible, robusto. Objetivo habitual: nivel AA (A es el mínimo; AAA, deseable).

## Flujo con evidencia

1. Con la página renderizada, pasa una auditoría de Lighthouse (accesibilidad).
2. Usa los nodos fallidos para localizar el componente, en vez de buscar patrones por todo el repo.
3. Revisa el árbol de accesibilidad (nombres, roles, estados, regiones, encabezados) y recorre el flujo solo con teclado.
4. Corrige en el código fuente y repite la misma auditoría y la misma prueba manual.

Lo automático detecta solo una parte: 100 puntos no equivale a cumplir WCAG, y una nota baja no sustituye la evidencia concreta.

## Lo esencial

- **Alternativas de texto:** `alt` descriptivo; `alt=""` si es decorativa; botón solo con icono = nombre accesible.
- **Contraste:** 4,5:1 texto normal; 3:1 texto grande, iconos y controles; nunca solo color para transmitir información.
- **Teclado:** todo operable con Tab, Enter, Espacio y Escape; orden de foco lógico; sin trampas de teclado; foco visible y no tapado por cabeceras fijas.
- **Objetivos táctiles (WCAG 2.2):** al menos 24 x 24 px (recomendado 44 px).
- **Arrastre:** siempre una alternativa sin arrastrar.
- **Estructura:** un `h1`, encabezados en orden, regiones (`header`, `nav`, `main`), enlace para saltar al contenido, idioma en `<html lang>`.
- **Formularios:** etiqueta visible por campo, errores descritos en texto y asociados al campo, no pedir dos veces lo ya introducido.
- **Movimiento:** respetar `prefers-reduced-motion`; nada que parpadee más de 3 veces por segundo; contenido en movimiento más de 5 s con pausa.
- **Dinámico:** avisos con `aria-live`; al abrir un diálogo, mover el foco dentro y devolverlo al cerrar; Escape cierra.
- **ARIA:** primero HTML semántico; ARIA solo cuando falta semántica nativa, y bien completo (rol, estado, nombre).
- **Medios:** subtítulos y transcripción en lo significativo; controles manejables con teclado.

## Pruebas manuales mínimas

Navegar solo con teclado; zoom al 200 % y reflujo a 320 px sin scroll horizontal; lector de pantalla en el flujo principal; modo alto contraste; sin color (escala de grises).
