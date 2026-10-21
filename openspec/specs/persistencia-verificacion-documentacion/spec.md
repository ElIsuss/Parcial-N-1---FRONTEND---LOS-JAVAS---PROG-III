# persistencia-verificacion-documentacion Specification

## Purpose

Completa la persistencia en localStorage (libros, clientes, ventas con snapshot de precios), verifica los 7 casos manuales de la consigna (búsqueda, altas, ventas, recarga, historial, navegación teclado, responsive 320/1280px) y documenta todo en un README.md completo con autores, pasos de apertura, navegación, funcionalidades, límites de localStorage, tabla de casos y procedencia de imágenes.

## Requirements

### Requirement: Persistencia completa y sin duplicados
El sistema SHALL persistir libros, clientes y ventas en localStorage bajo claves `libreria_libros`, `libreria_clientes`, `libreria_ventas` (y opcionales `libreria_editoriales`, `libreria_generos`, `libreria_autores`) usando un flag `libreria_inicializado` para cargar la semilla una sola vez. Al recargar, SHALL recuperar los datos guardados SIN volver a insertar la semilla ni duplicar ventas previas. RN-PER-01, RN-PER-02, RN-PER-03, RN-PER-04.

#### Scenario: Primer inicio escribe semilla y flag
- **WHEN** no existe `libreria_inicializado` en localStorage
- **THEN** `Data.inicializar()` carga la semilla, invoca `guardarTodos()` y setea `libreria_inicializado=true`

#### Scenario: Recarga recupera sin duplicar semilla
- **WHEN** `libreria_inicializado` ya existe y hay datos en localStorage
- **THEN** `Data.inicializar()` lee las claves y puebla arrays internos; `Data.getLibros()` contiene SOLO los 6 libros semilla (no 12), `Data.getVentas()` contiene SOLO las ventas confirmadas por el usuario (no 0 ni duplicados)

#### Scenario: Recarga tras altas de libros/clientes conserva nuevos registros
- **WHEN** se dio de alta 1 libro y 1 cliente, luego se recarga la página
- **THEN** `Data.getLibros()` tiene 7 libros, `Data.getClientes()` tiene 4 clientes, y el flag `libreria_inicializado` sigue en true

#### Scenario: Error de localStorage no rompe la app
- **WHEN** `localStorage.setItem` falla (cuota excedida, modo privado, etc.)
- **THEN** el error se loguea en consola y la aplicación continúa funcionando en memoria

### Requirement: Validaciones de integridad en altas y ventas
El sistema SHALL rechazar ISBN duplicados (comparación normalizada sin espacios/guiones/case), emails inválidos o duplicados (case-insensitive + trim), cantidades de venta no enteras o ≤ 0, libros inexistentes en catálogo, y libros repetidos en una misma venta (modificando cantidad del renglón existente o informando el duplicado sin crear renglón extra). RN-LIB-02, RN-LIB-08, RN-CLI-02, RN-CLI-03, RN-VTA-03, RN-VTA-04, RN-VTA-05.

#### Scenario: ISBN duplicado con formato distinto se rechaza
- **WHEN** existe libro con ISBN `978-987-1234-56-7` e intenta agregarse `9789871234567` o ` 978 987 1234 56 7 `
- **THEN** `Data.crearLibro` retorna `{ok: false, errors: ["El ISBN ya está registrado."]}` y no muta `libros[]`

#### Scenario: Email duplicado solo por mayúsculas se rechaza
- **WHEN** existe cliente con email `Juan@Email.com` e intenta agregarse `juan@email.com` o ` JUAN@EMAIL.COM `
- **THEN** `Data.crearCliente` retorna `{ok: false, errors: ["El email ya está registrado."]}`

#### Scenario: Email con formato inválido se rechaza
- **WHEN** se intenta registrar email sin `@` (ej. `usuario.com`) o sin dominio (ej. `usuario@`)
- **THEN** `Data.crearCliente` retorna `{ok: false, errors: ["El formato del email no es válido."]}`

#### Scenario: Cantidad de venta decimal, cero o negativa se rechaza
- **WHEN** en el composer de venta se ingresa cantidad `0`, `-1`, `1.5`, o no numérico
- **THEN** el renglón no se agrega y se muestra error "La cantidad debe ser un entero mayor a 0" (RN-VTA-03)

#### Scenario: Libro inexistente en venta se rechaza
- **WHEN** se selecciona un `libroId` que no está en `Data.getLibros()` al momento de confirmar
- **THEN** la confirmación falla con error "El libro seleccionado no existe" (RN-VTA-04)

#### Scenario: Libro repetido en la misma venta modifica cantidad existente
- **WHEN** se agrega un libro al composer, luego se intenta agregar el mismo `libroId` otra vez
- **THEN** NO se crea un segundo renglón; la cantidad del renglón existente se incrementa (o se informa duplicado sin agregar) y los subtotales se recalculan (RN-VTA-05)

### Requirement: Snapshot de precios histórico inmutable
El sistema SHALL guardar en cada renglón de venta el `precioUnitarioSnapshot` (copia del `libro.precio` al momento de confirmar), `titulo`, `isbn`, `cantidad`, y `subtotal = cantidad * precioUnitarioSnapshot`. El historial SHALL mostrar siempre estos valores guardados, NUNCA recalcular desde el catálogo actual. RN-VTA-08, RN-VTA-09, RN-HIS-03.

