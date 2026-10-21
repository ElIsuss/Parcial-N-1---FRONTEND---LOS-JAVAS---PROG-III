## MODIFIED Requirements

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

#### Scenario: Recarga tras ventas confirmadas recupera historial intacto
- **WHEN** hay ventas en `libreria_ventas` y se recarga la página
- **THEN** `Data.getVentas()` retorna exactamente las ventas confirmadas (con sus `precioUnitarioSnapshot`, `subtotales`, `total` intactos), sin duplicados ni pérdida de datos

### Requirement: Persistencia de los arrays en localStorage
El sistema SHALL persistir el estado con `guardarTodos()` bajo claves versionadas y tolerar fallos de escritura sin interrumpir la aplicación.
RN-PER-01, RN-PER-04.

#### Scenario: Guardado de claves mínimas
- **WHEN** se invoca `Data.guardarTodos()`
- **THEN** se escriben `libreria_libros`, `libreria_clientes` y `libreria_ventas` (y las claves opcionales de apoyo)

#### Scenario: Error de escritura no aborta
- **WHEN** `localStorage.setItem` falla (p. ej. cuota excedida)
- **THEN** el error se registra por consola y la ejecución continúa (sin excepción propagada)

#### Scenario: Guardado tras cada mutación exitosa
- **WHEN** `Data.crearLibro`, `Data.crearCliente` o `Data.crearVenta` retornan `{ok: true}`
- **THEN** `guardarTodos()` se invoca automáticamente y los cambios quedan en localStorage antes de retornar al caller