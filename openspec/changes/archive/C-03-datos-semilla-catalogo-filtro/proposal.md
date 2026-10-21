# Proposal: C-03-datos-semilla-catalogo-filtro

> **Retroactivo**: este change fue implementado y commiteado (`efe0980 feat(c-03): implementar catalogo y filtro`) sin carpeta OpenSpec propia; el delta se escribió directamente en `openspec/specs/data-catalogo-filtro/spec.md`. Se reconstruye aquí para dejar el workflow consistente antes del archivado.

## Change ID
C-03

## Nombre
datos-semilla-catalogo-filtro

## Fase
FASE 2 — Datos: Semilla, Catálogo y Filtro

## Governance
MEDIO

## Dependencias
C-02 (CSS mobile-first, `mostrarVista`, bootstrap `app.js`)

## Why

La SPA tenía estructura y estilos pero ningún dato ni comportamiento: el catálogo vacío, los selects de las vistas Libros/Ventas sin opciones y los filtros/búsquedas sin lógica. Se necesita una capa de datos en memoria con semilla persistible y el renderizado/filtrado del catálogo para que C-04 (altas) y C-05 (ventas) tengan sobre qué operar.

## What Changes

- `js/data.js` — Repository pattern: arrays `libros/editoriales/generos/autores/clientes/ventas`, `SEED` con IDs estables, `inicializar()` (flag `libreria_inicializado`), `cargarSemilla()`, `guardarTodos()`, getters read-only, helpers `_find*ById`/`_isbnExists`/`_emailExists`, stubs de `crearLibro`/`crearCliente` (C-04) y `crearVenta` (C-05)
- `js/utils.js` — `normalizeISBN`, `formatPriceARS`, `isValidEmail`, `generateId`, `debounce`
- `js/catalogo.js` — `renderCatalogo()` (grid de tarjetas, `textContent` only), `filtrarLibros()` (trim+lowercase+substring), `bindBusqueda()` (submit + input + limpiar), `poblarSelectEditorial/Genero/Cliente/Libro`, `poblarContenedorAutores` (checkboxes)
- `js/nav.js` — `mostrarVista()` (toggle `.activa` + `aria-current`), radicado en este commit
- `js/app.js` — bootstrap: `Data.inicializar()` → poblar selects → `bindBusqueda()` → `renderCatalogo()` → `mostrarVista('catalogo')`
- `openspec/specs/data-catalogo-filtro/spec.md` — spec escrito directamente en main specs (sync manual)

## Capabilities

### New Capabilities
- `data-catalogo-filtro`: capa de datos en memoria con semilla/localStorage, utilidades compartidas, catálogo renderizado y filtro por título, y poblado de selects.

### Modified Capabilities
<!-- ninguna -->

## Impact

- Archivos nuevos: `js/data.js`, `js/utils.js`, `js/catalogo.js`, `js/nav.js`
- Modificados: `js/app.js`, `CHANGES.md` (estado `[x]`)
- Desbloquea: C-04 (usa getters, utils, poblar selects, renderCatalogo)

## Acceptance Criteria (resumen — ver spec)

1. `Data.inicializar()` carga semilla sin flag y localStorage con flag, sin duplicar
2. `Data.guardarTodos()` escribe las claves `libreria_*`
3. `renderCatalogo()` muestra ≥6 libros; género null → "Sin clasificar"
4. Búsqueda vacía → todo; "borges" → "Ficciones"; sin resultados → mensaje
5. Selects y checkboxes poblados desde datos
6. Sin `innerHTML` en renderizado; vanilla only

## Leer Antes (Knowledge Base)
- `knowledge-base/04_modelo_de_datos.md` (entidades)
- `knowledge-base/05_reglas_de_negocio.md` §RN-CAT-01..05, RN-LIB-02/07/08, RN-CLI-02/03, RN-PER-01..05
- `knowledge-base/06_funcionalidades.md` §Épica 3 (HU-06, HU-07, HU-08)
- `knowledge-base/07_flujos_principales.md` §Flujo 1 (pasos 1–3), Flujo 6
- `knowledge-base/09_decisiones_y_supuestos.md` §DEC-03, DEC-05, DEC-06, DEC-12, SUP-01..15

## Reglas Duras Aplicables
- RN-TEC-01 / DEC-16: vanilla only
- DEC-11: inserción solo `textContent`/`createTextNode`
- DEC-13: validaciones sync `{ok, errors[]}`
- DEC-08 / SUP-08: IDs estables pregenerados en semilla
- RN-UX-05: separación HTML/CSS/JS

## Archivos Afectados
- `js/data.js` (nuevo, 272 líneas), `js/utils.js` (nuevo, 61), `js/catalogo.js` (nuevo, 231), `js/nav.js` (nuevo, 25)
- `js/app.js` (+47), `openspec/specs/data-catalogo-filtro/spec.md` (nuevo), `CHANGES.md`

## Estimación
~4 horas (implementación completa en commit `efe0980`)

## Riesgos
- Ninguno vigente: change ya implementado; reconstrucción documental
