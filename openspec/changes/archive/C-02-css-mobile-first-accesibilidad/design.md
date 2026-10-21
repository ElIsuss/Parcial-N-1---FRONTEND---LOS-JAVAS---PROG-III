# Design: C-02-css-mobile-first-accesibilidad

> Retroactivo — documenta las decisiones ya implementadas en `1139201`.

## Context

C-01 entregó `index.html` con hooks de clase e `id` pero sin ningún CSS link funcional (los 5 `<link>` apuntaban a archivos inexistentes). No había paleta, layout ni estados. Ver proposal.md — Why.

## Goals / Non-Goals

**Goals:**
- CSS puro mobile-first con variables de tema centralizadas
- Layout SPA (header/nav/main/footer + toggle `.activa` listo para el JS de nav)
- Estilos de catálogo, formularios, tablas y modal con estados accesibles

**Non-Goals:**
- Comportamiento JS (nav toggle y bindings → radicados en C-03, ver abajo)
- Animaciones/efectos más allá de transiciones básicas
- Dark mode

## Decisions

1. **Mobile-first con breakpoints en variables**: base escrita para 320px; `@media (min-width: 768px)` (md) y `(min-width: 1280px)` (lg). Variables `--breakpoint-sm/md/lg` en `:root` (DEC-10, RN-UX-04).
   *Descartado*: desktop-first con max-width — obliga a "deshacer" estilos en móvil.

2. **Variables CSS en `base.css :root`** para paleta (`--color-primary/accent/error/success/focus…`), tipografía, spacing y radios. Un solo lugar para theming (RN-UX-05, DEC-10).

3. **BEM simplificado** (bloque `.libro-card`, elementos `h3/.meta/.precio`, modificadores de estado via clases existentes como `.activa`/`.fila-vacia`) — sin preprocesador.

4. **Layout grid CSS Grid** para header/nav/main/footer y para `.catalogo-grid` (tarjetas responsivas `auto-fill/minmax`); Flexbox para `.form-row`, `.form-actions`, nav-links.

5. **Tablas con scroll interno**: `.table-container { overflow-x: auto }` en todos los wrappers (DEC-15) + `position: sticky` en `<thead>` y striping para legibilidad.

6. **Accesibilidad en CSS**: `:focus-visible` global con outline `--color-focus`, `@media (prefers-reduced-motion: reduce)` desactiva transiciones, `.errores-formulario` con color `--color-error`, `.visually-hidden`/`.sr-only` duplicado para compatibilidad (DEC-11 ya lo pide el HTML).

7. **Alcance real vs planificado**: el plan de CHANGES.md incluía `js/navegacion.js` y `js/app.js` en C-02; en la implementación real quedaron en el commit de C-03 (`efe0980`), sin impacto en la sequencia (C-03 los necesitaba igual). Se documenta aquí en vez de falsear el historial.

## Risks / Trade-offs

- [Duplicación `.visually-hidden`/`.sr-only`] → aceptada por compatibilidad de nombres herados del HTML de C-01
- [JS de nav fuera de este change] → sin toggle `.activa` hasta C-03; el HTML de C-01 dejó la vista catálogo con `.activa` preaplicada, así la SPA era usable

## Migration Plan

Sin migración: los 5 `<link>` de C-01 ya apuntaban a estas rutas. Rollback = revert de `1139201`.

## Open Questions

Ninguna.
