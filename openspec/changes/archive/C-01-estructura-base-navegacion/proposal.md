# Proposal: C-01-estructura-base-navegacion

## Change ID
C-01

## Nombre
estructura-base-navegacion

## Fase
FASE 0 — Cimientos: Estructura y Navegación

## Estado
Propuesto (implementación completa retroactiva)

## Governance
BAJO

## Dependencias
Ninguna (primer change del camino crítico)

## Scope

### Entregable principal
`index.html` — Único entry point SPA con navegación entre 5 vistas.

### Detalle del scope
- **Header + Nav**: `<header>` con título + `<nav aria-label="Navegación principal">` conteniendo 5 enlaces `<a class="nav-link" data-vista="...">` (Catálogo, Libros, Clientes, Ventas, Historial). El enlace activo lleva `aria-current="page"`.
- **Main con 5 vistas SPA**: `<main class="site-main">` contiene 5 `<section class="vista" id="vista-*">` (catalogo, libros, clientes, ventas, historial). Solo la vista activa tiene la clase `.activa` (toggle por JS en C-02).
- **Vista Catálogo** (`vista-catalogo`):
  - Toolbar de búsqueda: `#form-busqueda` con `#input-busqueda` (type="search"), botón submit "Buscar", botón "Limpiar" oculto inicialmente
  - Contenedor grid: `#contenedor-catalogo.catalogo-grid` (role="list")
  - Mensaje vacío: `#mensaje-catalogo-vacio.mensaje-vacio` (hidden)
- **Vista Libros** (`vista-libros`):
  - Formulario alta `#form-libro` (novalidate): título (req), ISBN (req, placeholder), precio (req, number min=0.01 step=0.01), select editorial `#libro-editorial` (req, options vacíos + placeholder), select género `#libro-genero` (opcional, option "Sin clasificar"), contenedor checkboxes autores `#contenedor-autores.multi-select` (role="group")
  - Tabla listado `#tabla-libros.tabla-datos` (7 columnas: ID, Título, ISBN, Editorial, Género, Autores, Precio) con fila vacía `.fila-vacia` oculta
- **Vista Clientes** (`vista-clientes`):
  - Formulario alta `#form-cliente`: nombre completo (req), email (req, type="email")
  - Tabla listado `#tabla-clientes.tabla-datos` (3 columnas: ID, Nombre, Email) con fila vacía
- **Vista Ventas** (`vista-ventas`):
  - Selector cliente obligatorio `#venta-cliente` (req, options vacíos)
  - Composer renglones: select libro `#venta-libro` (req), input cantidad `#venta-cantidad` (req, min=1), botón "Agregar" `#btn-agregar-renglon`
  - Tabla resumen `#tabla-renglones` (5 cols: Libro, Cant., Precio unit., Subtotal, Acciones) con total `#venta-total`
  - Botón confirmar `#btn-confirmar-venta` (disabled inicialmente)
- **Vista Historial** (`vista-historial`):
  - Tabla `#tabla-historial` (5 cols: ID, Fecha, Cliente, Total, Acciones)
  - Modal detalle nativo `<dialog id="modal-detalle" aria-modal="true">` con meta (ID, Fecha, Cliente, Total) y tabla renglones `#tbody-detalle-renglones`
- **Footer**: Información básica del trabajo
- **Recursos externos**: 5 `<link rel="stylesheet">` (base.css, layout.css, catalogo.css, formularios.css, tablas.css) + `<script type="module" src="js/app.js">`

## Acceptance Criteria

1. ✅ `index.html` abre en navegador (file://) sin errores
2. ✅ Header + Nav + Catálogo activo + Footer visibles
3. ✅ 5 nav-links con `data-vista` único y `aria-current` en el activo
4. ✅ 5 `<section class="vista">` con IDs únicos (`vista-catalogo`, `vista-libros`, `vista-clientes`, `vista-ventas`, `vista-historial`)
5. ✅ Primera vista (`catalogo`) tiene clase `.activa`
6. ✅ `<dialog id="modal-detalle">` nativo con `aria-modal="true"` y `aria-labelledby`
7. ✅ `<script type="module" src="js/app.js">` para ES Modules (DEC-02)
8. ✅ 5 `<link rel="stylesheet">` referencian CSS futuros (C-02)
9. ✅ HTML semántico válido: header, nav, main, section, article, table, thead/th, tbody/tr/td, form, label, button, dialog, footer
10. ✅ Accesibilidad completa: aria-label, aria-current, aria-labelledby, aria-live="polite", `<th scope="col">`, `<label for="id">` en **todos** los inputs/selects
11. ✅ Sin estilos inline, sin JS inline, vanilla only (RN-TEC-01)
12. ✅ Separación estricta HTML/CSS/JS (RN-UX-05)
13. ✅ Hooks listos para C-02+: `.vista/.activa`, `.catalogo-grid`, `.form-row`, `.table-container`, `.tabla-datos`, `.fila-vacia`, `.errores-formulario`, `.btn`, `.visually-hidden`
14. ✅ Todas las tablas dentro de `.table-container` para scroll interno (DEC-15)
15. ✅ Contenedores vacíos con `id` para inserción via `textContent`/`createTextNode` (DEC-11)

## Leer Antes (Knowledge Base)
- `knowledge-base/01_vision_y_objetivos.md` §Alcance (vistas, navegación, vanilla only)
- `knowledge-base/03_actores_y_roles.md` (actores usan nav)
- `knowledge-base/05_reglas_de_negocio.md` §RN-UX-03, RN-UX-04, RN-UX-05, RN-TEC-01/02
- `knowledge-base/07_flujos_principales.md` §Flujo 1 (pasos 1–4)
- `knowledge-base/09_decisiones_y_supuestos.md` §DEC-01, DEC-02, DEC-10

## Reglas Duras Aplicables
- **RN-TEC-01**: Vanilla only — sin librerías/frameworks/CDN
- **RN-UX-03**: Accesibilidad básica (foco visible, nav teclado, errores con texto, alt en imágenes)
- **RN-UX-04**: Responsive 320px/1280px (meta viewport, table-container overflow-x:auto)
- **RN-UX-05**: Separación HTML/CSS/JS en archivos separados
- **DEC-01**: SPA con secciones ocultadas/mostradas
- **DEC-02**: Módulos ES6 (`type="module"`)
- **DEC-10**: CSS Mobile-first con variables + BEM simplificado (hooks en HTML)
- **DEC-11**: Inserción de datos solo vía `textContent`/`createTextNode`
- **DEC-15**: Tablas con scroll horizontal interno
- **DEC-16**: Vanilla only — sin librerías/frameworks/CDN

## Archivos Afectados
- `index.html` (nuevo - 285 líneas)
- `CHANGES.md` (actualizado - estado C-01 a `[x]`)

## Estimación
~4 horas (implementación + validación)

## Riesgos
- Ninguno identificados — change atómico, sin dependencias, HTML puro