---
name: resumen-continuo
description: Guarda un resumen de cada turno y de cada compactación sin borrar nunca los chats, y mantiene el contexto bajo ~25% (ventana de 1M). Úsala para "¿qué hablamos?", "resumen de la sesión", "¿cuánto contexto llevo?", "busca en chats antiguos", y para instalar o verificar los hooks.
---

# resumen-continuo

## Reglas portables

- Nunca se borran chats ni resúmenes. Los resúmenes solo se añaden.
- "¿Qué hablamos?" / "resumen de la sesión": resume la conversación actual desde el principio, en pocas líneas: pedido, decisiones, qué se hizo, qué queda.
- Si el contexto se hace largo, propón empezar un chat nuevo pegando un resumen corto (pedido, hecho, queda, siguiente paso).
- Si el usuario tiene un archivo de resúmenes (carpeta o notas), búscalo ahí antes de preguntar.

## Solo en Claude Code (no aplicable en otras IAs)

Los hooks de `~/.claude/settings.json` hacen el trabajo; esta skill no puede compactar ni ejecutar `/compact`. Guardan los resúmenes en `~/.claude/resumenes/<proyecto>/<session_id>.md` (solo se añade) y un `INDEX.md` por proyecto con una línea por sesión.

- NUNCA usar `/clear`, `delete_session`, `clear_session` ni `archive_session`.
- Si el contexto pasa del umbral (25%), pide al usuario que escriba `/compact`: Claude no puede hacerlo.
- "Busca en chats antiguos": Grep en `~/.claude/resumenes/<proyecto>/`, empezando por `INDEX.md`.
- "¿Cuánto contexto llevo?": `node "C:/Users/<usuario>/.claude/skills/resumen-continuo/scripts/status.js"` (opcional: ruta de un transcript `.jsonl`).
- Instalar: `node scripts/install-claude.js` desde la raíz del repo `skills-ia` (backup de settings.json, fusiona los 5 hooks: UserPromptSubmit, Stop, PreCompact, PostCompact, SessionStart; `autoCompactWindow: 250000`). Desinstalar: `--uninstall`.

<!-- compacto -->
Resumen continuo: no borres nunca chats ni resúmenes. Si te piden "qué hablamos", resume la conversación (pedido, decisiones, hecho, queda). Si la conversación se alarga mucho, propón abrir un chat nuevo pegando un resumen corto (pedido, hecho, queda, siguiente paso). Esta IA no guarda resúmenes sola: pídele al usuario que los guarde en sus notas.
<!-- /compacto -->
<!-- una-linea: Resume la conversación cuando se pida y propón un chat nuevo con resumen si se alarga; nunca borres chats. -->
