## Why

El ejercicio 5 del parcial (Venta simulada e historial, 20 pts) requiere implementar la composición de ventas con renglones, confirmación con snapshot de precios, y consulta de historial con detalle inmutable. Actualmente en `rama-juan` solo existe el markup estático en `index.html` (vistas Ventas e Historial) y el stub `Data.crearVenta()` en `data.js`. No hay lógica de negocio, renderizado dinámico, validaciones ni persistencia de ventas. Este change cubre esa funcionalidad completa según las reglas RN-VTA-01..13 y RN-HIS-01..04.

## What Changes

- **New Capability**: `venta-historial` — composición, confirmación y consulta de ventas con snapshot de precios.
- **New files**: `js/ventas.js`, `js/historial.js`, `css/ventas.css`.
- **Modified files**: `js/data.js` (implementar `crearVenta`), `js/app.js` (importar e inicializar ventas/historial), `js/clientes.js` (sincronizar botón de venta al crear cliente), `index.html` (input cantidad de texto numérico, `#resultado-venta`, link CSS).
- **No BREAKING changes** — solo añade funcionalidad nueva; no modifica APIs existentes de libros/clientes.

## Capabilities

### New Capabilities
- `venta-historial`: cubre HU-12, HU-13, HU-14, HU-15 — venta simulada (composer renglones, validaciones, snapshot, total) + historial (listado + detalle con precios históricos inmutables).

### Modified Capabilities
- (ninguna — las capacidades existentes catálogo, libros, clientes no cambian sus requisitos)

## Impact

**Código afectado**:
- `js/data.js`: implementar `crearVenta()` con validaciones RN-VTA-01..10, snapshot (precio redondeado a 2 decimales, título, ISBN), persistencia vía `guardarTodos()` con reversión si falla.
- `js/app.js`: importar `bindFormVenta`, `bindHistorial` y `renderHistorial`, llamarlos en `DOMContentLoaded`.
- `js/clientes.js`: disparar `change` en `#venta-cliente` tras repoblar el select en el alta de cliente.
- `index.html`: remover `style="width: 80px"` en `#venta-cantidad` y usar `type="text" inputmode="numeric" pattern="[0-9]*"`, agregar `<div id="resultado-venta" role="status" aria-live="polite" hidden></div>` después de `#errores-venta`, agregar `<link rel="stylesheet" href="css/ventas.css">` y favicon `data:,`.
- **Nuevos**: `js/ventas.js` (estado del composer, agregar/editar/quitar renglones, validación estricta cantidad, totales, confirmación, limpieza, mensaje resultado), `js/historial.js` (render tabla historial, estado vacío, `bindHistorial`, modal detalle con snapshot), `css/ventas.css` (solo `.cantidad-input`, `.btn-quitar`, `.mensaje-resultado` y `min-width: 0` de fieldset).

**Dependencias**: Requiere C-04 completado (selectores `#venta-cliente` y `#venta-libro` poblados, `Data.getClientes()`, `Data.getLibros()`, `Data.crearVenta` stub, `guardarTodos()` funcional, `formatPriceARS`, `generateId` en utils).

**Sistemas**: localStorage (clave `libreria_ventas`), navegador (ES Modules, `file://` requiere servidor estático para CORS).