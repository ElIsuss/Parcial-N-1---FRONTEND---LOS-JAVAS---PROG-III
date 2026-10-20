# Tasks: C-01-estructura-base-navegacion

## Resumen
Crear `index.html` completo como entry point SPA con 5 vistas semánticas, navegación accesible, y hooks para changes posteriores (C-02 a C-06).

---

## Task 1: Crear estructura base HTML
**ID**: C-01-T1
**Descripción**: Escribir `index.html` con DOCTYPE, head, meta tags, title, 5 CSS links, script module
**Archivos**: `index.html` (líneas 1-18)
**Criterios de aceptación**:
- `<!DOCTYPE html>`, `<html lang="es">`
- `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<title>Librería — Parcial 1 Programación III</title>`
- 5 `<link rel="stylesheet" href="css/{base,layout,catalogo,formularios,tablas}.css">`
- `<script type="module" src="js/app.js"></script>` al final de `<body>`
- Sin estilos/JS inline

---

## Task 2: Header + Navegación principal
**ID**: C-01-T2
**Descripción**: Implementar `<header class="site-header">` con título y `<nav aria-label="Navegación principal">` con 5 nav-links
**Archivos**: `index.html` (líneas 21-30)
**Criterios de aceptación**:
- `<h1>Librería <span class="subtitle">Parcial 1 — Programación III</span></h1>`
- `<nav class="site-nav" aria-label="Navegación principal">` con `<ul class="nav-list">`
- 5 `<li><a class="nav-link" data-vista="{vista}" href="#vista-{vista}">`:
  - `data-vista="catalogo"` + `aria-current="page"` (activo por defecto)
  - `data-vista="libros"`
  - `data-vista="clientes"`
  - `data-vista="ventas"`
  - `data-vista="historial"`
- Semántica: `header`, `nav`, `ul`, `li`, `a`

---

## Task 3: Main + 5 Vistas SPA
**ID**: C-01-T3
**Descripción**: Crear `<main class="site-main">` con 5 `<section class="vista" id="vista-*">`, primera con `.activa`
**Archivos**: `index.html` (líneas 33-280)
**Criterios de aceptación**:
- `<main class="site-main">` contenedor
- 5 sections con `class="vista"` + `id="vista-{catalogo,libros,clientes,ventas,historial}"`
- Solo `#vista-catalogo` tiene clase adicional `.activa`
- Cada section tiene `aria-labelledby="titulo-{vista}"` y `<header class="vista-header"><h2 id="titulo-{vista}">`

---

## Task 4: Vista Catálogo - Toolbar búsqueda + contenedor grid
**ID**: C-01-T4
**Descripción**: Implementar vista catálogo con formulario búsqueda y contenedor para render dinámico
**Archivos**: `index.html` (líneas 33-55)
**Criterios de aceptación**:
- `<form id="form-busqueda" class="form-busqueda" role="search">`
  - `<label for="input-busqueda" class="visually-hidden">Buscar por título</label>`
  - `<input type="search" id="input-busqueda" name="q" placeholder="Buscar libro por título…" autocomplete="off">`
  - `<button type="submit" class="btn btn-buscar">Buscar</button>`
  - `<button type="button" id="btn-limpiar-busqueda" class="btn btn-limpiar" hidden>Limpiar</button>`
- `<div id="contenedor-catalogo" class="catalogo-grid" role="list" aria-label="Listado de libros">` (vacío)
- `<p id="mensaje-catalogo-vacio" class="mensaje-vacio" hidden>No se encontraron libros.</p>`

---

## Task 5: Vista Libros - Formulario alta + tabla listado
**ID**: C-01-T5
**Descripción**: Formulario completo para alta de libro (7 campos) y tabla listado 7 columnas
**Archivos**: `index.html` (líneas 57-123)
**Criterios de aceptación**:
- **Formulario** `#form-libro.form-alta` (`novalidate`, `aria-label="Alta de libro"`):
  - `<fieldset class="form-group"><legend>Nuevo Libro</legend>`
  - Campos (cada uno en `.form-row` con `<label for>`):
    - Título: `#libro-titulo` (text, required)
    - ISBN: `#libro-isbn` (text, required, placeholder "978-987-1234-56-7")
    - Precio: `#libro-precio` (number, required, min="0.01", step="0.01", placeholder "1500.00")
    - Editorial: `#libro-editorial` (select, required, option placeholder "Seleccionar editorial…")
    - Género: `#libro-genero` (select, option "Sin clasificar" value="")
    - Autores: `#contenedor-autores.multi-select` (role="group", aria-label="Seleccionar autores", checkboxes generados por JS)
  - `<div class="form-actions">`: `<button type="submit" class="btn btn-primario">Guardar Libro</button>` + `<button type="reset" class="btn btn-secundario">Limpiar</button>`
  - `</fieldset>`
  - `<div id="errores-libro" class="errores-formulario" aria-live="polite" hidden></div>`
