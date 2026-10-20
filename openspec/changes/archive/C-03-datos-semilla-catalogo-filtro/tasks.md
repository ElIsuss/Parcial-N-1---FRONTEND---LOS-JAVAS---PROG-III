# Tasks: C-03-datos-semilla-catalogo-filtro

> Retroactivo — todas las tasks fueron implementadas en `efe0980 feat(c-03): implementar catalogo y filtro`. Checkboxes marcados `[x]` para reflejar el estado real.

## 1. Capa de datos (`js/data.js`)

- [x] 1.1 Estado privado `_state` + `SEED` completa (2 editoriales, 2 géneros, 3 autores, 6 libros, 3 clientes) con IDs estables — Verificar: commit contiene el SEED y arrays
- [x] 1.2 Helpers `_deepClone`, `_findById`, `_find*ById`, `_isbnExists`, `_emailExists` — Verificar: exportados en `Data`
- [x] 1.3 `inicializar()` con flag `libreria_inicializado`, carga/recuperación y fallback a semilla (sync, sin throw) — Verificar: recarga sin duplicar semilla
- [x] 1.4 `cargarSemilla()`, `guardarTodos()` (claves `libreria_libros/clientes/ventas/editoriales/generos/autores`) — Verificar: localStorage poblado tras primer inicio
- [x] 1.5 Getters read-only (copias shallow) y stubs `{ok:false}` de `crearLibro`/`crearCliente`/`crearVenta` — Verificar: firmas listas para C-04/C-05

## 2. Utilidades (`js/utils.js`)

- [x] 2.1 `normalizeISBN` (sin espacios/guiones, uppercase) — Verificar: `normalizeISBN('978-987-1234-56-7') === '9789871234567'`
- [x] 2.2 `formatPriceARS` (Intl es-AR, 2 decimales) — Verificar: salida `$ 1.500,00`
- [x] 2.3 `isValidEmail`, `generateId`, `debounce` — Verificar: exports presentes

## 3. Catálogo y filtro (`js/catalogo.js`)

- [x] 3.1 `renderCatalogo()`: tarjetas `<article>` con textContent only, lookups de editorial/género ("Sin clasificar")/autores, precio ARS, mensaje vacío — Verificar: 6 tarjetas semilla en `#contenedor-catalogo`
- [x] 3.2 `filtrarLibros()`: trim+lowercase+substring, vacío → todo — Verificar: "borges" → Ficciones; basura → 0 + mensaje
- [x] 3.3 `bindBusqueda()`: submit preventDefault, input inmediato, botón limpiar — Verificar: sin recarga, UX fluida
- [x] 3.4 `poblarSelectEditorial/Genero/Cliente/Libro` + `poblarContenedorAutores` (checkboxes) — Verificar: selects de Libros/Ventas poblados

## 4. Navegación y bootstrap

- [x] 4.1 `js/nav.js` — `mostrarVista()` con toggle `.activa` y `aria-current` — Verificar: nav cambia de vista sin recarga
- [x] 4.2 `js/app.js` — `DOMContentLoaded` → inicializar → poblar → bindBusqueda → renderCatalogo → mostrarVista('catalogo') — Verificar: consola limpia, vista catálogo activa

## 5. Documentación y cierre

- [x] 5.1 Spec `data-catalogo-filtro` escrito en `openspec/specs/` — Verificar: archivo de 311 líneas en commit
- [x] 5.2 `CHANGES.md` — C-03 marcado `[x]` — Verificar: línea de estado

## Verificación final realizada (efe0980)

- [x] 6.1 Catálogo renderiza 6 libros con lookups correctos y "Sin clasificar" en `lib6`
- [x] 6.2 Filtro: vacío → 6; "borges" → Ficciones; inexistente → mensaje
- [x] 6.3 Selects y checkboxes poblados; recarga no duplica datos (flag)
- [x] 6.4 Sin `innerHTML`, vanilla only, consola sin errores (file://)
