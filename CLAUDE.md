# Librería Parcial 1 Frontend — Instrucciones para Agentes

> Este archivo (y su copia `AGENTS.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

<!-- Copiar la tabla de knowledge-base/02_descripcion_general.md §Stack tecnológico -->

| Capa | Tecnología | Versión/Detalle |
|------|------------|-----------------|
| **Marcado** | HTML5 semántico | Etiquetas: header, nav, main, section, article, table, form, label, button |
| **Estilos** | CSS3 nativo | Archivos .css externos; Flexbox/Grid; variables CSS para tema coherente |
| **Comportamiento** | JavaScript ES6+ nativo | Módulos (type="module" opcional), DOM API, EventTarget, localStorage API |
| **Almacenamiento** | localStorage (Web Storage API) | Claves: libros, clientes, ventas, (editoriales, géneros, autores opcional) |
| **Entorno de ejecución** | Navegador moderno | Sin servidor; apertura directa de `index.html` via `file://` o servidor estático simple |
| **Tooling** | Ninguno obligatorio | Editor de código + navegador; sin npm, bundlers, transpiladores |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito y alcance |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Auth, RBAC, permisos |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, migraciones |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-XX) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura, env vars |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias a resolver ANTES de codear |

> ⚠️ Resolver las preguntas de prioridad **Alta** de `10_preguntas_abiertas.md` antes de arrancar el primer change.

---

## Skills Disponibles

<!-- Fuente de verdad: .atl/skill-registry.md (generado por skill-registry). Adaptar filas a las skills que lista el registry; fallback a .claude/skills/ y ~/.claude/skills/ si no existe. -->

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Frontend Core** | HTML semántico / CSS mobile-first / JS vanilla / localStorage | `kb-creator`, `roadmap-generator`, `agents-md-generator`, `skill-registry` |
| **Orquestación** | SDD / OPSX / docs | `active-orchestrator`, `find-skills`, `skill-creator` |
| **Investigación** | Discovery / web scraping | `discovery-research`, `web-scraper` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

<!-- Resumen de CHANGES.md — NO duplicar el detalle completo -->

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 6 changes en 5 fases.
- **Camino crítico** (6): `C-01 → C-02 → C-03 → C-04 → C-05 → C-06`.
- **Primer change**: `C-01` (estructura-base-navegacion).

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras

> Reglas **globales** ya definidas en `~/.claude/CLAUDE.md` (orquestador, governance, TDD, engram): el proyecto las **hereda**, no se repiten acá.

Acá van: (a) las reglas específicas de este proyecto, derivadas de su stack (HTML5/CSS3/JS vanilla) y **confirmadas con el usuario**; y (b) cualquier regla universal que el global NO cubra todavía (ej. no buildear/commitear sin pedido, conventional commits sin co-autoría IA — incluir SOLO si no están en el global). Son contrato; romperlas es un defecto. Formato `NUNCA X → hacer Y`:

- **NUNCA** usar librerías, frameworks, CDNs, bundlers, npm → **vanilla only** (RN-TEC-01, DEC-16)
- **NUNCA** commitear sin confirmación explícita del usuario → confirmar antes de cada commit
- **NUNCA** buildear/compilar → no hay build, se entrega `index.html` directo al navegador
- **SIEMPRE** conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`) sin co-autoría IA
- **SIEMPRE** separación estricta HTML (estructura) / CSS (presentación) / JS (comportamiento) en archivos separados (RN-UX-05)
- **SIEMPRE** insertar datos de usuario con `textContent`/`createTextNode` — **NUNCA** `innerHTML` (XSS prevention, DEC-11)
- **SIEMPRE** validaciones sincrónicas retornando `{ok, errors[]}` — nada de Promises/excepciones para UX (DEC-13)
- **SIEMPRE** IDs estables (no índices de array) — `Date.now().toString(36) + random` (DEC-08, SUP-08)
- **SIEMPRE** normalizar ISBN (`replace(/[\s-]/g, '').toUpperCase()`) para comparaciones (RN-LIB-02, DEC-05)
- **SIEMPRE** email único case-insensitive + trim (RN-CLI-03, DEC-06)

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.