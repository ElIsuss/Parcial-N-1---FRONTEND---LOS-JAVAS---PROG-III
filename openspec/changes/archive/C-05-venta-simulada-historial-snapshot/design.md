## Context

Repo base `rama-juan` con Active Stack completo (C-01..C-04 archivados). Vista Ventas e Historial existen solo en markup (`index.html`). `Data.crearVenta()` es stub. Selectores `#venta-cliente` y `#venta-libro` se poblan desde `Data.getClientes()` y `Data.getLibros()` en `app.js:27-28`. `utils.js` expone `formatPriceARS`, `generateId`, `normalizeISBN`, `isValidEmail`, `debounce`. CSS modular en 5 archivos; nuevo `css/ventas.css` se agregará. Stack: vanilla ES Modules, localStorage, sin build.

## Goals / Non-Goals

**Goals:**
- Implementar `js/ventas.js` y `js/historial.js` como módulos ES6 siguiendo patrón repository (como `catalogo.js`, `libros.js`, `clientes.js`).
- `Data.crearVenta()` completa con validaciones sincrónicas RN-VTA-01..10, snapshot, persistencia.
- Validación estricta de cantidad (regex `/^\d+$/` + > 0) en composer y edición inline.
- Estados vacíos y mensajes de resultado accesibles (`role="status"`, `aria-live="polite"`).
- Historial con modal `<dialog>` usando snapshot histórico inmutable.
- CSS nuevo en `css/ventas.css` sin tocar archivos de compañeros.

**Non-Goals:**
- Editar/eliminar ventas (RN-VTA-13, RN-HIS-04).
- CRUD de editoriales/géneros/autores.
- Debounce en filtros (PA-12).
- Validación dígito control ISBN (PA-03).
- Multi-página (SPA con secciones ocultadas, DEC-01).
- Servidor/backend.

## Decisions

### 1. Arquitectura de módulos (ventas.js / historial.js)
**Decisión**: Dos módulos separados siguiendo el patrón de `catalogo.js`/`libros.js`/`clientes.js`: funciones puras + `bindFormVenta()`, `bindHistorial()` y `renderHistorial()` exportadas, sin estado global exportado (estado interno en closure). `app.js` importa e invoca en `DOMContentLoaded`.

**Alternativa considerada**: Un solo `ventas.js` con todo. Rechazado: separación de responsabilidades (composer vs historial), consistencia con C-04.

### 2. Estado del composer de venta (ventas.js)
**Decisión**: Array interno `renglones = []` donde cada elemento es `{ libroId, cantidad, precioUnitario, subtotal, titulo, isbn }`. `precioUnitario` se lee de `Data._findLibroById(libroId).precio` al agregar/editar (precio actual del catálogo para UI). Al confirmar, se copia a `precioUnitarioSnapshot` en el objeto que va a `Data.crearVenta()`.

**Razón**: UI muestra precio actual para referencia; snapshot solo al confirmar (RN-VTA-08).

### 3. Anti-duplicado por `libroId` (RN-VTA-05)
**Decisión**: Al agregar, buscar en `renglones` por `libroId`. Si existe → sumar cantidad, validar resultado > 0, recalcular subtotal. Mostrar mensaje "Cantidad actualizada" en `#resultado-venta` (role="status") por 3s.

**Alternativa**: Informar duplicado sin modificar. Rechazado: PDF dice "se modifica la cantidad del renglón existente o se informa el duplicado"; suma es mejor UX.

### 4. Validación estricta de cantidad
**Decisión**: Función `validarCantidad(valor)`:
```js
function validarCantidad(valor) {
  const v = String(valor);
  if (!/^\d+$/.test(v)) return { ok: false, error: 'Cantidad debe ser un número entero mayor a 0' };
  const n = Number(v);
  return n > 0 ? { ok: true, value: n } : { ok: false, error: 'Cantidad debe ser mayor a 0' };
}
```
Se usa en: agregar renglón, editar cantidad inline, confirmación final. No aplica `trim`: rechaza `2e3`, `2.9`, `+2`, `-1`, `0`, `" 3 "`, `"3 "`.

### 5. Edición inline de cantidad en tabla
**Decisión**: Cada renglón renderizado tiene `<input type="text" inputmode="numeric" pattern="[0-9]*" value="...">` en columna Cantidad. Evento `change` → validar con `validarCantidad`; si ok → actualizar estado, subtotal y celda en sitio (sin re-render del `tbody`, para no perder el click en "Quitar" ni el foco); si error → restaurar `input.value` desde el estado (que no se modifica) y mostrar error en `#errores-venta`.

