# Proposal: C-04 — altas-libros-clientes-listados

## Why

El catálogo y los listados solo muestran datos semilla: no se puede incorporar ni un libro ni un cliente nuevo. Las mutaciones `Data.crearLibro()` / `Data.crearCliente()` quedaron como stubs en C-03 y los formularios de alta (`#form-libro`, `#form-cliente`) existen en HTML sin comportamiento. Este change desbloquea la Épica 4 (HU-09, HU-10, HU-11 — 15 pts) y es prerequisite del gate 4 para C-05 (ventas).

## What Changes

- `js/data.js`: implementa las mutaciones stub `Data.crearLibro(libro)` y `Data.crearCliente(cliente)` — validaciones sincrónicas RN-LIB-01..06 y RN-CLI-01..03 retornando `{ok, errors[]}` (DEC-13), IDs con `generateId()` (DEC-08), push + `guardarTodos()`.
- `js/libros.js` (nuevo): `bindFormLibro()` (preventDefault, valida, muestra errores en `#errores-libro`, limpia formulario) y `renderListadoLibros()` (filas en `#tabla-libros`, 7 columnas, fila vacía `.fila-vacia`).
- `js/clientes.js` (nuevo): `bindFormCliente()` (errores en `#errores-cliente`) y `renderListadoClientes()` (3 columnas).
- Checkboxes de autores en `#contenedor-autores` se generan dinámicamente desde `autores[]` (RN-LIB-07, ya preparado por `poblarContenedorAutores`).
- Tras alta exitosa: re-render del listado + re-poblar selectores de venta (`#venta-cliente`, `#venta-libro`) y del catálogo, sin recargar la página (RN-LIB-10, RN-CLI-05).
- `js/app.js`: wiring de los nuevos binds en `inicializar()`.
- Sin cambios de requerimiento en specs existentes: `data-catalogo-filtro` ya declara `crearLibro`/`crearCliente` como mutaciones de C-04; este change las cumple, no las redefine.

## Capabilities

### New Capabilities
- `altas-libros-clientes-listados`: alta de libros y clientes con validaciones (RN-LIB-01..06, RN-CLI-01..03), feedback de errores cerca del formulario (RN-LIB-09, DEC-14), listados tabulares conectados a `libros[]`/`clientes[]` con mensajes de vacío (HU-11) y actualización reactiva de listados/selectores/catálogo tras alta (RN-LIB-10).

### Modified Capabilities
<!-- ninguna: los requerimientos de data-catalogo-filtro no cambian -->

## Impact

- **Archivos nuevos**: `js/libros.js`, `js/clientes.js`
- **Archivos modificados**: `js/data.js` (stub → implementación), `js/app.js` (bindings)
- **HTML/CSS**: sin cambios — hooks ya existen en `index.html` (C-01) y clases en `css/` (C-02)
- **Datos**: `libreria_libros` / `libreria_clientes` en localStorage pasan a recibir altas (persistencia completa verify en C-06)
- **Depende de**: C-03 (getters, utils, poblar selects, renderCatalogo)
- **Desbloquea**: C-05 (ventas necesita clientes/libros dados de alta)
