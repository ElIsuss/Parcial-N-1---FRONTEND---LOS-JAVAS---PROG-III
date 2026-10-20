# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Librería Parcial 1 Frontend**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 estructura-base-navegacion
  └── C-02 css-mobile-first-accesibilidad
        └── C-03 datos-semilla-catalogo-filtro
              └── C-04 altas-libros-clientes-listados
                    └── C-05 venta-simulada-historial-snapshot
                          └── C-06 persistencia-localstorage-readme-casos
```

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 estructura-base-navegacion           [Agente A]

GATE 1: C-01 ✓
  → C-02 css-mobile-first-accesibilidad       [Agente A]

GATE 2: C-02 ✓
  → C-03 datos-semilla-catalogo-filtro        [Agente A]

GATE 3: C-03 ✓
  → C-04 altas-libros-clientes-listados       [Agente A]

GATE 4: C-04 ✓
  → C-05 venta-simulada-historial-snapshot    [Agente A]

GATE 5: C-05 ✓
  → C-06 persistencia-localstorage-readme-casos [Agente A]
```

### Camino crítico (6 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-04 → C-05 → C-06
```

### Plan óptimo con 3 agentes

```
Paso │ Agente A (Frontend Core)          │ Agente B (—) │ Agente C (—)
─────┼───────────────────────────────────┼──────────────┼──────────────
  1  │ C-01 estructura-base-navegacion   │ —            │ —
  2  │ C-02 css-mobile-first-accesibilidad │ —          │ —
  3  │ C-03 datos-semilla-catalogo-filtro │ —            │ —
  4  │ C-04 altas-libros-clientes-listados │ —           │ —
  5  │ C-05 venta-simulada-historial-snapshot │ —       │ —
  6  │ C-06 persistencia-localstorage-readme-casos │ —  │ —
```

---

## FASE 0 — Cimientos: Estructura y Navegación

### [C-01] `estructura-base-navegacion`
- **Estado**: `[x]` completado
- **Scope**: 
  - `index.html` completo (único entry point SPA)
    - `<header>` con título + `<nav>` 5 enlaces `data-vista` (Catálogo, Libros, Clientes, Ventas, Historial)
    - `<main>` con 5 `<section class="vista" id="vista-*">` (catalogo, libros, clientes, ventas, historial)
    - Cada vista con estructura semántica: formularios, tablas, contenedores con `id` y `data-*` hooks
    - `<dialog id="modal-detalle">` nativo para detalle de venta
    - `<footer>`
    - 5 `<link rel="stylesheet">` a CSS futuros + `<script type="module" src="js/app.js">`
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Alcance (vistas, navegación, vanilla only)
  - `knowledge-base/03_actores_y_roles.md` (actores usan nav)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-UX-03, RN-UX-04, RN-UX-05
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (pasos 1–4)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DEC-01, DEC-02, DEC-10

---

## FASE 1 — Presentación: CSS Mobile-First y Accesibilidad

### [C-02] `css-mobile-first-accesibilidad`
- **Estado**: `[x]` completado
- **Scope**: 
  - `css/base.css` — reset, variables CSS (paleta, tipografía, spacing, breakpoints), utilidades `.visually-hidden`, `.sr-only`, `focus-visible`
  - `css/layout.css` — grid header/nav/main, `.vista` / `.vista.activa`, responsive 320px/1280px, `.table-container { overflow-x: auto }`
  - `css/catalogo.css` — `.catalogo-grid`, `.catalogo-toolbar`, tarjetas libro responsive
  - `css/formularios.css` — `.form-row`, `.form-group`, `.form-actions`, `.btn`, `.btn-primario`, `.btn-secundario`, `.errores-formulario`, estados focus/invalid
  - `css/tablas.css` — `.tabla-datos`, `.fila-vacia`, `.modal-detalle`, scroll interno tablas
  - `js/navegacion.js` — `mostrarVista(vistaId)` togglea `.activa`, actualiza `aria-current`
  - `js/app.js` — bootstrap `DOMContentLoaded` → `inicializar()` → `mostrarVista('catalogo')`
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Accesibilidad básica, Responsive
  - `knowledge-base/05_reglas_de_negocio.md` §RN-UX-03, RN-UX-04, RN-UX-05
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (pasos 1–4), Flujo 2, Flujo 3
  - `knowledge-base/08_arquitectura_propuesta.md` §CSS Mobile-first, BEM simplificado
  - `knowledge-base/09_decisiones_y_supuestos.md` §DEC-10, DEC-11, DEC-15

---

## FASE 2 — Datos: Semilla, Catálogo y Filtro

### [C-03] `datos-semilla-catalogo-filtro`
- **Estado**: `[x]` completado
- **Scope**: 
  - `js/data.js` — Repository pattern simulado: `libros[]`, `editoriales[]`, `generos[]`, `autores[]`, `clientes[]`, `ventas[]`; `cargarSemilla()`, `guardarTodos()`, `inicializar()` con flag `libreria_inicializado`; getters `getLibros()`, `getEditoriales()`, `getGeneros()`, `getAutores()`, `getClientes()`, `getVentas()`
  - `js/utils.js` — `normalizeISBN()`, `formatPriceARS()`, `isValidEmail()`, `generateId()`, `debounce()`
  - `js/catalogo.js` — `renderCatalogo(librosFiltrados)`, `filtrarLibros(termino)` (trim + lowercase + substring), `bindBusqueda()` eventos input/submit, mensajes vacío/sin-resultados
  - Poblar selects editorial/género/autores en vistas Libros y Ventas desde `data.js`
  - Poblar select cliente en vista Ventas
- **Dependencias**: C-02
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` (entidades Libro, Editorial, Género, Autor, Cliente, Venta, Renglón)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CAT-01..05, RN-LIB-02, RN-LIB-08, RN-CLI-02, RN-CLI-03, RN-PER-01..05
  - `knowledge-base/06_funcionalidades.md` §Épica 3 (HU-06, HU-07, HU-08)
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (pasos 1–3), Flujo 6
  - `knowledge-base/09_decisiones_y_supuestos.md` §DEC-03, DEC-05, DEC-06, DEC-12, SUP-01..15

