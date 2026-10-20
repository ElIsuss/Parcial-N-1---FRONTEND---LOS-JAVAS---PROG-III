# Spec Delta: altas-libros-clientes-listados (C-04)

## Purpose

Permite dar de alta libros y clientes desde los formularios de la SPA con validaciones completas, mostrarlos en sus listados tabulares y mantener catálogo y selectores de venta actualizados sin recargar la página (Épica 4 — Ejercicio 4).

## ADDED Requirements

### Requirement: Alta de libro con validaciones
El sistema SHALL permitir registrar un libro nuevo mediante `#form-libro` con los campos título, ISBN, precio, editorial, género (opcional) y al menos un autor, aplicando RN-LIB-01 a RN-LIB-06 de forma sincrónica. El submit del formulario SHALL ser interceptado (`preventDefault`) y SHALL NOT recargar la página.

#### Scenario: Libro válido se da de alta
- **WHEN** el usuario completa título, ISBN inédito, precio > 0, una editorial existente, un género (o "Sin clasificar") y ≥1 autor, y presiona "Guardar Libro"
- **THEN** el libro se agrega a `libros[]`, se persiste en localStorage, el formulario se limpia y no se muestran errores

#### Scenario: ISBN duplicado normalizado se rechaza
- **WHEN** se envía un ISBN que coincide con uno existente solo tras normalizar (`replace(/[\s-]/g,'').toUpperCase()`, RN-LIB-02/RN-LIB-08)
- **THEN** NO se crea el libro y se muestra un error de ISBN duplicado cerca del formulario

#### Scenario: Título vacío se rechaza
- **WHEN** el campo título está vacío o solo contiene espacios
- **THEN** NO se crea el libro y se muestra el error de título requerido (RN-LIB-01)

#### Scenario: Precio inválido se rechaza
- **WHEN** el precio no es numérico o es ≤ 0
- **THEN** NO se crea el libro y se muestra el error de precio (RN-LIB-03)

#### Scenario: Editorial obligatoria inexistente o vacía se rechaza
- **WHEN** no se selecciona editorial o el `editorialId` no pertenece a `editoriales[]`
- **THEN** NO se crea el libro y se muestra el error de editorial (RN-LIB-04)

#### Scenario: Sin autores se rechaza
- **WHEN** no hay ningún checkbox de autor marcado (o un id no pertenece a `autores[]`)
- **THEN** NO se crea el libro y se muestra el error de al menos un autor (RN-LIB-06)

### Requirement: Alta de cliente con validaciones
El sistema SHALL permitir registrar un cliente nuevo mediante `#form-cliente` con nombre completo y email, aplicando RN-CLI-01 a RN-CLI-03 de forma sincrónica, con `preventDefault` y sin recarga.

#### Scenario: Cliente válido se da de alta
- **WHEN** el usuario completa nombre no vacío y un email con formato válido e inédito, y presiona "Guardar Cliente"
- **THEN** el cliente se agrega a `clientes[]`, se persiste en localStorage, el formulario se limpia y no se muestran errores

#### Scenario: Email con formato inválido se rechaza
- **WHEN** el email no pasa la regex básica de formato (RN-CLI-02)
- **THEN** NO se crea el cliente y se muestra el error de formato de email

#### Scenario: Email duplicado case-insensitive se rechaza
- **WHEN** el email coincide con uno existente solo después de `trim().toLowerCase()` (RN-CLI-03)
- **THEN** NO se crea el cliente y se muestra el error de email ya registrado

### Requirement: Feedback de errores cerca del formulario
Los errores de validación SHALL mostrarse en el contenedor de errores propio de cada formulario (`#errores-libro`, `#errores-cliente`), inmediatamente bajo el formulario, como lista de textos con `aria-live="polite"`; SHALL ser resultado de validación síncrona (`{ok, errors[]}`, DEC-13) y NO SHALL usar `alert()`/`confirm()` (DEC-14).

