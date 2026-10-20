# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| /active-orchestrator:init, /active-orchestrator:kb, /active-orchestrator:rules, /active-orchestrator:discovery, /active-orchestrator:openspec, /active-orchestrator:devops, /active-orchestrator:find-skill | active-orchestrator | ~/.config/opencode/skills/active-orchestrator/SKILL.md |
| crear/generar/actualizar AGENTS.md o CLAUDE.md, armar las reglas del proyecto, instrucciones para los agentes, generar claude.md | agent-instruction | ~/.config/opencode/skills/agent-instruction/SKILL.md |
| investigar el mercado, pensar que construir antes de tener claridad, investigar competidores | discovery-research | ~/.config/opencode/skills/discovery-research/SKILL.md |
| how do I do X, find a skill for X, is there a skill that can..., extender capacidades | find-skills | ~/.config/opencode/skills/find-skill/SKILL.md |
| crear base de conocimiento, documentar proyecto, armar KB, generar KB desde docs | kb-creator | ~/.config/opencode/skills/kb-creator/SKILL.md |
| crear CHANGES.md, armar roadmap, generar plan de implementación, armar CHANGES, armar roadmap, crear mapa de changes, generar plan de implementación, qué changes necesito, índice de changes | roadmap-generator | ~/.config/opencode/skills/roadmap-generator/SKILL.md |
| crear skill, editar skill, optimizar skill, run evals, benchmark skill performance | skill-creator | ~/.config/opencode/skills/skill-creator/SKILL.md |
| investigar competidor, scrapear URL, extraer problema/usuarios/features/pricing de una URL | web-scraper | ~/.config/opencode/skills/web-scraper/SKILL.md |

## Compact Rules

### active-orchestrator
- NEVER reimplement a phase's logic — always route to its sub-skill (`Skill` for interactive, `Agent` for mechanical)
- NEVER ask strategic content questions (system_type, scale, stack, problem, 11-point checklist) — those belong to `kb-creator`/`discovery-research`
- Own `step` and nothing else in `.active-orchestrator-state.json`; sub-skills write their own sections
- Check sub-skill presence before dispatch; if missing → offer install → degrade gracefully if declined
- Resume by default: if state exists with `step != "done"`, ask to resume or restart
- STOP and wait after EVERY `AskUserQuestion` — never assume the answer
- NEVER chain phases without a checkpoint (pre-phase context gate + post-phase advance gate)
- NEVER install anything autonomously — `find-skill` recommends, user picks, then you install
- Entry points: `/active-orchestrator:init` (full flow), `:discovery`, `:kb`, `:rules`, `:openspec`, `:devops`, `:find-skill`, `:registry`

### agent-instruction
- Generate `AGENTS.md` + `CLAUDE.md` at project root (same content, not symlinks) — never inside `.claude/` or `openspec/`
- Pre-checks: `knowledge-base/` exists, `02_descripcion_general.md` exists, `CHANGES.md` optional
- Read global `~/.claude/CLAUDE.md` FIRST — reference its rules, DO NOT duplicate them
- Derive candidate hard rules from detected stack in KB (Go→gofmt, Python→type hints+Pydantic forbid, TS/React→PascalCase+no any+strict tsconfig)
- CONFIRM rules with user via `AskUserQuestion` — STOP and wait for explicit approval
- Write ONLY confirmed rules in `## Reglas Duras` — if none, just reference the global
- Map skills to agent roles from `.atl/skill-registry.md` (single source of truth) — DO NOT copy compact rules here
- Add reference line: "Los compact rules los resuelve el orquestador desde `.atl/skill-registry.md` (no versionado)"

### discovery-research
- Run BEFORE `kb-creator` — produces `discovery/discovery.md` + `state.discovery` (product/market discovery)
- Phase 1: Ask user for URLs → invoke `web-scraper` per URL → writes `discovery/sources/<slug>.md`
- Phase 2: 11-point checklist Q&A guided by `references/checklist.md` (3-5 questions/round, a/b/c options)
- Skip checklist points already resolved by scraping — show as summary, ask to confirm/correct
- Phase 3: Show summary of all 11 points → explicit user confirmation → only then write files
- Phase 4: Write `discovery/discovery.md` (prose) + update `state.discovery` in `.jr-orchestrator-state.json`
- If `web-scraper` unavailable, continue with Q&A only and warn user
- NEVER decide whether to run Discovery — that's the orchestrator's gate

### find-skills
- Help users discover skills when they ask "how do I do X", "find a skill for X", "is there a skill that can..."
- Check skills.sh leaderboard first for popular skills (vercel-labs, anthropics, microsoft)
- Search with `npx skills find [query]` — use specific keywords (e.g., "react testing" not just "testing")
- ALWAYS verify before recommending: install count ≥1K preferred, source reputation (official > unknown), GitHub stars ≥100
- Present options with: skill name, what it does, install count, source, install command, skills.sh link
- Offer to install: `npx skills add <owner/repo@skill> -g -y` (global + skip prompts)
- If no skills found: acknowledge, offer direct help, suggest `npx skills init my-skill`
- NEVER auto-install — user must confirm; installing mutates their environment (HIGH governance)

