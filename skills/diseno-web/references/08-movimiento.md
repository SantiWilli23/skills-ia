# 08 - Movimiento y animación

Resumido de emilkowalski/skill (skills/animate, MIT, © 2026 Emil Kowalski). Reescrito; ver `SOURCES.md`.

## 1. ¿Debe animarse?

| Frecuencia de uso | Decisión |
|---|---|
| Cientos de veces al día (atajos, paleta de comandos) | Sin animación |
| Decenas al día (hover, navegación por listas) | Casi imperceptible o nada |
| Ocasional (modales, paneles, avisos) | Animación estándar |
| Raro o primera vez (onboarding, celebración) | Aquí vive el presupuesto de deleite |

Las acciones iniciadas con teclado y muy frecuentes no se animan. Un dato que se lee o se actúa sobre no debe moverse por estilo.

## 2. Propósito

Nómbralo: retroalimentación, coherencia espacial (de dónde viene y a dónde va), indicar un cambio de estado, evitar un salto brusco, explicar (solo marketing) o deleite (solo en lo raro). Si no puedes nombrarlo, no lo construyas.

## 3. Herramienta, la más barata que sirva

Transición CSS para hover, pulsación y estados; `@starting-style` para entradas al montar; animación CSS para movimiento predeterminado que debe ir fluido con la página ocupada; WAAPI para control programático; una librería de movimiento solo para muelles, animaciones de layout, salidas o gestos. Para componentes enteros (aviso, cajón, menú) usa una librería existente con gestión de foco, no los construyas a mano.

## 4. Propiedades

- Solo `transform` y `opacity` (van por la GPU). `width`, `height`, `margin`, `top`... fuerzan layout; la altura se tolera en acordeones.
- Nunca `scale(0)`: parte de 0,9-0,97 con opacidad 0.
- `transform-origin` en el elemento que lo dispara (menús, popovers, tooltips); los modales, centrados.
- No dirijas la transformación de un hijo desde una variable CSS del padre.

## 5. Curva y duración

- Entrar o salir: `ease-out`. Moverse por pantalla: `ease-in-out`. Hover o color: `ease`. Continuo: `linear`. Nunca `ease-in` en interfaz.
- Las curvas predefinidas de CSS son débiles; usa curvas propias más marcadas y defínelas como tokens (ej. `cubic-bezier(0.23, 1, 0.32, 1)` para entrar).
- Duraciones: pulsación de botón 100-160 ms; tooltips 125-200 ms; desplegables 150-250 ms; modales y paneles 200-500 ms. La interfaz normal, bajo 300 ms.
- Muelles para arrastre con inercia y gestos interrumpibles; rebote 0,1-0,3 y poco en general.

## 6. Interrupción y salida

Transiciones (no keyframes) para lo que se dispara rápido: retoman desde el valor actual. Sale por donde entró. Tiempos asimétricos donde el usuario decide: lento en la fase deliberada, rápido en la respuesta del sistema.

## 7. Movimiento reducido

Va con la animación, no después: respeta `prefers-reduced-motion` (variante reducida o desactivada) y limita los hover a punteros que los admiten (`@media (hover: hover)`). Los bucles decorativos se detienen con movimiento reducido.
