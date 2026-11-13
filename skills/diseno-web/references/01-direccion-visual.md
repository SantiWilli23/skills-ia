# 01 - Dirección visual

Resumido de anthropics/skills (frontend-design, Apache-2.0) y nextlevelbuilder/ui-ux-pro-max-skill (MIT). Reescrito y modificado; ver `SOURCES.md`.

## Partir del tema, no del estilo

Antes de elegir nada, escribe en una línea: qué es el producto, quién lo usa y cuál es su trabajo principal. Los materiales, el vocabulario y el sector del tema son la fuente de las decisiones visuales: un juguete para niñas de 8-11 años y un panel para analistas financieros no comparten estética. Usa contenido real del brief (no lorem ipsum) en toda la maqueta.

## Plan en dos pasadas

1. **Plan corto**: paleta base de 4-6 colores con nombre y hex; tipografías y su papel; concepto de composición (frases cortas y bocetos ASCII; decidir alineación: izquierda, centrada); 2-3 principios que hacen única la página.
2. **Revisión contra el brief**: si alguna parte serviría para cualquier página parecida, cámbiala y anota qué y por qué. Solo entonces escribes código.

## Defectos de plantilla más comunes

Son legítimos en algún brief, pero suelen ser inercia, no elección:

- Fondo crema cálido + serif de alto contraste + acento terracota.
- Fondo casi negro + un único acento verde ácido o bermellón.
- Maqueta de periódico: filetes finos, esquinas rectas, columnas densas.
- Contenido troceado en tarjetas iguales, mismo radio, misma sombra gris suave y degradados decorativos.
- Adornos de plantilla: etiqueta en mayúsculas espaciada sobre cada título, textos unidos con puntos medios, "PALABRA - fragmento", flecha añadida a cada enlace, tipografía monoespaciada para datos pequeños.

Si el brief fija una dirección, síguela tal cual. Si deja un eje libre, no lo gastes en uno de estos valores por defecto.

## Tipografía con intención

- Una familia o dos; si dos, claramente distintas. Elígelas para este proyecto, no las de siempre.
- Escala tipográfica definida (ver `07`). Líneas de menos de 80 caracteres; la serif admite algo más y algo más de interlineado.
- Tratar el titular como parte del diseño, no como mero contenedor del texto.
- Evita resaltar una sola palabra del titular con cursiva, negrita o color como truco automático.

## Estructura como información

Bordes, numeraciones, divisores y etiquetas deben codificar algo del contenido. Numerar 01/02/03 solo si hay una secuencia real (pasos, cronología).

## Prioridades de calidad (de más a menos crítico)

1. Accesibilidad. 2. Táctil e interacción. 3. Rendimiento. 4. Coherencia de estilo según tipo de producto. 5. Maquetación responsive. 6. Tipografía y color. 7. Animación. 8. Formularios y retroalimentación. 9. Navegación. 10. Gráficos y datos. Cuando haya conflicto, gana el número menor.

Otras reglas útiles: iconos SVG de un mismo set, nunca emoji como icono; no mezclar estilos (plano y skeuomórfico) al azar; estados de carga con retroalimentación, no cambios instantáneos sin señal.

## Gastar la audacia en un sitio

Que un elemento sea el memorable y el resto quede sobrio. Quita adornos que no sirvan al brief. Movimiento no provocado por el usuario: poco y con intención (una secuencia de carga o una revelación), no entradas "fade y sube" en cada sección. Antes de entregar, quita un accesorio.

## Mínimos que siempre se cumplen

Responsive hasta móvil, foco de teclado visible, `prefers-reduced-motion` respetado, contraste suficiente, paleta armoniosa. Haz capturas para revisar si el entorno lo permite.
