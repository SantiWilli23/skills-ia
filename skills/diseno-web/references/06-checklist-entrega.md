# 06 - Checklist de entrega

Síntesis propia basada en las referencias 01-05 y 07-08 (fuentes en `SOURCES.md`).

## Brief y dirección

- [ ] Hay UNA acción principal por pantalla y se ve sin hacer scroll.
- [ ] La dirección visual responde a este brief: cambiarla por la de otro proyecto sería notorio.
- [ ] Sin lorem ipsum: texto real o verosímil.
- [ ] Ningún anti-patrón: gradiente morado genérico, tipografía por defecto, tarjetas idénticas, CTA que compiten.

## Accesibilidad

- [ ] Contraste 4,5:1 (texto) y 3:1 (texto grande, iconos, controles), en claro y oscuro.
- [ ] Todo se maneja con teclado; foco visible; sin trampas.
- [ ] Objetivos táctiles de al menos 24 px (44 recomendado).
- [ ] Imágenes con `alt`, botones de icono con nombre, formularios con etiquetas.
- [ ] `prefers-reduced-motion` respetado.

## Rendimiento

- [ ] LCP <= 2,5 s, INP <= 200 ms, CLS <= 0,1.
- [ ] Imágenes con ancho y alto; las de debajo del pliegue en `lazy`.
- [ ] Solo se cargan las fuentes y pesos usados; fuente crítica precargada.
- [ ] Animaciones solo de `transform` y `opacity`.

## Responsive y estados

- [ ] Probado en 375, 768 y 1280 px, sin scroll horizontal.
- [ ] Estados: vacío, carga, error, texto muy largo, pocas y muchas filas.
- [ ] Modo oscuro diseñado, no invertido.

## Formularios

- [ ] `autocomplete`, `type` e `inputmode` correctos; errores junto al campo; pegar permitido.

## Entrega

- [ ] Abrí el resultado real (captura o navegador) antes de darlo por bueno.
- [ ] Tokens documentados. Fuentes y licencias de tipografías e imágenes anotadas.
