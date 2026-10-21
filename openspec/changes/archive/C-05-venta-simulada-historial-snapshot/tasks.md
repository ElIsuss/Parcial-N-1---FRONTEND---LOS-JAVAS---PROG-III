## 1. Preparación y archivos base

- [x] 1.1 Crear `js/ventas.js` con estructura de módulo ES6 (exports: `bindFormVenta`, `validarCantidad`, helpers internos)
- [x] 1.2 Crear `js/historial.js` con estructura de módulo ES6 (exports: `renderHistorial`, `bindHistorial`; función interna `abrirDetalle`)
- [x] 1.3 Crear `css/ventas.css` vacío (se irá completando)
- [x] 1.4 Agregar import y link en `index.html`:
  - Remover `style="width: 80px;"` de `#venta-cantidad` (línea 197)
  - Agregar `<div id="resultado-venta" class="mensaje-resultado" role="status" aria-live="polite" hidden></div>` después de `#errores-venta`
  - Agregar `<link rel="stylesheet" href="css/ventas.css">` en `<head>` tras `tablas.css`

## 2. Implementar Data.crearVenta() (js/data.js)

- [x] 2.1 Implementar validaciones RN-VTA-01..05, 10 en `crearVenta(venta)`:
  - Cliente obligatorio (`clienteId` existe en `Data.getClientes()`)
  - Al menos un renglón (`renglones.length ≥ 1`)
  - Cada renglón: `cantidad` entero > 0 (`Number.isInteger`)
  - Cada renglón: `libroId` existe en `Data.getLibros()`
  - Sin libros duplicados en `renglones[]` (por `libroId`)
- [x] 2.2 Construir objeto Venta con snapshot:
  - `id` = `generateId()` (re-generado si colisiona)
  - `fecha` = `new Date().toISOString()`
  - `clienteId` = entrada
  - `renglones[]` mapeados: cada uno con `libroId`, `cantidad`, `precioUnitarioSnapshot = Number(libro.precio.toFixed(2))`, `subtotal = cantidad * precioUnitarioSnapshot` (2 decimales), `titulo = libro.titulo`, `isbn = libro.isbn`
  - `total` = suma de subtotales (2 decimales)
- [x] 2.3 Persistir: `_state.ventas.push(venta)`, `guardarTodos()`; si la persistencia falla, revertir el `push` y retornar `{ok: false, errors: [...]}`.
- [x] 2.4 Manejo de errores: retornar `{ok: false, errors: [...]}` sin mutar estado (o revirtiendo la mutación si falla la persistencia).

## 3. Módulo ventas.js (composer + validaciones + UI)

- [x] 3.1 `validarCantidad(valor)` → `{ok, value?, error?}` con regex `/^\d+$/` + > 0.
- [x] 3.2 `bindFormVenta()`:
  - Referencias DOM: selects, input cantidad, btn-agregar, tabla tbody, total, btn-confirmar, errores, resultado, form.
  - Los selects `#venta-cliente` y `#venta-libro` se pueblan desde `js/app.js`.
  - Event listeners: submit form (preventDefault → confirmar), click btn-agregar, change input cantidad en tabla (delegación), click btn-quitar (delegación), change en `#venta-cliente` (actualiza botón), keydown Enter en cantidad (agrega renglón, no confirma), reset form (limpieza completa).
- [x] 3.3 Agregar renglón:
  - Leer `libroId`, `cantidad` → validar cantidad estricta.
  - Buscar libro en `Data.getLibros()` → precio actual, título, ISBN.
  - Verificar duplicado por `libroId` en estado interno `renglones[]`:
    - Si existe: sumar cantidad, validar > 0, actualizar subtotal, mostrar "Cantidad actualizada" en `#resultado-venta`.
    - Si nuevo: push a `renglones[]`.
  - Re-render tabla + total + habilitar/deshabilitar confirmar.
  - Limpiar input cantidad a "1".
- [x] 3.4 Editar cantidad inline (input en tabla):
  - Validar nuevo valor con `validarCantidad`.
  - Si ok: actualizar `renglones[idx].cantidad`, recalcular subtotal, actualizar la fila en sitio (sin re-render del `tbody`), recalcular total.
  - Si error: restaurar `input.value` desde `renglones[idx].cantidad` (el estado no se modifica) y mostrar error en `#errores-venta`.
- [x] 3.5 Quitar renglón: splice `renglones[]`, re-render, si vacío → estado vacío visible, confirmar deshabilitado.
- [x] 3.6 Render tabla renglones: por cada renglón → `<tr>` con celdas: libro (título), cantidad (`<input type="text" inputmode="numeric" pattern="[0-9]*" value="...">`), precio unitario (formateado), subtotal (formateado), acciones (btn quitar). Fila vacía si `renglones.length === 0`.
- [x] 3.7 Total: `renglones.reduce((a, r) => a + r.subtotal, 0)` → `formatPriceARS` → `#venta-total`.
- [x] 3.8 Habilitar/deshabilitar `#btn-confirmar-venta`: true si cliente seleccionado Y renglones.length ≥ 1 Y todas las cantidades válidas.
- [x] 3.9 Confirmar venta:
  - Validar cliente + renglones (reusar lógica).
  - Construir payload para `Data.crearVenta()`.
  - Llamar `Data.crearVenta(payload)`.
  - Si ok: limpiar formulario (reset selects, vaciar renglones[], total 0, deshabilitar confirmar), `mostrarResultado('Venta confirmada correctamente')`, `renderHistorial()` para actualizar vista historial.
  - Si error: `mostrarErrores(errors)`.
