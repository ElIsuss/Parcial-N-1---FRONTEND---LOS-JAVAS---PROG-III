# Design: C-04 — altas-libros-clientes-listados

## Context

C-03 dejó la capa de datos lista: `Data` con getters, helpers exportados (`_isbnExists`, `_emailExists`, `_find*`), `guardarTodos()` persistente y `crearLibro`/`crearCliente` como stubs que retornan `{ok:false}`. `catalogo.js` ya exporta `renderCatalogo`, `poblarSelect*` y `poblarContenedorAutores`. El HTML (C-01) ya tiene `#form-libro`, `#form-cliente`, `#errores-libro`, `#errores-cliente`, `#tabla-libros`, `#tabla-clientes`, `.fila-vacia` y `#contenedor-autores`; el CSS (C-02) ya estiliza `.errores-formulario`, `.tabla-datos`, `.fila-vacia`. Ver proposal.md — Why.

## Goals / Non-Goals

**Goals:**
- Convertir los stubs `crearLibro`/`crearCliente` en mutaciones completas (validación + push + save)
- Comportamiento de alta y listado en módulos JS nuevos (`libros.js`, `clientes.js`)
- Coordinación post-alta: listados + catálogo + selectores de venta actualizados sin recarga

**Non-Goals:**
- Editar/eliminar registros (out of scope del proyecto, DEC-09)
- Alta de editoriales/géneros/autores (CRUD de apoyo no requerido)
- Persistencia diferida/completa y flag (ya en data.js; verificación en C-06)
- Ventas e historial (C-05)

## Decisions

1. **Validaciones centralizadas en `Data.crearLibro`/`Data.crearCliente`, no en los formularios.**
   El formulario solo serializa y llama a la mutación; la mutación retorna `{ok, errors[]}` (DEC-13).
   *Alternativa descartada*: validar en `libros.js` — duplicaría reglas si otra vista (o C-05) crea registros, y rompe el repository pattern (DEC-03).

2. **Validar todo y acumular errores, no fallar en la primera.**
   RN-LIB-09 pide lista de errores si hay varios: cada regla RN-LIB-01..06 se evalúa y empuja a `errors[]`; se retorna `ok:false` si `errors.length > 0`.
   *Alternativa descartada*: early-return por regla — oculta errores y obliga a varios envíos.

3. **Un solo hook `actualizarVistasAltas(tipo)` invocado tras `ok:true` desde el módulo del formulario.**
   Refresca: listado propio, `renderCatalogo(Data.getLibros())` (o filtrado actual si hay término), `poblarSelectLibro(#venta-libro)` y `poblarSelectCliente(#venta-cliente)`.
   *Alternativa descartada*: que `Data` emita eventos — `Data` es síncrono y sin dependencias del DOM (separación HTML/CSS/JS, RN-UX-05); el acoplamiento visual pertenece a la capa de presentación.

4. **`js/libros.js` y `js/clientes.js` como módulos espejo de `catalogo.js`.**
   Cada uno expone `bind*Form()` y `render*()`, importa `Data` y utils. Se registran desde `app.js` en `DOMContentLoaded`, igual que `bindBusqueda()`.
   *Alternativa descartada*: todo en `app.js` — crecería a un monolito y viola la organización por vista ya establecida.

5. **Renderizado de filas con `document.createElement` + `textContent` (DEC-11) y lookup de nombres por helper `_find*ById`.**
   ISBN en tabla se muestra tal cual como `textContent` (el normalizado solo se usa para comparar, RN-LIB-08). Precio con `formatPriceARS`.

6. **Reset del formulario con `form.reset()` + limpieza de `#errores-*` (`hidden = true`, `replaceChildren()` solo si el navegador lo soporta; si no, removeChild en loop) en `ok:true`. En `ok:false` no se resetea** (conserva lo escrito para corrección).

7. **Checkbox de autores: reutilizar `poblarContenedorAutores` de C-03.** No se duplica código; solo se verifica que esté poblado al iniciar. En `crearLibro`, `autorIds` se leen de los checkboxes `name="autorIds" :checked`.

## Risks / Trade-offs

- [Doble submit rápido crea duplicados de ISBN/email] → `_isbnExists`/`_emailExists` corren sobre `libros[]` en memoria actualizado sincrónicamente; el segundo submit falla por unicidad.
- [Catálogo con filtro activo: re-render muestra todos] → se re-renderiza con `filtrarLibros(input.value)` si `#input-busqueda` tiene término, para no perder el filtro del usuario.
- [IDs `generateId()` colisionan (mismo ms + random corto)] → probabilidad despreciable; se puede regenerar si `_find*ById` devuelve existente (check simple al crear).
- [Cambiar `data.js` rompe C-03] → las firmas de stubs se conservan exactas (`{ok, errors[], libro?/cliente?}`); los getters y `guardarTodos` no se tocan.
- [Fila vacía visible de más] → `render*` alterna `hidden` de `.fila-vacia` según `length` en cada render.

## Migration Plan

Sin migración de datos: cambios solo en JS (módulos ES6 cargados por `app.js`). Rollback = revert de los commits del change; el HTML/CSS no cambia.

## Open Questions

Ninguna que afecte specs, enfoque o desglose de tareas.
