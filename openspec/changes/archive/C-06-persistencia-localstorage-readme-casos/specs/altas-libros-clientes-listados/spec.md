## MODIFIED Requirements

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

#### Scenario: Validación ISBN normalizada funciona tras recarga
- **WHEN** se recarga la página tras dar de alta un libro con ISBN `978-111-222-333-4`, y se intenta dar de alta otro con `9781112223334`
- **THEN** el duplicado se detecta y rechaza correctamente (el normalizado coincide con el persistido)

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

#### Scenario: Validación email case-insensitive funciona tras recarga
- **WHEN** se recarga la página tras dar de alta cliente con email `Nuevo@Test.COM`, y se intenta dar de alta `nuevo@test.com`
- **THEN** el duplicado se detecta y rechaza correctamente (normalización case-insensitive persistida)

### Requirement: Feedback de errores cerca del formulario
Los errores de validación SHALL mostrarse en el contenedor de errores propio de cada formulario (`#errores-libro`, `#errores-cliente`), inmediatamente bajo el formulario, como lista de textos con `aria-live="polite"`; SHALL ser resultado de validación síncrona (`{ok, errors[]}`, DEC-13) y NO SHALL usar `alert()`/`confirm()` (DEC-14).

#### Scenario: Múltiples errores se listan juntos
- **WHEN** el formulario de libro tiene a la vez título vacío y precio inválido
- **THEN** se muestran ambos mensajes en `#errores-libro`, el contenedor queda visible y el foco no se pierde

#### Scenario: Errores se ocultan tras corregir
- **WHEN** el usuario reenvía el formulario corregido con todos los campos válidos
- **THEN** la lista de errores se oculta (`hidden`) y el alta procede

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

#### Scenario: Selectores de venta reflejan estado persistido tras recarga
- **WHEN** se recarga la página tras altas previas
- **THEN** `#venta-libro` y `#venta-cliente` muestran todos los libros y clientes (semilla + altas) desde localStorage