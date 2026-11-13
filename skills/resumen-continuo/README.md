# resumen-continuo

Skill y hooks de Claude Code que guardan un resumen de cada turno y de cada compactación, sin borrar nunca los chats, y mantienen el contexto bajo ~25% de una ventana de 1M (`autoCompactWindow: 250000`).

## Instalar

Desde la raíz del repo: `node scripts/install-claude.js` (ver el README principal). Hace una copia `settings.json.bak-<fecha>`, valida el JSON y fusiona los hooks UserPromptSubmit, Stop, PreCompact, PostCompact y SessionStart (`compact|resume`). Ver `settings.example.json`. Requiere Node 18+, sin dependencias.

## Qué guarda

`~/.claude/resumenes/<proyecto>/<session_id>.md`: petición de cada turno, resumen del turno con el % de contexto y cada compactación. `INDEX.md` por proyecto con una línea por sesión. Desinstalar conserva los resúmenes.

## Pruebas

`node test/run.js` (opcional: `RESUMEN_TEST_TRANSCRIPT=<ruta .jsonl>` para medir un transcript real).

## Limitaciones

- No puede compactar por ti: el hook solo avisa; tú escribes `/compact`.
- El % se calcula con los últimos 512 KB del transcript; si no hay datos, aparece como desconocido.
- Ventana supuesta de 1.000.000 tokens (200.000 con `CLAUDE_CODE_DISABLE_1M_CONTEXT=1`).
- Los nombres de campos de los hooks dependen de la versión de Claude Code; si faltan, el script no escribe nada y sale sin error (siempre exit 0).