### 6. Mensajes de estado (errores y éxito)
**Decisión**: 
- Errores → `#errores-venta` (ya existe, `aria-live="polite"`). Función `mostrarErrores(errors[])` limpia y agrega `<p>` por error, y oculta `#resultado-venta`.
- Éxito/Resultado → nuevo `#resultado-venta` (role="status", `aria-live="polite"`, hidden). Función `mostrarResultado(msg, tipo='exito')` setea texto, quita hidden, limpia `#errores-venta`, opcional auto-hide a 3s.
- No toasts globales (PA-09).

### 7. Formato de fecha en historial (PA-06)
**Decisión**: `new Date(fechaISO).toLocaleString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })` → "dd/mm/yyyy, hh:mm". En detalle modal, mismo formato.

### 8. Modal detalle (index.html ya tiene `<dialog id="modal-detalle">`)
**Decisión**: `historial.js` define la función interna `abrirDetalle(ventaId)` (no exportada) que:
- Busca venta en `Data.getVentas()`.
- Pobla `#detalle-meta` (id, fecha, cliente via join `Data._findClienteById`, total).
- Renderiza `#tbody-detalle-renglones` desde `venta.renglones[]` (usa `precioUnitarioSnapshot`, `subtotal`, `titulo`, `isbn`).
- `modal.showModal()`.
- Botones cerrar (header X y footer) → `modal.close()`.

### 9. CSS nuevo (css/ventas.css)
**Decisión**: Variables CSS ya definidas en `base.css`/`layout.css`. `ventas.css` define solo lo específico de C-05, reutilizando `tablas.css` y `formularios.css` para tabla, modal, totales y acciones:
- `.cantidad-input` (input de texto numérico, ancho fijo, alineación).
- `.btn-quitar`.
- `.mensaje-resultado.exito` / `.mensaje-resultado.error` (colores con tokens existentes).
- `#form-venta fieldset { min-width: 0; }` (evita overflow de fieldsets flex en 320px).
- Responsive: tabla con `overflow-x` interno (RN-UX-04).

### 10. Modificaciones mínimas a archivos existentes
- `js/data.js`: implementar `crearVenta(venta)` usando helpers internos (`_findLibroById`, `_findClienteById`, `guardarTodos`). Retorna `{ok, errors[], venta?}`. `guardarTodos()` ahora retorna `boolean`; si falla la persistencia, `crearVenta` revierte el `push` y retorna error.
- `js/app.js`: agregar imports `bindFormVenta` de `./ventas.js` y `bindHistorial`/`renderHistorial` de `./historial.js`; llamarlos tras poblar selectores.
- `js/clientes.js`: una línea tras `poblarSelectCliente(...)` para disparar `change` y mantener sincronizado el botón de confirmar venta luego de crear un cliente.
- `index.html`: 
  - Remover `style="width: 80px;"` de `#venta-cantidad` y usar `type="text" inputmode="numeric" pattern="[0-9]*"`.
  - Agregar `<div id="resultado-venta" class="mensaje-resultado" role="status" aria-live="polite" hidden></div>` después de `#errores-venta`.
  - En `<head>` tras `tablas.css`: agregar `<link rel="stylesheet" href="css/ventas.css">` (y favicon `data:,` para evitar 404).

### 11. Persistencia
**Decisión**: `Data.crearVenta()` valida, construye objeto Venta con snapshot (precio redondeado a 2 decimales), `push` a `_state.ventas`, llama `guardarTodos()`. Si `guardarTodos()` retorna `false`, revierte el `push` y retorna `{ok: false, errors: [...]}`. `Data.getVentas()` ya existe y retorna copia. Historial lee de ahí.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| `file://` bloquea ES Modules (PA-02) | Documentar en README: probar con `python3 -m http.server` o `npx serve`; no commitear workaround en código. |
| `.gitignore` ignora `openspec/changes/archive/` (H-08) | Al archivar C-05, usar `git add -f` o corregir `.gitignore` antes. |
| C-01 inválido y CHANGES.md desactualizado (H-05, H-06) | Fuera de alcance de C-05; no bloquea implementación. |
| Precio `Infinity` en catálogo si libro sin precio válido (bug C-04) | `crearVenta` valida que libro exista y `precio > 0` (RN-VTA-04 + RN-LIB-03 ya garantizado en alta). |
| Selectores `#venta-cliente`/`#venta-libro` vacíos si no hay datos | `Data.inicializar()` garantiza semilla ≥3 clientes, ≥6 libros (HU-06). |

## Open Questions

Ninguna — todas las decisiones de diseño resueltas arriba; ambiguedades de PA-05 (duplicado por libroId), PA-06 (fecha), PA-09 (mensajes inline) ya decididas.