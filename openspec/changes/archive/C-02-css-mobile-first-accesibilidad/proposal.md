# Proposal: C-02-css-mobile-first-accesibilidad

> **Retroactivo**: este change fue implementado y commiteado (`1139201 Etapa N°2 - CSS implementada con SDD`) sin carpeta OpenSpec propia y sin delta de specs. Se reconstruye aquí para dejar el workflow consistente antes del archivado. `skip_specs: true` — la capa de presentación no define requerimientos a nivel de spec en este proyecto (C-01 tampoco los tuvo).

## Change ID
C-02

## Nombre
css-mobile-first-accesibilidad

## Fase
FASE 1 — Presentación: CSS Mobile-First y Accesibilidad

## Governance
BAJO

## Dependencias
C-01 (`index.html` con hooks: `.vista`, `.catalogo-grid`, `.form-row`, `.tabla-datos`, `.fila-vacia`, `.errores-formulario`, `.btn`, `.visually-hidden`)

## Why

El HTML de C-01 carecía por completo de estilos: la SPA se veía como documento crudo, sin responsive, sin foco visible ni contraste de errores. Se necesita la capa CSS mobile-first (variables, layout grid, componentes de formulario/tabla/catálogo) para que las vistas de C-03+ se presenten correctamente en 320px–1280px.

## What Changes

- `css/base.css` — reset, variables CSS (`:root`: paleta, tipografía, spacing, breakpoints), utilidades `.visually-hidden`/`.sr-only`, `focus-visible`
- `css/layout.css` — grid header/nav/main/footer, `.vista`/`.vista.activa`, responsive 320px/1280px, `.table-container { overflow-x: auto }`
- `css/catalogo.css` — `.catalogo-toolbar`, `.catalogo-grid`, `.libro-card`, `.mensaje-vacio`
- `css/formularios.css` — `.form-alta`/`.form-venta`, `.form-row`, `.form-group`, `.form-actions`, `.btn*` (primario/secundario/limpiar/buscar/cerrar), `.errores-formulario`, estados focus/invalid/disabled
- `css/tablas.css` — `.tabla-datos` (thead sticky, striping), `.fila-vacia`, `.modal-detalle`, scroll interno
- `.gitignore` agregado en el mismo commit
- **Nota de alcance real**: `js/navegacion.js` (`mostrarVista`) y el bootstrap de `js/app.js` previstos en este change terminaron radicados en el commit de C-03 (`efe0980`) — ver design.md

## Capabilities

### New Capabilities
<!-- ninguna — skip_specs: true -->

### Modified Capabilities
<!-- ninguna -->

## Impact

- Archivos nuevos: 5 CSS (635 líneas) + `.gitignore`
- Modificados: `CHANGES.md` (estado `[x]`)
- Sin cambios de JS en este commit (nav.js/app.js → commit C-03)
- Desbloquea: C-03 (presentación del catálogo y formularios)

## Acceptance Criteria (resumen)

1. `index.html` referencia los 5 CSS y se ve estilizado en `file://`
2. Mobile-first: usable a 320px, layout de 1 columna; ≥768px header en fila, grid de tarjetas y tablas con scroll interno
3. Variables CSS centralizadas (paleta/tipografía/spacing) — sin colores hardcodeados fuera de `:root`
4. Estados accesibles: `:focus-visible` con outline, `.errores-formulario` con `--color-error`, `.fila-vacia`
5. Vanilla CSS only (sin frameworks/preprocesadores/CDN) — RN-TEC-01, DEC-16

## Leer Antes (Knowledge Base)
- `knowledge-base/01_vision_y_objetivos.md` §Accesibilidad básica, Responsive
- `knowledge-base/05_reglas_de_negocio.md` §RN-UX-03, RN-UX-04, RN-UX-05
- `knowledge-base/07_flujos_principales.md` §Flujo 1 (pasos 1–4), Flujo 2, Flujo 3
- `knowledge-base/08_arquitectura_propuesta.md` §CSS Mobile-first, BEM simplificado
- `knowledge-base/09_decisiones_y_supuestos.md` §DEC-10, DEC-11, DEC-15

## Reglas Duras Aplicables
- RN-TEC-01 / DEC-16: vanilla only (CSS puro, sin CDN)
- RN-UX-03: accesibilidad (focus-visible, contraste errores)
- RN-UX-04: responsive 320px/1280px
- RN-UX-05: separación HTML/CSS/JS
- DEC-10: mobile-first + variables + BEM simplificado
- DEC-15: `.table-container` con `overflow-x: auto`

## Archivos Afectados
- `css/base.css`, `css/layout.css`, `css/catalogo.css`, `css/formularios.css`, `css/tablas.css` (nuevos)
- `.gitignore` (nuevo), `CHANGES.md` (modificado)

## Estimación
~4 horas (implementación en commit `1139201`)

## Riesgos
- Ninguno vigente: change ya implementado; reconstrucción documental