---

## FASE 3 — Altas: Libros, Clientes y Listados

### [C-04] `altas-libros-clientes-listados`
- **Estado**: `[ ]` pendiente
- **Scope**: 
  - `js/libros.js` — `bindFormLibro()`: preventDefault, validaciones RN-LIB-01..06 (título req, ISBN único normalizado, precio >0, editorial existente, género opcional, ≥1 autor), `renderListadoLibros()`, actualiza selectores venta tras alta exitosa, limpia formulario, muestra errores cerca formulario (`#errores-libro`)
  - `js/clientes.js` — `bindFormCliente()`: preventDefault, validaciones RN-CLI-01..03 (nombre req, email formato + único case-insensitive+trim), `renderListadoClientes()`, actualiza selector venta, limpia formulario, errores en `#errores-cliente`
  - Tablas `#tabla-libros` (7 cols) y `#tabla-clientes` (3 cols) con fila vacía oculta `.fila-vacia`
  - Checkboxes autores en `#contenedor-autores` generados dinámicamente desde `autores[]`
- **Dependencias**: C-03
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Libro, Cliente, Editorial, Género, Autor
  - `knowledge-base/05_reglas_de_negocio.md` §RN-LIB-01..10, RN-CLI-01..05, RN-PER-01..03, RN-UX-01, RN-UX-02, RN-UX-05
  - `knowledge-base/06_funcionalidades.md` §Épica 4 (HU-09, HU-10, HU-11)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2, Flujo 3
  - `knowledge-base/09_decisiones_y_supuestos.md` §DEC-03, DEC-07, DEC-08, DEC-13, DEC-14

---

## FASE 4 — Transacciones: Venta Simulada e Historial con Snapshot

