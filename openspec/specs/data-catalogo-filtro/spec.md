# data-catalogo-filtro Specification

## Purpose

Define la capa de datos en memoria (repository con semilla y persistencia en localStorage), las utilidades compartidas y el comportamiento del catálogo: renderizado de libros, filtro por título y poblado de selectores desde los datos locales.

## Requirements

### Requirement: Inicialización de la capa de datos
El sistema SHALL exponer un repository `Data` que inicializa su estado en memoria con la semilla la primera vez y recupera de localStorage en inicios posteriores, sin duplicar datos. La inicialización SHALL ser sincrónica (sin Promises ni `throw`).
RN-PER-02, RN-PER-03, DEC-03, DEC-12.

#### Scenario: Primer inicio carga la semilla
- **WHEN** no existe el flag `libreria_inicializado` en localStorage
- **THEN** se cargan los arrays semilla (`editoriales`, `generos`, `autores`, `libros`, `clientes`, `ventas`), se persisten con `guardarTodos()` y se setea el flag `libreria_inicializado`

#### Scenario: Inicio posterior recupera de localStorage
- **WHEN** el flag `libreria_inicializado` ya existe
- **THEN** se leen las claves `libreria_libros`, `libreria_clientes`, `libreria_ventas` (y opcionales `libreria_editoriales/generos/autores`) y se pueblan los arrays internos sin volver a cargar la semilla

#### Scenario: localStorage corrupto o vacío usa semilla
- **WHEN** el parseo de localStorage falla o devuelve arrays vacíos
- **THEN** se registra una advertencia por consola y se cae al fallback de semilla sin lanzar excepción

### Requirement: Datos semilla con IDs estables
El sistema SHALL proveer datos semilla mínimos (2 editoriales, 2 géneros, 3 autores, 6 libros, 3 clientes, 0 ventas) con IDs pregenerados y estables (no derivados de índices ni de `Date.now()`).
SUP-08.

#### Scenario: Semilla disponible tras inicializar
- **WHEN** `Data.inicializar()` corre en un entorno limpio
- **THEN** `Data.getLibros()` retorna 6 libros, `Data.getClientes()` 3, `Data.getEditoriales()` 2, `Data.getGeneros()` 2 y `Data.getAutores()` 3

#### Scenario: IDs de semilla estables entre sesiones
- **WHEN** se recarga la página
- **THEN** los IDs de los registros semilla (p. ej. `lib1`, `ed1`, `aut1`) no cambian

### Requirement: Persistencia de los arrays en localStorage
El sistema SHALL persistir el estado con `guardarTodos()` bajo claves versionadas y tolerar fallos de escritura sin interrumpir la aplicación.
RN-PER-01, RN-PER-04.

#### Scenario: Guardado de claves mínimas
- **WHEN** se invoca `Data.guardarTodos()`
- **THEN** se escriben `libreria_libros`, `libreria_clientes` y `libreria_ventas` (y las claves opcionales de apoyo)

#### Scenario: Error de escritura no aborta
- **WHEN** `localStorage.setItem` falla (p. ej. cuota excedida)
- **THEN** el error se registra por consola y la ejecución continúa (sin excepción propagada)

### Requirement: Getters de solo lectura
El sistema SHALL exponer getters `getLibros`, `getEditoriales`, `getGeneros`, `getAutores`, `getClientes` y `getVentas` que retornan copias de los arrays internos, de modo que el consumidor no pueda mutar el estado del repository.

#### Scenario: El getter retorna una copia
- **WHEN** un consumidor obtiene un array vía getter y lo modifica
- **THEN** el array interno del repository permanece sin cambios

### Requirement: Contrato de mutaciones sincrónicas
El sistema SHALL exponer `crearLibro`, `crearCliente` y `crearVenta` con el contrato `{ok, errors[], <entidad>?}` y validación sincrónica, sin lanzar excepciones ni usar callbacks.
DEC-13.

#### Scenario: Resultado con errores
- **WHEN** se invoca una mutación con datos inválidos
- **THEN** retorna `{ok: false, errors: [...]}` y NO muta el estado

#### Scenario: Resultado exitoso
- **WHEN** se invoca una mutación con datos válidos
- **THEN** retorna `{ok: true, errors: [], <entidad>}` con el registro creado

### Requirement: Utilidades compartidas
El sistema SHALL ofrecer utilidades reutilizables: `normalizeISBN` (quita espacios y guiones, mayúsculas), `formatPriceARS` (moneda ARS con 2 decimales), `isValidEmail` (regex básica con trim), `generateId` (ID estable tipo `Date.now().toString(36)` + random) y `debounce`.
RN-LIB-08, DEC-05, DEC-06, DEC-08, SUP-06, SUP-08.

