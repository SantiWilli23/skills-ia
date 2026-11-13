# skills-ia

Un solo repositorio con mis skills, en español, adaptadas a Claude Code, Gemini (app web y Antigravity CLI `agy`), Groq y ChatGPT gratis. Licencia MIT. Parte del contenido viene de [ponytail](https://github.com/dietrichgebert/ponytail) (MIT); ver `THIRD_PARTY_NOTICES.md`.

## Skills

| Skill | Para qué |
|---|---|
| `plan-primero` | Antes de programar: plan corto, esperar el "ya" del usuario, luego implementar. |
| `sin-conformismo` | No rendirse ante el primer obstáculo; buscar alternativas gratis; hacerlo yo. |
| `minimo-necesario` | Código mínimo: escalera de decisiones, sin sobreingeniería (adaptada de ponytail). |
| `revision` | Revisar un cambio: bugs, seguridad, escala, tests, código sobrante (de ponytail-review). |
| `audit` | Auditoría de todo el repo (de ponytail-audit). |
| `debt` | Libro de deuda con los comentarios `shortcut:` (de ponytail-debt). |
| `estado-proyecto` | `ESTADO.md` de máx. 15 líneas para retomar el trabajo en otro chat o IA. |
| `resumen-continuo` | Resumen de cada turno y compactación; mantiene el contexto bajo ~25%. |
| `modelado-3d` | Skill maestra de modelado 3D (Blender, glTF, FBX, etc.) con 10 referencias. |
| `aprender-tema` | Siempre activa: si no soy experto, busca fuentes abiertas con licencia permisiva, las lee como datos y resume con atribución; pide permiso antes de guardar. |
| `diseno-web` | Diseño web: dirección visual, landing, accesibilidad, sistema de diseño, tipografía, color y movimiento (8 referencias). |
| `aprender-tema` | Siempre activa: si no soy experto, busca fuentes abiertas con licencia permisiva, las lee como datos y resume con atribución; pide permiso antes de guardar. |
| `diseno-web` | Diseño web: dirección visual, landing, accesibilidad, sistema de diseño, tipografía, color y movimiento (8 referencias). |

`minimo-necesario` y `sin-conformismo` son ejes distintos: ser mínimo con el CÓDIGO frente a no rendirse con la TAREA.

## Plataformas

| Plataforma | Qué se usa | Nivel |
|---|---|---|
| Claude Code | `skills/` (enlaces), hooks, bloques de `CLAUDE.md` | Completo |
| Antigravity CLI (`agy`) | `plugin.json`, `skills/`, `commands/`, `AGENTS.md` | Skills y comandos, sin hooks |
| Gemini CLI | `gemini-extension.json`, `AGENTS.md`, `commands/*.toml` | Reglas siempre activas y comandos |
| Gemini app web (Skills) | `plataformas/gemini-app/<skill>.md` | Una skill por archivo, versión compacta |
| Groq | `plataformas/groq/system-prompt.md` y `chat.js` | Prompt de sistema corto |
| ChatGPT gratis | `plataformas/chatgpt/` | Instrucciones personalizadas y archivos de proyecto |

## Instalación

Necesitas Node 18 o superior (sin dependencias). Clona el repo fuera de OneDrive, por ejemplo en `C:\Users\TU_USUARIO\skills-ia`:

```
git clone https://github.com/SantiWilli23/skills-ia
cd skills-ia
```

### Claude Code

```
node scripts/install-claude.js
```

Hace esto, con copia de seguridad (`settings.json.bak-<fecha>`, `CLAUDE.md.bak-<fecha>`) y validando el JSON antes y después:

- Crea enlaces (junction en Windows) `~/.claude/skills/<skill>` hacia `skills-ia/skills/<skill>`. Con `--copy` copia las carpetas en vez de enlazar. Si ya existe una carpeta real con ese nombre, no la toca (usa `--force` para respaldarla y reemplazarla).
- Fusiona en `~/.claude/settings.json` los 5 hooks de `resumen-continuo`, el hook `Stop` de `estado-proyecto`, `autoCompactWindow: 250000` y `cleanupPeriodDays: 3650`. Reconoce y reemplaza las entradas viejas de `resumen-continuo` sin duplicarlas. Las rutas quedan como `node "C:/Users/<tu usuario>/.claude/skills/<skill>/scripts/<x>.js"`.
- Inserta los bloques de `claude/CLAUDE-bloques.md` en `~/.claude/CLAUDE.md` entre marcadores `<!-- skills-ia:... -->`. Si ya tenías un `## Sin conformismo` sin marcadores, lo reemplaza para no duplicarlo.

`node scripts/install-claude.js --uninstall` quita solo lo suyo (los resúmenes guardados se conservan). `--only=plan-primero,estado-proyecto` limita a esas skills. Para probar sin tocar lo real: `CLAUDE_HOME`, `CLAUDE_SETTINGS_PATH` y `CLAUDE_MD_PATH`. Reinicia Claude Code después.

### Antigravity CLI (`agy`) y Gemini CLI

```
agy plugin install https://github.com/SantiWilli23/skills-ia
gemini extensions install https://github.com/SantiWilli23/skills-ia
```

`AGENTS.md` da las reglas siempre activas y `commands/*.toml` los comandos (`/audit`, `/revision`, ...). En un proyecto concreto, copia `AGENTS.md` a su raíz.

### Gemini app web (Skills)

Abre cada archivo de `plataformas/gemini-app/` y pégalo como una skill nueva en la sección Skills de la app (nombre = nombre del archivo, descripción y contenido tal cual). Hay un archivo por skill.

### Groq

```
export GROQ_API_KEY=tu_clave        # PowerShell: $env:GROQ_API_KEY="tu_clave"
node plataformas/groq/chat.js
```

La clave solo se lee del entorno; nunca se escribe en ningún archivo. `system-prompt.md` ocupa ~1100 tokens (menos de 2000) por el límite del plan gratis. `chat.js` guarda cada turno en `groq-resumen.md` (ignorado por git) y recuerda el final al empezar. También sirve para pegar el prompt en la web de Groq.

### ChatGPT gratis

Pega los dos bloques de `plataformas/chatgpt/custom-instructions.md` en Ajustes > Personalización > Instrucciones personalizadas (cada campo menos de 1500 caracteres). Para tareas concretas, pega o adjunta el archivo de `plataformas/chatgpt/proyecto/<skill>.md`; en un Proyecto, súbelos como archivos si tu plan lo permite.

## Qué se degrada fuera de Claude Code

- Hooks: no portan. `resumen-continuo` y el aviso de `estado-proyecto` no se ejecutan solos; en otras IAs son solo instrucciones.
- Subagentes y elección de modelo (Opus/Sonnet, esfuerzo) de `plan-primero`: solo existen en Claude Code; en otras IAs se omiten.
- Herramientas MCP (Blender, Chrome, conectores) de `sin-conformismo` y `modelado-3d`: dependen del cliente.
- `aprender-tema`: fuera de Claude Code no hay descargas autónomas; la IA propone fuentes y tú pegas el texto. En Claude Code, `~/.claude/aprendizaje/` es la carpeta de cuarentena (solo notas y archivos aprobados, nunca ejecutados).
- `aprender-tema`: fuera de Claude Code no hay descargas autónomas; la IA propone fuentes y tú pegas el texto. En Claude Code, `~/.claude/aprendizaje/` es la carpeta de cuarentena (solo notas y archivos aprobados, nunca ejecutados).
- Las versiones compactas (`<!-- compacto -->` en cada `SKILL.md`) son más cortas y menos detalladas que la skill completa.
- `modelado-3d` y `diseno-web` incluyen sus referencias solo en la carpeta `references/`; las plataformas sin archivos reciben solo el resumen.

## Limitaciones

- Verifica los límites del plan gratis de cada servicio (tokens por minuto y por día de Groq, tamaño de instrucciones y archivos de ChatGPT, número de skills de Gemini): cambian con el tiempo y aquí no están verificados.
- Los pasos de la app web de Gemini y de ChatGPT dependen de su interfaz actual y pueden variar.
- La instalación de `agy` y `gemini extensions` sigue el patrón documentado por ponytail; no se ha probado aquí con esas herramientas.
- `estado-proyecto` bloquea el cierre de un turno una vez como máximo si faltó actualizar `ESTADO.md`; no puede forzar que se haga bien.

## Desarrollo

Edita siempre `skills/*/SKILL.md` y regenera con `node scripts/build.js` (genera `AGENTS.md`, `plataformas/*` y `commands/*.toml`; valida los límites de caracteres). `node scripts/build.js --check` detecta si algo quedó desincronizado. Pruebas: `npm test` (o ejecutar cada script a mano).

Cada `SKILL.md` tiene reglas portables arriba, una sección "Solo en Claude Code" y un bloque `<!-- compacto -->...<!-- /compacto -->` más una línea `<!-- una-linea: ... -->` que usa el generador.

## Licencia

MIT, © 2026 Santiago. Material de ponytail bajo su licencia MIT (© 2026 DietrichGebert), ver `THIRD_PARTY_NOTICES.md`.