#### Scenario: Venta confirmada guarda snapshot del precio
- **WHEN** se confirma una venta con un libro de precio $1.500
- **THEN** el renglón en `ventas[]` tiene `precioUnitarioSnapshot: 1500`, `subtotal: 3000` (si cantidad 2), y `total` suma correcta

#### Scenario: Cambio de precio en catálogo NO afecta historial
- **WHEN** se confirma una venta, luego se modifica el precio del libro en `libros[]` / localStorage a $2.000, y se recarga la página
- **THEN** el detalle de la venta en historial sigue mostrando precio unitario $1.500, subtotal $3.000, total inalterado

#### Scenario: Detalle de venta usa solo datos del snapshot
- **WHEN** se abre el modal de detalle de una venta confirmada
- **THEN** la tabla muestra `precioUnitarioSnapshot`, `subtotal`, y `titulo`/`isbn` del renglón guardado, sin consultar `Data.getLibros()` para esos campos

### Requirement: Ejecución y documentación de 7 casos manuales
El sistema SHALL permitir ejecutar y documentar los 7 casos de prueba manuales definidos en la consigna (Flujo 7), con criterios verificables de aprobado/fallido/pendiente. Cada caso debe poder probarse en navegador a 320px y 1280px con navegación por teclado. RN-UX-02, RN-UX-03, RN-UX-04.

#### Caso 1: Búsqueda mayúsculas → vacía → inexistente
- **WHEN** se busca "BORGES" → catálogo con libros de Borges; se vacía input → catálogo completo; se busca "xyz123" → mensaje "No se encontraron libros"
- **THEN** caso APROBADO si las 3 sub-pruebas pasan; FALLIDO si alguna falla; PENDIENTE si no se probó

#### Caso 2: Alta libro ISBN duplicado → ISBN nuevo
- **WHEN** se intenta alta con ISBN de libro semilla → error duplicado; se corrige a ISBN nuevo válido → libro aparece en catálogo y selector venta
- **THEN** caso APROBADO si duplicado rechazado y nuevo visible en ambos lugares; FALLIDO en otro caso

#### Caso 3: Alta cliente email inválido → existente (mayúsculas) → nuevo
- **WHEN** email `invalido` → error formato; email `JUAN@EMAIL.COM` (duplicado case-insensitive) → error duplicado; email `nuevo@test.com` → cliente en listado y selector
- **THEN** caso APROBADO si las 3 sub-pruebas pasan; FALLIDO en otro caso

#### Caso 4: Venta sin cliente / cantidad 0/negativa/decimal / libro repetido
- **WHEN** confirmar sin cliente → error; agregar renglón con cantidad 0/-1/1.5 → error; agregar mismo libro dos veces → no crea renglón duplicado
- **THEN** caso APROBADO si todas las validaciones rechazan correctamente; FALLIDO en otro caso

#### Caso 5: Venta válida 2×1500 + 1×2000
- **WHEN** se compone venta: 2 unidades de libro $1.500 + 1 unidad de libro $2.000, se confirma
- **THEN** subtotales $3.000 y $2.000, total $5.000; venta en historial con esos valores; caso APROBADO si números exactos

#### Caso 6: Precio histórico tras recarga y cambio de catálogo
- **WHEN** venta confirmada → editar `localStorage.libreria_libros` cambiando precio de un libro vendido → recargar → ver historial
- **THEN** precio unitario, subtotales y total conservan valores originales; caso APROBADO si snapshot inmutable

#### Caso 7: Recarga tras altas y venta + navegación teclado 320px/1280px
- **WHEN** tras dar de alta libros/clientes y confirmar venta, se recarga la página; se navega con Tab/Enter entre vistas, formularios y tablas a 320px y 1280px
- **THEN** datos recuperados sin duplicados; foco visible en todos los controles; sin scroll horizontal de página; tablas con scroll interno si exceden ancho; caso APROBADO si todo funciona

### Requirement: README.md completo con documentación obligatoria
El proyecto SHALL incluir un `README.md` en la raíz con: autores del trabajo, pasos para abrir `index.html` sin npm, explicación de navegación entre vistas, lista de funcionalidades implementadas y pendientes, ubicación de datos iniciales (`js/data.js` → `cargarSemilla()` / localStorage), funcionamiento y límites de localStorage (depende de navegador, perfil, ubicación de apertura; no comparte entre usuarios), tabla de 7 casos manuales con columnas "Caso", "Resultado Esperado", "Resultado Real" (aprobado/fallido/pendiente), y procedencia de imágenes ajenas si las hay. HU-18, RN-PER-05.

#### Scenario: README contiene todas las secciones requeridas
- **WHEN** se abre `README.md`
- **THEN** incluye: autores, pasos apertura, navegación, funcionalidades, ubicación datos, límites localStorage, tabla 7 casos con resultados reales, procedencia imágenes

#### Scenario: Tabla de casos refleja resultados reales de la prueba
- **WHEN** se ejecutan los 7 casos manuales en navegador
- **THEN** la columna "Resultado Real" en README muestra "Aprobado", "Fallido" o "Pendiente" según lo observado (no inventado)

#### Scenario: Documentación de límites de localStorage clara
- **WHEN** se lee la sección de localStorage en README
- **THEN** explica que los datos dependen del navegador, perfil de usuario y ubicación (file:// vs servidor), y NO se comparten entre usuarios ni dispositivos