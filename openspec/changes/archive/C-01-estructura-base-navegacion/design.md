# Design: C-01-estructura-base-navegacion

## Visión General
Implementación del entry point SPA único (`index.html`) con navegación semántica entre 5 vistas, siguiendo arquitectura vanilla (HTML5/CSS3/JS ES6+) sin dependencias externas.

## Decisiones de Arquitectura

### 1. SPA vs Multi-página (DEC-01)
**Decisión**: SPA con secciones ocultadas/mostradas (`.vista` / `.vista.activa`)
**Justificación**:
- Un solo punto de entrada (`index.html`)
- Navegación instantánea sin recarga
- Funciona en `file://` sin servidor (fetch no permitido en file://)
- Cumple "navegación clara entre vistas" sin complejidad de routing

**Alternativa rechazada**: Multi-página (`catalogo.html`, `libros.html`, ...) requiere duplicar nav/header o include manual, y fetch no funciona en `file://`.

### 2. Módulos ES6 (DEC-02)
**Decisión**: `<script type="module" src="js/app.js">`
**Justificación**:
- Separación nativa de responsabilidades
- Imports/exports explícitos evitan colisiones globales
- Compatible con `file://` en navegadores modernos (Chrome/Edge/Firefox permiten ES modules en local con flag o servidor estático simple)

**Alternativa rechazada**: IIFE por archivo exponiendo en `window.App` — propenso a colisiones, menos mantenible.

### 3. Estructura de Vistas (Hooks para C-02+)
Cada vista es una `<section class="vista" id="vista-{nombre}">` con:
- `aria-labelledby` apuntando al `<h2 id="titulo-{nombre}">`
- Contenedores semánticos con `id` determinísticos para selección JS
- Clases BEM-ligeras para CSS (C-02): `.vista`, `.activa`, `.vista-header`, `.catalogo-grid`, `.form-row`, `.form-group`, `.table-container`, `.tabla-datos`, `.fila-vacia`, `.errores-formulario`, `.btn`, `.visually-hidden`

### 4. Accesibilidad (RN-UX-03, DEC-10, DEC-11)
- **Nav**: `aria-label="Navegación principal"`, links con `data-vista` + `aria-current="page"`
- **Forms**: Cada `<input>/<select>` tiene `<label for="id">`; `novalidate` en forms (validación JS)
- **Live regions**: `#errores-*` con `aria-live="polite"` para mensajes de error/éxito
- **Tablas**: `<th scope="col">`, `<caption>` descriptivo, `.table-container` wrapper
- **Modal**: `<dialog>` nativo con `aria-modal="true"`, `aria-labelledby`, focus trap nativo
- **Visualmente oculto**: `.visually-hidden` para labels solo screen-reader
- **Inserción segura**: Contenedores vacíos con `id` para `textContent`/`createTextNode` (nunca `innerHTML`)

### 5. Responsive (RN-UX-04, DEC-15)
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `.table-container { overflow-x: auto }` en CSS (C-02) — tablas scroll interno, no página
- Estructura grid/flex-ready en HTML (clases en contenedores principales)

### 6. Vanilla Only (RN-TEC-01, DEC-16)
- Cero frameworks, CDNs, librerías, bundlers
- Cero `package.json`, `node_modules`, build steps
- Entregable: archivos estáticos puros

## Estructura de Archivos del Proyecto (Post-C-01)

```
/
├── index.html                    ← C-01 (este change)
├── CHANGES.md                    ← Roadmap (ya existía)
├── AGENTS.md                     ← Instrucciones agentes (ya existía)
├── CLAUDE.md                     ← Copia de AGENTS.md (ya existía)
├── knowledge-base/               ← KB completa (ya existía)
├── .atl/
│   └── skill-registry.md         ← Registry de skills (ya existía)
├── openspec/                     ← OpenSpec config + changes (ya existía)
├── css/                          ← C-02 (futuro)
│   ├── base.css
│   ├── layout.css
│   ├── catalogo.css
│   ├── formularios.css
│   └── tablas.css
└── js/                           ← C-02 (futuro)
    ├── app.js                    ← Bootstrap
    ├── navegacion.js             ← mostrarVista()
    ├── data.js                   ← C-03
    ├── utils.js                  ← C-03
    ├── catalogo.js               ← C-03
    ├── libros.js                 ← C-04
    ├── clientes.js               ← C-04
    ├── ventas.js                 ← C-05
    └── historial.js              ← C-05
```

## Detalle de Hooks por Vista

### Vista Catálogo (`vista-catalogo`)
| Elemento | ID / Class | Propósito |
|----------|------------|-----------|
| Toolbar búsqueda | `#form-busqueda.form-busqueda` | Form submit + input events |
| Input búsqueda | `#input-busqueda` | `type="search"`, placeholder, autocomplete=off |
| Botón limpiar | `#btn-limpiar-busqueda.btn.btn-limpiar` | Hidden inicial, JS muestra si hay término |
| Contenedor grid | `#contenedor-catalogo.catalogo-grid` | `role="list"`, render tarjetas JS |
| Mensaje vacío | `#mensaje-catalogo-vacio.mensaje-vacio` | Hidden, JS muestra si 0 resultados |

### Vista Libros (`vista-libros`)
| Elemento | ID / Class | Propósito |
|----------|------------|-----------|
| Form alta | `#form-libro.form-alta` | `novalidate`, submit JS |
| Título | `#libro-titulo` | Required, text |
| ISBN | `#libro-isbn` | Required, placeholder formato |
| Precio | `#libro-precio` | Required, number min=0.01 step=0.01 |
| Editorial | `#libro-editorial` | Required select, options via JS |
| Género | `#libro-genero` | Optional select, "Sin clasificar" |
| Autores | `#contenedor-autores.multi-select` | Checkboxes generados JS |
| Errores | `#errores-libro.errores-formulario` | `aria-live="polite"` |
| Tabla listado | `#tabla-libros.tabla-datos` | 7 cols, `.fila-vacia` oculta |

### Vista Clientes (`vista-clientes`)
| Elemento | ID / Class | Propósito |
|----------|------------|-----------|
| Form alta | `#form-cliente.form-alta` | `novalidate` |
| Nombre | `#cliente-nombre` | Required, autocomplete=name |
| Email | `#cliente-email` | Required, type=email |
| Errores | `#errores-cliente.errores-formulario` | `aria-live="polite"` |
| Tabla listado | `.table-container` > `#tabla-clientes.tabla-datos` | 3 cols, `.fila-vacia` |

### Vista Ventas (`vista-ventas`)
| Elemento | ID / Class | Propósito |
|----------|------------|-----------|
| Selector cliente | `#venta-cliente` | Required select, options via JS |
| Selector libro | `#venta-libro` | Required select, options via JS |
| Cantidad | `#venta-cantidad` | Required number min=1 |
| Botón agregar | `#btn-agregar-renglon.btn.btn-primario` | Click → agregar renglón |
| Contenedor renglones | `#contenedor-renglones.renglones-lista` | Render dinámico |
| Tabla resumen | `#tabla-renglones.tabla-datos` | 5 cols + acciones |
| Total | `#venta-total` | Formato ARS 2 decimales |
| Confirmar | `#btn-confirmar-venta.btn.btn-primario` | Disabled hasta válido |
| Errores | `#errores-venta.errores-formulario` | `aria-live="polite"` hidden |

### Vista Historial (`vista-historial`)
| Elemento | ID / Class | Propósito |
|----------|------------|-----------|
| Tabla historial | `.table-container` > `#tabla-historial.tabla-datos` | 5 cols + btn "Ver detalle" |
| Modal detalle | `#modal-detalle.modal-detalle` | `<dialog>` nativo, `aria-modal="true"` |
| Meta detalle | `#detalle-id`, `#detalle-fecha`, `#detalle-cliente`, `#detalle-total` | `dl/dt/dd` |
| Tabla renglones detalle | `#tbody-detalle-renglones` | Render JS al abrir modal |

## Interfaz con Changes Posteriores

| Change | Qué consume de C-01 |
|--------|---------------------|
| **C-02** | Todas las clases CSS (`.vista`, `.activa`, `.catalogo-grid`, `.form-row`, `.table-container`, `.tabla-datos`, `.fila-vacia`, `.btn`, `.visually-hidden`, `.errores-formulario`), IDs de navegación (`data-vista`), `<script type="module">` |
| **C-03** | `#contenedor-catalogo`, `#input-busqueda`, `#btn-limpiar-busqueda`, `#mensaje-catalogo-vacio`, selects editorial/género/autores/cliente/libro vacíos listos para poblar |
| **C-04** | `#form-libro`, `#form-cliente`, `#contenedor-autores`, `#tabla-libros`, `#tabla-clientes`, `#errores-libro`, `#errores-cliente` |
| **C-05** | `#form-venta`, `#venta-cliente`, `#venta-libro`, `#venta-cantidad`, `#btn-agregar-renglon`, `#contenedor-renglones`, `#tabla-renglones`, `#venta-total`, `#btn-confirmar-venta`, `#errores-venta`, `#tabla-historial`, `#modal-detalle`, `#tbody-detalle-renglones` |
| **C-06** | Nada nuevo — solo persistencia y README |

## Validación de Diseño

### Navegación (Flujo 1)
1. `DOMContentLoaded` → `app.js` importa `navegacion.js` + `data.js`
2. `inicializar()` → `data.inicializar()` (carga semilla/localStorage) → `mostrarVista('catalogo')`
3. `mostrarVista('catalogo')` → quita `.activa` de todas, agrega a `#vista-catalogo`, actualiza `aria-current`
4. Usuario ve catálogo renderizado por `catalogo.js` (C-03)

### Cambio de Vista
- Click en nav-link → `data-vista` → `mostrarVista(vistaId)` → toggle `.activa` + `aria-current`
- Sin recarga, instantáneo, accesible por teclado (Enter/Space en links)

## Consideraciones de Seguridad
- **XSS Prevention (DEC-11)**: Todos los contenedores de datos dinámicos vacíos en HTML; JS en C-03+ usa `textContent`/`createTextNode` exclusivamente
- **Validación cliente (DEC-13)**: Forms `novalidate`; validación sincrónica en JS retorna `{ok, errors[]}`
- **IDs estables (DEC-08)**: JS generará IDs con `Date.now().toString(36) + random` (no índices de array)

## Métricas
- **Líneas HTML**: 285
- **Vistas**: 5
- **Formularios**: 3 (libro, cliente, venta)
- **Tablas**: 4 (libros, clientes, renglones venta, historial) + 1 modal detalle
- **Hooks JS (id)**: 35+
- **Clases CSS (hooks)**: 20+

## Riesgos Mitigados
| Riesgo | Mitigación |
|--------|------------|
| Navegación rota en file:// | SPA sections (no fetch), ES Modules con flag o servidor simple |
| Accesibilidad incompleta | ARIA completo en HTML, labels asociados, live regions, dialog nativo |
| CSS/JS acoplados | Separación estricta: HTML solo estructura + hooks, C-02/03+ añaden comportamiento |
| Selectores vacíos rotos | Placeholders `<option value="">Seleccionar…</option>` + JS puebla en C-03/04 |

---

**Diseño validado contra**: KB (01, 03, 05, 07, 09), CHANGES.md, Reglas Duras (AGENTS.md)