### kb-creator
- Builds 10 canonical files at `knowledge-base/` (root): 01_vision_y_objetivos.md → 10_preguntas_abiertas.md + README.md
- **Mode A (silent/ingest)**: `docs/` exists with source files → read all, generate KB without questions, source="ingest"
- **Mode B (interactive)**: no `docs/` or empty → architect+PM mode: 3-5 strategic questions, iterate file-by-file with feedback, source="interactive"
- NEVER mix with `docs/` — KB output goes to `knowledge-base/`, sources stay in `docs/`
- If orchestrated: write `state.kb` (discovery, source, files) to `.active-orchestrator-state.json` after generation
- Optional extras allowed with `1X_`/`2X_` prefix (e.g., `11_pagos_mercadopago.md`) — never replace canonicals
- Tone: Mode A = efficient/factual; Mode B = senior architect challenging weak decisions, marking assumptions

### roadmap-generator
- Pre-checks: `knowledge-base/` exists with 10 canonicals, `openspec/` exists — if any fails, STOP with clear message
- Output: `CHANGES.md` at project root (NOT inside `openspec/`) — master index for all agents
- Input: 4 mandatory KB files (04_modelo_de_datos, 06_funcionalidades, 07_flujos_principales, 08_arquitectura_propuesta) + 3 optional
- Changes: sequential `C-01`..`C-NN` (2-digit padding), kebab-case names, grouped in semantic FASEs
- Dependencies: 8 rules (infra→core models→auth→referenced entity→backend before frontend→integrations last→admin last→UI restyle last)
- Gates: ASCII art tree + GATE N format with `[Agente A/B/C]` assignments; mark FORK where >2 parallel
- Critical path: linear shortest chain to production; Plan 3 agents table (Paso | A | B | C)
- Governance: BAJO (scaffolding/CRUD), MEDIO (stateful flows), ALTO (notifications/roles/WS), CRITICO (auth/payments/security/core models)
- Scope: operational bullets (models, endpoints, migrations, tests) — NOT descriptive
- "Leer antes": 3-5 KB files per change with §section references
- If orchestrated: write `state.roadmap` (created_by, source, changes list) after CHANGES.md

### skill-creator
- Create new skills or improve existing: draft → test cases → run with/without skill → grade → benchmark → viewer → iterate
- SKILL.md structure: YAML frontmatter (name, description — make descriptions "pushy" to combat undertriggering) + Markdown body <500 lines
- Progressive disclosure: metadata always in context, body on trigger, bundled resources as needed
- Test cases: 2-3 realistic prompts → spawn with-skill + baseline subagents in SAME turn → capture timing/tokens
- Assertions: objectively verifiable, descriptive names; skip for subjective outputs (writing/design)
- Benchmark: aggregate with `scripts.aggregate_benchmark` → mean±stddev, delta; analyst pass for hidden patterns
- Viewer: `generate_review.py` (static HTML if no display) → user feedback → read `feedback.json` → improve
- Description optimization: 20 eval queries (should/should-not trigger) → `run_loop.py` optimization → apply best_description
- Package: `scripts.package_skill` → present `.skill` file if `present_files` tool available
- NEVER use `/skill-test`; run the loop manually as specified
- Cowork/Claude.ai adaptations: serial runs, no browser (static HTML), skip quantitative benchmark, skip description optimization

### web-scraper
- Input: URL(s) → output: `discovery/sources/<slug>.md` with FIXED 8-field schema (problem, users, features, pricing, positioning, etc.)
- Fetch with `WebFetch` using structured prompt from `references/output-schema.md`
- If field not public (e.g., hidden pricing) → write `(no publicado)` — NEVER invent data
- If fetch fails (empty, SPA shell, 403, paywall, CAPTCHA) → report limitation in field, continue with next URL
- Filename via `scripts/slugify.py` (kebab-case from competitor name/domain) — repeat runs overwrite same file
- NO crawling/massive scraping — processes explicit pages only; full-site scraping is out of scope v1
- Output schema is NON-NEGOTIABLE — all 8 fields always, same order, for comparability
- Invoked by `discovery-research` during Discovery phase; also usable standalone

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | ./AGENTS.md | Instrucciones para agentes (proyecto) |
| CLAUDE.md | ./CLAUDE.md | Copia de AGENTS.md |
| CHANGES.md | ./CHANGES.md | Roadmap de changes |
| knowledge-base/ | ./knowledge-base/ | 10 archivos canónicos |

---

*Registry built by skill-registry. Project: Primer-Parcial-FRONTEND-PROGIII*