#### Scenario: Normalización de ISBN
- **WHEN** se llama `normalizeISBN('978-987-1234-56-7')`
- **THEN** retorna `'9789871234567'`

#### Scenario: Formato de precio
- **WHEN** se llama `formatPriceARS(1500)`
- **THEN** retorna un string en es-AR con 2 decimales (p. ej. `$ 1.500,00`)

#### Scenario: Validación de email
- **WHEN** se llama `isValidEmail` con un valor sin `@` o sin dominio
- **THEN** retorna `false`; con un formato básico válido retorna `true`

### Requirement: Renderizado del catálogo
El sistema SHALL renderizar el listado de libros en `#contenedor-catalogo` como tarjetas, resolviendo los nombres de editorial, género y autores desde los datos locales, mostrando "Sin clasificar" cuando el género es `null` y formateando el precio en ARS. Si no hay resultados, SHALL mostrar el mensaje `#mensaje-catalogo-vacio`.
RN-CAT-04, RN-CAT-05, RN-LIB-07, RN-UX-02.

#### Scenario: Catálogo con libros
- **WHEN** `renderCatalogo` recibe ≥1 libro
- **THEN** el contenedor es visible y muestra una tarjeta por libro con título, metadatos (ISBN, editorial, género, autores) y precio

#### Scenario: Libro sin género
- **WHEN** un libro tiene `generoId: null`
- **THEN** la tarjeta muestra "Sin clasificar" en el género

#### Scenario: Catálogo vacío
- **WHEN** `renderCatalogo` recibe un array vacío
- **THEN** el grid se oculta y se muestra el mensaje de vacío

### Requirement: Filtro de catálogo por título
El sistema SHALL filtrar los libros por coincidencia parcial en el título, insensible a mayúsculas y con `trim`. Un término vacío SHALL retornar el catálogo completo; sin coincidencias SHALL mostrar el mensaje de vacío.
RN-CAT-01, RN-CAT-02, RN-CAT-03.

#### Scenario: Búsqueda con coincidencia
- **WHEN** se filtra por "borges" (o "Borges"/" BORGES ")
- **THEN** el resultado incluye los libros cuyo título contiene el término

#### Scenario: Búsqueda vacía
- **WHEN** el término es vacío o solo espacios
- **THEN** se retornan todos los libros

#### Scenario: Búsqueda sin resultados
- **WHEN** ningún título contiene el término
- **THEN** el resultado es vacío y se muestra el mensaje de "sin resultados"

### Requirement: Interacción de búsqueda
El sistema SHALL vincular el formulario y el input de búsqueda: el `submit` SHALL hacer `preventDefault` y filtrar; el evento `input` SHALL filtrar de inmediato y mostrar/ocultar el botón limpiar; el botón limpiar SHALL vaciar el input y restaurar el catálogo completo.
RN-UX-01, RN-UX-02.

#### Scenario: Submit sin recarga
- **WHEN** el usuario envía el formulario de búsqueda
- **THEN** la página no se recarga y el catálogo se re-renderiza con el filtro aplicado

#### Scenario: Botón limpiar
- **WHEN** el usuario hace clic en "Limpiar"
- **THEN** el input queda vacío, se muestra el catálogo completo y el botón se oculta

### Requirement: Poblado de selectores y checkboxes
El sistema SHALL poblar dinámicamente desde los datos locales: los selects de editorial y género (con opción "Sin clasificar" en género), el contenedor de autores como checkboxes (uno por autor) y los selects de cliente y libro para la vista de ventas.
RN-LIB-07, DEC-08.

#### Scenario: Select de editorial poblado
- **WHEN** se ejecuta `poblarSelectEditorial`
- **THEN** el select contiene una opción por cada editorial más su placeholder

#### Scenario: Contenedor de autores con checkboxes
- **WHEN** se ejecuta `poblarContenedorAutores`
- **THEN** se genera un checkbox `name="autorIds"` por cada autor de `autores[]`

#### Scenario: Select de cliente poblado
- **WHEN** se ejecuta `poblarSelectCliente`
- **THEN** el select contiene una opción por cada cliente de `clientes[]`

### Requirement: Inserción segura de datos (anti-XSS)
El sistema SHALL insertar todo dato de usuario mediante `textContent`/`createTextNode`/`appendChild`, y NUNCA mediante `innerHTML`.
DEC-11.

#### Scenario: Texto con HTML no se interpreta
- **WHEN** un título contiene marcado tipo `<img src=x onerror=...>`
- **THEN** se muestra como texto literal, sin crear nodos HTML ni ejecutar scripts

#### Scenario: Render sin innerHTML
- **WHEN** se renderiza el catálogo o se pueblan selects
- **THEN** el código no asigna `innerHTML` en ningún elemento
