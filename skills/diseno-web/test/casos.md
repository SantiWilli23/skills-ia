# Casos de prueba de diseno-web

1. **"Hazme una landing para mi academia de guitarra"**: pregunta o deduce público, objetivo, UNA acción principal, marca y stack; propone dirección visual con paleta de 4-6 colores y tipografía elegida; sin gradiente morado genérico.
2. **Landing con tres botones principales**: reduce a una acción principal y degrada el resto a secundarias o enlaces.
3. **"Hazlo accesible"**: usa `04`; comprueba contraste 4,5:1 / 3:1, foco visible, objetivos táctiles de al menos 24 px, `prefers-reduced-motion`.
4. **Formulario de contacto**: `autocomplete`, `type`, errores junto al campo, pegar permitido, botón con carga.
5. **"Añade animaciones"**: aplica la tabla de frecuencia; anima solo `transform` y `opacity`; respeta movimiento reducido; nada de `ease-in`.
6. **Entrega**: pasa `06` y prueba en 375, 768 y 1280 px (en Claude Code con `resize_window`).
7. **Tema fuera de alcance** (una librería nueva): invoca `aprender-tema` en vez de improvisar.
8. **Otras IAs**: sin carpetas de referencias, usa solo el bloque compacto y no inventa archivos.