#### Scenario: Múltiples errores se listan juntos
- **WHEN** el formulario de libro tiene a la vez título vacío y precio inválido
- **THEN** se muestran ambos mensajes en `#errores-libro`, el contenedor queda visible y el foco no se pierde

#### Scenario: Errores se ocultan tras corregir
- **WHEN** el usuario reenvía el formulario corregido con todos los campos válidos
- **THEN** la lista de errores se oculta (`hidden`) y el alta procede

### Requirement: Listado de libros registrado
El sistema SHALL renderizar `#tabla-libros` con una fila por libro de `libros[]`, mostrando ID, título, ISBN, editorial (nombre), género (nombre o "Sin clasificar"), autores (nombres unidos por coma) y precio formateado en ARS con 2 decimales. Si no hay libros, SHALL mostrarse la fila vacía `.fila-vacia`.

#### Scenario: Tabla refleja el estado actual
- **WHEN** hay 6 libros semilla + 1 libro recién dado de alta
- **THEN** `#tabla-libros` muestra 7 filas de datos con los valores en sus columnas

#### Scenario: Listado vacío muestra mensaje
- **WHEN** `libros[]` está vacío
- **THEN** solo se muestra la fila `.fila-vacia` con "No hay libros registrados."

### Requirement: Listado de clientes registrado
El sistema SHALL renderizar `#tabla-clientes` con una fila por cliente de `clientes[]` (ID, nombre completo, email). Si no hay clientes, SHALL mostrarse la fila vacía `.fila-vacia`.

#### Scenario: Tabla refleja el estado actual
- **WHEN** hay 3 clientes semilla + 1 cliente recién dado de alta
- **THEN** `#tabla-clientes` muestra 4 filas de datos

#### Scenario: Listado vacío muestra mensaje
- **WHEN** `clientes[]` está vacío
- **THEN** solo se muestra la fila `.fila-vacia` con "No hay clientes registrados."

### Requirement: Actualización reactiva tras alta exitosa
Tras un alta exitosa, el sistema SHALL actualizar sin recargar la página: el listado afectado, el catálogo (`renderCatalogo`), y los selectores de venta (`#venta-cliente` y/o `#venta-libro`) — RN-LIB-10, RN-CLI-05. Los datos nuevos SHALL quedar en `localStorage` bajo `libreria_libros` / `libreria_clientes`.

#### Scenario: Alta de libro actualiza selectores de venta
- **WHEN** se da de alta un libro nuevo correctamente
- **THEN** `#tabla-libros`, el grid del catálogo y el select `#venta-libro` incluyen el libro nuevo, en la misma sesión y sin recarga

#### Scenario: Alta de cliente actualiza selector de cliente
- **WHEN** se da de alta un cliente nuevo correctamente
- **THEN** `#tabla-clientes` y el select `#venta-cliente` incluyen el cliente nuevo, en la misma sesión y sin recarga

#### Scenario: Persistencia tras recarga
- **WHEN** se da de alta un registro y luego se recarga la página
- **THEN** el registro dado de alta sigue presente (flag `libreria_inicializado` ya seteado por C-03, sin duplicar semilla)

### Requirement: Seguridad de inserción y IDs estables
El renderizado de listados y el llenado de selectores/checkboxes SHALL insertar datos de usuario únicamente vía `textContent`/`createTextNode`/`appendChild` (DEC-11, NUNCA `innerHTML`) y los nuevos registros SHALL recibir IDs generados con `generateId()` (`Date.now().toString(36)` + random), no índices de array (DEC-08, SUP-08). Los checkboxes de autores en `#contenedor-autores` SHALL generarse dinámicamente desde `autores[]` (RN-LIB-07).

#### Scenario: Título con HTML no se interpreta
- **WHEN** se da de alta un libro con título `<img src=x onerror=alert(1)>`
- **THEN** la tabla muestra el texto literal, sin crear elementos HTML ni ejecutar scripts

#### Scenario: ID del registro nuevo
- **WHEN** se da de alta un libro o cliente nuevo
- **THEN** el registro tiene un ID string no vacío, distinto de los existente, distinto de cualquier índice numérico de array
