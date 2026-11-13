# 07 - Tipografía y color

Resumido de pbakaus/impeccable (referencias typeset y colorize, Apache-2.0). Reescrito y modificado; ver `SOURCES.md`. No se ejecutó ningún script de ese repositorio.

## Tipografía

Mejora la tipografía dentro del mundo visual ya establecido; no cambies la identidad salvo que te lo pidan.

**Antes de editar, fija:** los papeles que necesita la interfaz (título, cuerpo, etiqueta, metadato, dato), el contraste entre ellos, la medida y densidad de lectura, qué familias y pesos mandan y las restricciones de rendimiento, idioma o accesibilidad.

**Reglas:**

- Usa el mínimo de papeles y familias que haga evidente la jerarquía. Combina tamaño, peso, espacio y tono; el tamaño solo no basta.
- Cuerpo web: 16 px (1 rem) como suelo, salvo papel denso justificado. Respeta el zoom y los ajustes de fuente del usuario.
- Prosa entre 45 y 75 caracteres por línea; cuanto más ancha la línea, más interlineado.
- Texto claro sobre fondo oscuro: algo más de interlineado, un poco más de espaciado entre letras y, si hace falta, un peso más.
- Los mismos papeles se ven idénticos en todas las pantallas y estados.
- Cifras tabulares, código y etiquetas con sus características OpenType cuando aporten.
- Carga solo los archivos y pesos usados; fuente de respaldo con métricas compatibles; sin texto invisible mientras carga.
- Espaciado entre párrafos o sangría de primera línea, no ambos.
- Saltos de línea: `text-wrap: balance` en títulos y bloques cortos centrados; `text-wrap: pretty` en cuerpo. No rompas un título a mano salvo entre frases y comprobándolo en cada ancho.
- No introduzcas una segunda familia sin un papel que solo ella cumpla.

**Verificar:** los papeles se distinguen sin leer el texto; textos largos y traducciones aguantan; zoom, contraste y foco siguen bien.

## Color

Color como jerarquía, significado y atmósfera. Respeta las convenciones de marca y semánticas confirmadas.

- Construye **roles, no un surtido de muestras**: lienzo y superficies, texto primario y secundario, acción/foco/selección, bordes, éxito/aviso/error/info, categorías de datos.
- Nombra antes de editar la temperatura emocional, la relación dominante, el rango de contraste y la dosis de color.
- Para una paleta web nueva, prefiere OKLCH: se ajusta la luminosidad y el croma de forma predecible. Reduce el croma cerca del blanco y del negro. Elige el tono por el significado del producto, no por asociaciones por defecto.
- El color más fuerte ocupa una región o un papel deliberado, no acentos minúsculos repartidos. La acción principal debe localizarse fácil y no gastar su color en decoración.
- Neutros teñidos solo si el tono de marca aporta cohesión; en superficies de color, deriva el texto secundario del tono de la superficie, no de un gris genérico.
- Datos: no dependas solo del color; usa luminosidad, forma, etiqueta o patrón.
- Modo oscuro: diseña elevación y contraste, no inviertas el claro.
- Contraste: 4,5:1 texto, 3:1 texto grande, controles, iconos y foco. Comprueba estados interactivos, superposiciones, texto sobre imagen y simula daltonismo. Prefiere colores explícitos a cadenas de transparencias.
- Define tokens primitivos y semánticos; cambiar de tema reasigna roles.
