# Tasks: C-02-css-mobile-first-accesibilidad

> Retroactivo — implementado en `1139201 Etapa N°2 - CSS implementada con SDD`. Checkboxes `[x]` = estado real. `skip_specs: true` (sin delta de specs).

## 1. Tema y utilidades (`css/base.css`)

- [x] 1.1 Reset (`box-sizing`, margins) + `html/body` base — Verificar: sin estilos de usuario-agent conflictivos
- [x] 1.2 Variables `:root`: paleta (`--color-primary/accent/error/success/focus/bg/surface/text/border`), tipografía, spacing, radios, `--breakpoint-sm: 320px / md: 768px / lg: 1280px` — Verificar: 94 líneas, solo colores hardcodeados en `:root`
- [x] 1.3 Utilidades `.visually-hidden`/`.sr-only` + `:focus-visible` global + `prefers-reduced-motion` — Verificar: Tab focus visible en nav y forms

## 2. Layout SPA (`css/layout.css`)

- [x] 2.1 Grid header/nav/main/footer mobile-first; `.vista` oculta por defecto, `.vista.activa` visible — Verificar: 320px muestra una columna, solo catálogo visible
- [x] 2.2 `@media (min-width: 768px)`: nav en fila; `@media (min-width: 1280px)`: container más amplio — Verificar: 1280px header y nav en una línea
- [x] 2.3 `.table-container { overflow-x: auto }` — Verificar: tablas con scroll horizontal, sin romper el layout

## 3. Catálogo (`css/catalogo.css`)

- [x] 3.1 `.catalogo-toolbar` + `.form-busqueda` (input + botones) — Verificar: toolbar visible y alineada
- [x] 3.2 `.catalogo-grid` responsive (`auto-fill/minmax`) + `.libro-card` (título/meta/precio, hover) — Verificar: tarjetas 1 col en 320px, múltiples en 768px+
- [x] 3.3 `.mensaje-vacio` centrado — Verificar: mensaje de "sin resultados" visible cuando corresponde

## 4. Formularios (`css/formularios.css`)

- [x] 4.1 `.form-alta`/`.form-venta`, `.form-group`+legend, `.form-row` label/input/select — Verificar: formularios de Libros/Ventas alineados
- [x] 4.2 `.form-actions`, `.btn` base + `.btn-primario`/`.btn-secundario`/`.btn-limpiar`/`.btn-buscar`/`.btn-cerrar-modal`, estados `:hover`/`:disabled` — Verificar: botones con jerarquía visual y disabled evidente
- [x] 4.3 `.errores-formulario` (color `--color-error`), focus-visible y `:invalid:not(:placeholder-shown)` en inputs — Verificar: errores destacados cerca del form (RN-LIB-09/DEC-14)

## 5. Tablas y modal (`css/tablas.css`)

- [x] 5.1 `.tabla-datos` (thead sticky, striping, celdas) + `.fila-vacia` — Verificar: tablas legibles, fila vacía con estilo diferenciado
- [x] 5.2 `.modal-detalle` sobre `<dialog>` nativo (overlay, header/body/footer) — Verificar: modal del historial estilizado (visible en C-05)

## 6. Cierre

- [x] 6.1 `.gitignore` agregado — Verificar: archivo presente en commit
- [x] 6.2 `CHANGES.md` — C-02 marcado `[x]` — Verificar: línea de estado
- [x] 6.3 Validación visual 320px/768px/1280px en navegador `file://` con los 5 CSS cargados y consola sin errores — Verificar: smoke test en las 3 anchuras

## Nota de alcance real

`js/navegacion.js` y el bootstrap de `js/app.js` previstos en este change se implementaron en el commit de C-03 (`efe0980`) — ver design.md §Decisiones 7. No hay tasks pendientes por ello en C-02.