- **Tabla listado** dentro de `<div class="table-container">`:
  - `<table id="tabla-libros" class="tabla-datos" aria-describedby="desc-tabla-libros">`
  - `<caption id="desc-tabla-libros">Libros registrados</caption>`
  - `<thead>`: 7 `<th scope="col">` (ID, Título, ISBN, Editorial, Género, Autores, Precio)
  - `<tbody>`: `<tr class="fila-vacia" hidden><td colspan="7">No hay libros registrados.</td></tr>`

---

## Task 6: Vista Clientes - Formulario alta + tabla listado
**ID**: C-01-T6
**Descripción**: Formulario alta cliente (2 campos) y tabla listado 3 columnas
**Archivos**: `index.html` (líneas 125-165)
**Criterios de aceptación**:
- **Formulario** `#form-cliente.form-alta` (`novalidate`, `aria-label="Alta de cliente"`):
  - `<fieldset class="form-group"><legend>Nuevo Cliente</legend>`
  - Nombre: `#cliente-nombre` (text, required, autocomplete="name")
  - Email: `#cliente-email` (email, required, autocomplete="email", placeholder "usuario@ejemplo.com")
  - `<div class="form-actions">`: botones Guardar/Limpiar
  - `<div id="errores-cliente" class="errores-formulario" aria-live="polite" hidden></div>`
- **Tabla listado** `.table-container` > `#tabla-clientes.tabla-datos`:
  - 3 columnas: ID, Nombre completo, Email
  - Fila vacía oculta

---

## Task 7: Vista Ventas - Selector cliente + composer renglones + resumen
**ID**: C-01-T7
**Descripción**: Formulario completo de composición de venta con todos los sub-componentes
**Archivos**: `index.html` (líneas 167-235)
**Criterios de aceptación**:
- **Selector cliente**: `<fieldset class="form-group venta-cliente">` con `#venta-cliente` (select required, option placeholder)
- **Composer renglones**: `<fieldset class="form-group venta-renglones">`
  - `#contenedor-renglones.renglones-lista` (vacío, render dinámico)
  - `.form-row`: `#venta-libro` (select required), `#venta-cantidad` (number required min=1 value=1 width 80px), `#btn-agregar-renglon.btn.btn-primario`
- **Resumen**: `<fieldset class="form-group venta-resumen">`
  - `.table-container` > `#tabla-renglones.tabla-datos` (5 cols: Libro, Cant., Precio unit., Subtotal, Acciones + fila vacía)
  - `.venta-totales` > `.total-linea` > `<span>Total:</span> <strong id="venta-total">$ 0,00</strong>`
- **Acciones form**: `.form-actions` con `#btn-confirmar-venta.btn.btn-primario` (disabled) + reset
- **Errores**: `#errores-venta.errores-formulario` (`aria-live="polite"` hidden)

---

## Task 8: Vista Historial - Tabla + Modal detalle nativo
**ID**: C-01-T8
**Descripción**: Tabla historial con botón "Ver detalle" y `<dialog>` nativo para detalle de renglones
**Archivos**: `index.html` (líneas 237-280)
**Criterios de aceptación**:
- **Tabla historial**: `.table-container` > `#tabla-historial.tabla-datos` (5 cols: ID, Fecha, Cliente, Total, Acciones + fila vacía)
- **Modal detalle**: `<dialog id="modal-detalle" class="modal-detalle" aria-labelledby="titulo-modal-detalle" aria-modal="true">`
  - `<header class="modal-header">`: `<h3 id="titulo-modal-detalle">Detalle de Venta</h3>` + `<button class="btn-cerrar-modal" aria-label="Cerrar detalle">&times;</button>`
  - `<div class="modal-body">`:
    - `<dl id="detalle-meta" class="detalle-meta">`: dt/dd para ID (`#detalle-id`), Fecha (`#detalle-fecha`), Cliente (`#detalle-cliente`), Total (`#detalle-total`)
    - `.table-container` > `#tabla-detalle-renglones.tabla-datos` (5 cols: Libro, ISBN, Cantidad, Precio unit. (snapshot), Subtotal) con `<tbody id="tbody-detalle-renglones">`
  - `<footer class="modal-footer">`: `<button class="btn btn-secundario btn-cerrar-modal">Cerrar</button>`

---

