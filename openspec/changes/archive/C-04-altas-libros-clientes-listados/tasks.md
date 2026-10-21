# Tareas: C-04 — altas-libros-clientes-listados

> Sin framework de tests (vanilla, RN-TEC-01): la verificación es por consola del navegador (`file://`) y observación en la UI. Reglas duras aplicables en cada task: DEC-11 (nunca `innerHTML`), DEC-13 (sync `{ok, errors[]}`), DEC-08 (IDs estables), RN-TEC-01 (vanilla only).

## 1. Mutaciones en `js/data.js`

- [x] 1.1 Implementar `Data.crearLibro(libro)`: acumula errores RN-LIB-01..06 (título trim, ISBN requerido + `_isbnExists(normalizeISBN(isbn))`, precio `Number>0`, editorialId ∈ `editoriales[]`, generoId vacío→`null` o ∈ `generos[]`, ≥1 autorId ∈ `autores[]`), retorna `{ok, errors[]}` sin mutar si hay errores — Verificar: llamadas desde la consola con casos válidos e inválidos retornan el objeto esperado
- [x] 1.2 En `crearLibro` con `ok`: asignar `id: generateId()` (importado de `utils.js`, con re-generación si colisiona), `autorIds` normalizados a array, `precio: Number(precio)`, push a `libros[]`, `guardarTodos()` y retornar `{ok:true, errors:[], libro}` — Verificar: en consola, `Data.getLibros()` crece y `localStorage.libreria_libros` contiene el nuevo libro
- [x] 1.3 Implementar `Data.crearCliente(cliente)`: errores RN-CLI-01..03 (nombre trim, `isValidEmail`, `_emailExists(email.trim().toLowerCase())`), mismo contrato `{ok, errors[]}`; con `ok`: `id: generateId()`, email guardado con trim, push + `guardarTodos()` — Verificar: en consola, un email duplicado en otra capitalización (ej. `JUAN@EMAIL.com`) da `ok:false` y el array no crece
- [x] 1.4 Confirmar que no se alteraron firmas/getters existentes y que los stubs de `crearVenta` siguen intactos — Verificar: `Data.getVentas()`, `Data.inicializar()` siguen funcionando y `crearVenta` sigue retornando 'No implementado (C-05)'

## 2. Módulo `js/libros.js`

- [x] 2.1 Crear `js/libros.js` con `renderListadoLibros()`: limpia `tbody` de `#tabla-libros` (removeChild en loop), crea filas con `createElement`/`textContent` (ID, título, ISBN, editorial y género por `_find*ById` con fallback "—" / "Sin clasificar", autores unidos ", ", `formatPriceARS`), alterna `.fila-vacia` según `libros.length` — Verificar: abrir la vista Libros muestra 6 filas semilla y la fila vacía oculta
- [x] 2.2 Implementar `bindFormLibro()`: `submit` → `preventDefault` → serializa campos (checkboxes `autorIds` checked) → `Data.crearLibro` → si `ok:false` pinta lista en `#errores-libro` (textContent, quita `hidden`); si `ok:true` oculta errores, `form.reset()`, `renderListadoLibros()` — Verificar: en el navegador, envío inválido muestra errores cerca del formulario sin recargar; envío válido limpia formulario y agrega fila
- [x] 2.3 En éxito del alta de libro, refrescar dependencias: `renderCatalogo(filtrarLibros(input-búsqueda))` y `poblarSelectLibro(#venta-libro)` — Verificar: libro nuevo aparece en el grid del catálogo y en el select de la vista Ventas sin recargar (RN-LIB-10)

## 3. Módulo `js/clientes.js`

- [x] 3.1 Crear `js/clientes.js` con `renderListadoClientes()`: filas ID/nombre/email con `textContent`, alterna `.fila-vacia` — Verificar: vista Clientes muestra 3 filas semilla
- [x] 3.2 Implementar `bindFormCliente()`: `preventDefault` → `Data.crearCliente` → errores en `#errores-cliente` (visibles, `aria-live`) o éxito con ocultar errores + `form.reset()` + `renderListadoClientes()` — Verificar: email inválido y duplicado (ej. `JUAN@EMAIL.COM ` vs `juan@email.com`) muestran error y no agregan fila; caso válido agrega fila
- [x] 3.3 En éxito del alta de cliente, refrescar `poblarSelectCliente(#venta-cliente)` — Verificar: cliente nuevo aparece en el selector de cliente de la vista Ventas sin recargar (RN-CLI-05)

## 4. Wiring en `js/app.js`

- [x] 4.1 Importar `bindFormLibro`/`renderListadoLibros` y `bindFormCliente`/`renderListadoClientes`, invocarlos en `DOMContentLoaded` junto a los binds existentes (tras `Data.inicializar()` y el poblar inicial de selects) — Verificar: consola del navegador sin errores de import/módulo y ambos formularios reaccionan al submit
- [x] 4.2 Verificar que `poblarContenedorAutores(#contenedor-autores)` sigue poblado al iniciar (RN-LIB-07) — Verificar: los 3 checkboxes de autores semilla visibles en la vista Libros

## 5. Verificación integral manual (Flujos 2 y 3)

- [x] 5.1 Caso HU-09 completo: alta de libro válido → fila en `#tabla-libros`, tarjeta en catálogo, opción en `#venta-libro`, formulario limpio, cero errores visibles — Verificar en navegador sin recargar
- [x] 5.2 Casos de rechazo HU-09: título vacío, ISBN duplicado normalizado (`9789871234567` vs `978-987-1234-56-7`), precio 0, sin editorial, sin autores → cada uno lista su error en `#errores-libro` y no muta datos — Verificar: `Data.getLibros().length` sin cambio
- [x] 5.3 Casos HU-10 completo: alta válida (fila + selector venta), email inválido, email duplicado case-insensitive → errores en `#errores-cliente`, sin mutación
- [x] 5.4 Caso HU-11 + persistencia: recargar la página tras altas → registros presentes una sola vez (sin duplicar semilla), listados y selectores correctos; títulos con texto tipo HTML se pintan como texto literal — Verificar: consola sin errores, sin elementos `img` creados en la tabla