- [x] 3.10 `mostrarErrores(errors[])`: limpiar `#errores-venta`, agregar `<p>` por error, quitar hidden; ocultar `#resultado-venta` para no mostrar mensajes contradictorios.
- [x] 3.11 `mostrarResultado(msg, tipo='exito')`: setear texto en `#resultado-venta`, quitar hidden, opcional `setTimeout(() => hidden=true, 3000)` para éxito; limpiar `#errores-venta`.
- [x] 3.12 Limpieza formulario (reset + estado interno): helper `resetFormulario()`.

## 4. Módulo historial.js (listado + modal detalle)

- [x] 4.1 `renderHistorial()`:
  - Leer `Data.getVentas()`.
  - Render `#tabla-historial tbody`: por venta → `<tr>` con celdas: id (corto), fecha legible (toLocaleString es-AR), cliente (join `Data._findClienteById`), total (formateado), acciones (btn "Ver detalle" con `data-venta-id`).
  - Estado vacío: si `ventas.length === 0` → mostrar fila `.fila-vacia`, ocultar filas de datos.
  - Delegación click en "Ver detalle" → `abrirDetalle(ventaId)`.
- [x] 4.2 `abrirDetalle(ventaId)`:
  - Buscar venta en `Data.getVentas()`.
  - Poblar `#detalle-id`, `#detalle-fecha` (formato legible), `#detalle-cliente` (nombre), `#detalle-total` (formateado).
  - Render `#tbody-detalle-renglones`: por renglón → libro (titulo), isbn, cantidad, precioUnitarioSnapshot (formateado), subtotal (formateado).
  - `document.getElementById('modal-detalle').showModal()`.
- [x] 4.3 Cerrar modal: botones `.btn-cerrar-modal` (header X y footer) → `modal.close()`.

## 5. Estilos (css/ventas.css)

- [x] 5.1 Estilos de renglón: `.cantidad-input` (texto numérico, ancho fijo ~64px, alineación), `.btn-quitar`.
- [x] 5.2 Reutilizar estilos existentes de tabla/totales (`.tabla-datos`, `.table-container`, `.venta-totales`); no duplicarlos.
- [x] 5.3 Estilos de mensajes: `.mensaje-resultado.exito` / `.mensaje-resultado.error` con tokens `--color-success` / `--color-error`; `#errores-venta` ya tiene clase base.
- [x] 5.4 Reutilizar modal/tabla existentes (`dialog`, `.modal-*`, `.detalle-meta`); agregar solo `#form-venta fieldset { min-width: 0; }`.
- [x] 5.5 Responsive: `.table-container` ya tiene `overflow-x: auto`; verificado 320px / 1280px sin scroll de página.

## 6. Integración en app.js

- [x] 6.1 Agregar imports:
  ```js
  import { bindFormVenta } from './ventas.js';
  import { bindHistorial, renderHistorial } from './historial.js';
  ```
- [x] 6.2 En `DOMContentLoaded`, tras poblar selectores y antes de `mostrarVista('catalogo')`:
  ```js
  bindHistorial();
  bindFormVenta();
  renderHistorial();
  ```

## 7. Verificación y pruebas

- [x] 7.1 Levantar servidor estático: `python3 -m http.server 8080` y abrir `http://localhost:8080`.
- [x] 7.2 Casos de prueba (PDF + RN + HU):
  - [x] 7.2.1 Venta con 2 libros distintos → subtotales y total correctos.
  - [x] 7.2.2 Libro repetido → una sola fila, cantidad sumada.
  - [x] 7.2.3 Editar cantidad y quitar renglón → total recalculado.
  - [x] 7.2.4 Cantidad 0, -1, 2.9, 2e3, " 3 " → rechazo visible.
  - [x] 7.2.5 Confirmar sin cliente / sin renglones → botón deshabilitado; submit forzado muestra error.
  - [x] 7.2.6 Confirmar válida → mensaje éxito, formulario limpio, historial actualizado.
  - [x] 7.2.7 Cambiar precio catálogo → detalle conserva precio histórico.
  - [x] 7.2.8 Recargar → venta persiste en historial.
  - [x] 7.2.9 Consola sin errores.
  - [x] 7.2.10 320px / 1280px sin scroll horizontal de página.
  - [x] 7.2.11 Crear cliente con renglones cargados → selector repoblado y botón de confirmar deshabilitado.
  - [x] 7.2.12 Editar cantidad sin re-render del `tbody` → el click en "Quitar" no se pierde.
  - [x] 7.2.13 Fallo simulado de `localStorage` → la venta no persiste y se revierte.
  - [x] 7.2.14 Snapshot redondea precios a 2 decimales.

## 8. Validación OPSX y archive (pendiente .gitignore)

- [x] 8.1 `openspec validate C-05-venta-simulada-historial-snapshot --strict`
- [x] 8.2 `openspec status --change C-05-venta-simulada-historial-snapshot` → 4/4 artifacts complete.
- [x] 8.3 (Luego de corregir .gitignore) `opsx-archive` / `openspec change archive` y marcar `[x]` en CHANGES.md.