## Task 9: Footer + Validación final
**ID**: C-01-T9
**Descripción**: Footer semántico y validación completa en navegador
**Archivos**: `index.html` (líneas 282-285)
**Criterios de aceptación**:
- `<footer class="site-footer" role="contentinfo"><p>Trabajo Práctico — Programación III — UNT/UTN</p></footer>`
- Validar en navegador (file:// o npx serve):
  - [ ] Carga sin errores de consola
  - [ ] Header + Nav + Catálogo activo + Footer visibles
  - [ ] 5 nav-links funcionales (click no recarga — toggle `.activa` pendiente C-02)
  - [ ] HTML semántico válido (W3C validator o DevTools)
  - [ ] Accesibilidad: Tab navigation, foco visible, ARIA correcto
  - [ ] 5 CSS links + 1 script module paths correctos
  - [ ] Sin estilos/JS inline

---

## Task 10: Actualizar CHANGES.md
**ID**: C-01-T10
**Descripción**: Marcar C-01 como completado `[x]` en CHANGES.md
**Archivos**: `CHANGES.md`
**Criterios de aceptación**:
- Línea `- **Estado**: `[x]` completado` en sección C-01

---

## Task 11: Crear archive OpenSpec
**ID**: C-01-T11
**Descripción**: Generar `openspec/changes/archive/C-01-estructura-base-navegacion.md` con registro completo
**Archivos**: `openspec/changes/archive/C-01-estructura-base-navegacion.md`
**Criterios de aceptación**:
- Metadata (ID, nombre, fase, estado, fecha, governance, dependencias)
- Scope original vs implementación real
- Archivos creados/modificados
- Validaciones realizadas (15 checks)
- Decisiones tomadas (5)
- Reglas duras aplicadas (6)
- Referencias "Leer antes" para C-02
- Archivos del proyecto afectados

---

## Task 12: Generar propose retroactivo
**ID**: C-01-T12
**Descripción**: Crear `proposal.md`, `design.md`, `tasks.md` en `openspec/changes/proposed/C-01-estructura-base-navegacion/`
**Archivos**: 3 archivos en proposed/
**Criterios de aceptación**:
- proposal.md: scope, acceptance criteria, leer antes, reglas duras
- design.md: decisiones arquitectura, hooks por vista, interfaz changes posteriores
- tasks.md: esta lista de 12 tasks

---

## Orden de Ejecución Sugerido

```
C-01-T1 → C-01-T2 → C-01-T3 → C-01-T4 → C-01-T5 → C-01-T6 → C-01-T7 → C-01-T8 → C-01-T9 → C-01-T10 → C-01-T11 → C-01-T12
```

## Dependencias entre Tasks
- T1: base (ninguna)
- T2, T3: dependen de T1
- T4-T8: dependen de T3 (main + vistas)
- T9: depende de T1-T8 (validación final)
- T10: depende de T9
- T11: depende de T10
- T12: independiente (documentación retroactiva)

## Estimación Total
- **T1-T9** (implementación + validación): ~3.5 horas
- **T10-T11** (admin OpenSpec): ~0.5 horas
- **T12** (propose retroactivo): ~0.5 horas
- **Total**: ~4.5 horas

---

## Notas de Implementación Real

### Lo que se hizo en la implementación real (orden aproximado):
1. Escribir `index.html` completo (T1-T9 en una sola pasada)
2. Abrir en navegador → validar visual/consola/accesibilidad (T9)
3. Actualizar `CHANGES.md` `[x]` (T10)
4. Crear archive OpenSpec (T11)
5. Generar propose retroactivo (T12) ← **ESTE ARCHIVO**

### Validaciones realizadas (T9):
- ✅ file:// abre sin errores
- ✅ 5 vistas navegan (click en nav, toggle manual de `.activa` en DevTools)
- ✅ HTML semántico válido
- ✅ Accesibilidad: Tab order lógico, foco visible, ARIA labels, live regions
- ✅ 5 CSS + 1 JS module paths correctos
- ✅ Vanilla only confirmado

### Decisiones documentadas en design.md:
1. SPA sections (DEC-01)
2. ES Modules (DEC-02)
3. Checkboxes autores (DEC-08)
4. Selectores vacíos + JS poblado (C-03/04)
5. `<dialog>` nativo modal

---

## Próximo Change (C-02)

Al completar C-01, quedan listos los hooks para:
- `js/navegacion.js` → `mostrarVista(vistaId)` toggle `.activa` + `aria-current`
- `js/app.js` → bootstrap `DOMContentLoaded` → `inicializar()` → `mostrarVista('catalogo')`
- 5 archivos CSS con variables, layout, componentes, tablas, formularios