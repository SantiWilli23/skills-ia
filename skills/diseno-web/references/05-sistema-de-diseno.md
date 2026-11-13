# 05 - Sistema de diseño y tokens

Resumido de nextlevelbuilder/ui-ux-pro-max-skill (MIT, © 2024 Next Level Builder), anthropics/skills (frontend-design, Apache-2.0) y shadcn-ui/ui (skills/shadcn, MIT, © 2023 shadcn). Reescrito y modificado; ver `SOURCES.md`.

## Qué incluir

Un sistema mínimo, escrito antes de maquetar:

- **Color por rol**, no por tono: fondo, superficie elevada, texto principal y secundario, acción, foco, bordes, estados (éxito, aviso, error, info).
- **Tipografía:** familias y papeles, escala (tamaño, peso, interlineado por rol). Ver `07`.
- **Espaciado** en una escala fija (p. ej. múltiplos de 4 u 8).
- **Radios y sombras** por jerarquía, no uno para todo.
- **Movimiento:** duraciones y curvas con nombre. Ver `08`.
- **Alturas de controles** (botón, campo) y densidad.

## Tokens en dos niveles

Valores primitivos (la paleta cruda) y tokens semánticos (`--background`, `--primary`, `--muted-foreground`). Los temas cambian el mapa semántico, no los componentes. Documenta cada token con su uso.

## Flujo para un DESIGN.md (patrón de shadcn)

1. Leer el DESIGN.md: frontmatter (colores, tipografía, radios, espaciado) y, sobre todo, las secciones de "Qué no hacer" y huecos conocidos, que mandan sobre los valores por defecto.
2. Extraer una tabla: lienzo y tinta, color de acción y estados, superficies, líneas, foco, familias, escala, radios, elevaciones, alturas de controles, reglas duras.
3. Mapear a variables del tema; mantener los hex si el documento los da. Añadir variables nuevas (p. ej. acción pulsada) en vez de forzar las existentes.
4. Elegir la "geometría" más cercana (densa, redondeada, afilada, editorial) y decir el porqué en una línea.
5. Comprobar con una página de muestra de todos los componentes en todos los estados.

Con Tailwind y shadcn: editar solo el archivo CSS del tema, usar utilidades semánticas (`bg-primary`) y no colores sueltos; no citar de memoria cuántos componentes hay, contarlos.

## Paletas y pares tipográficos (ui-ux-pro-max)

La fuente cataloga paletas por tipo de producto y pares de fuentes; sirve como punto de partida, no como respuesta final. Adáptalos al brief y compruébalos con `01`.

## Coherencia

Un solo conjunto de iconos (SVG); estados hover, activo, foco, deshabilitado y carga definidos para cada componente; mismo componente = mismo aspecto en toda la app.