### [C-05] `venta-simulada-historial-snapshot`
- **Estado**: `[ ]` pendiente
- **Scope**: 
  - `js/ventas.js` — Composer venta: `bindFormVenta()`, selector cliente obligatorio, agregar renglón (select libro + input cantidad), validar RN-VTA-03/04, anti-duplicado RN-VTA-05 (modifica cantidad o informa), recalcular subtotales RN-VTA-06 + total RN-VTA-07, habilitar/deshabilitar `#btn-confirmar-venta`
  - Confirmar: validación final RN-VTA-10, crear objeto Venta con `id`, `fecha` (ISO), `clienteId`, `renglones[]` con `precioUnitarioSnapshot` (copia `libro.precio` actual), `titulo`, `isbn`, `total`; guardar en `ventas[]` + localStorage; limpiar formulario + mensaje éxito RN-VTA-12
  - `js/historial.js` — `renderHistorial()`: tabla `#tabla-historial` (id, fecha legible, cliente nombre, total 2dec), botón "Ver detalle" abre `<dialog id="modal-detalle">` con meta + tabla renglones usando `precioUnitarioSnapshot` (RN-HIS-03), sin editar/eliminar RN-HIS-04
  - Formateo fecha `dd/mm/yyyy hh:mm`, precio ARS 2 decimales
- **Dependencias**: C-04
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Venta, RenglónVenta
  - `knowledge-base/05_reglas_de_negocio.md` §RN-VTA-01..13, RN-HIS-01..04, RN-PER-01, RN-PER-03, RN-UX-01, RN-UX-02
  - `knowledge-base/06_funcionalidades.md` §Épica 5 (HU-12, HU-13, HU-14, HU-15)
  - `knowledge-base/07_flujos_principales.md` §Flujo 4, Flujo 5
  - `knowledge-base/09_decisiones_y_supuestos.md` §DEC-04, DEC-09, SUP-06, SUP-07, SUP-08

---

## FASE 5 — Cierre: Persistencia, README y Casos Manuales

### [C-06] `persistencia-localstorage-readme-casos`
- **Estado**: `[ ]` pendiente
- **Scope**: 
  - `js/data.js` — Completar persistencia: `guardarTodos()` escribe 3 claves `libreria_libros`, `libreria_clientes`, `libreria_ventas` (+ opcionales editoriales/géneros/autores); `inicializar()` respeta flag `libreria_inicializado` (RN-PER-02/03)
  - `README.md` completo:
    - Autores del trabajo
    - Pasos para abrir `index.html` sin npm
    - Navegación entre vistas
    - Funcionalidades implementadas y pendientes
    - Ubicación de datos iniciales (`js/data.js` → `cargarSemilla()` / localStorage)
    - Funcionamiento y límites de localStorage
    - Tabla 7 casos manuales con resultados esperados (ver Flujo 7)
    - Procedencia de imágenes ajenas (si aplica)
  - Verificar 7 casos manuales en navegador (Flujo 7) y documentar resultados en README
- **Dependencias**: C-05
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PER-01..05, RN-UX-02, RN-UX-03, RN-UX-04
  - `knowledge-base/06_funcionalidades.md` §Épica 6 (HU-16, HU-17, HU-18)
  - `knowledge-base/07_flujos_principales.md` §Flujo 6, Flujo 7 (tabla 7 casos)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DEC-12, SUP-01, SUP-03, SUP-10
  - `knowledge-base/10_preguntas_abiertas.md` (si hay dudas pendientes)

---

## Resumen

| Change | Nombre | Pts | Gov | Depende de |
|--------|--------|-----|-----|------------|
| C-01 | estructura-base-navegacion | 20 | BAJO | — |
| C-02 | css-mobile-first-accesibilidad | 20 | BAJO | C-01 |
| C-03 | datos-semilla-catalogo-filtro | 15 | MEDIO | C-02 |
| C-04 | altas-libros-clientes-listados | 15 | MEDIO | C-03 |
| C-05 | venta-simulada-historial-snapshot | 20 | ALTO | C-04 |
| C-06 | persistencia-localstorage-readme-casos | 10 | BAJO | C-05 |
| **TOTAL** | | **100** | | |

**Primer change recomendado**: `C-01 estructura-base-navegacion` → `/opsx:propose C-01-estructura-base-navegacion`