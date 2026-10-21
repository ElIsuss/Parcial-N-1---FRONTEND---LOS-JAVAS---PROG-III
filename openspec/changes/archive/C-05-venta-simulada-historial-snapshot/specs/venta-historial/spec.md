## Purpose

Permite a un empleado componer una venta seleccionando un cliente y agregando renglones con libros y cantidades, confirmar la venta con snapshot inmutable de precios y datos descriptivos, y consultar un historial de ventas con detalle que siempre use los precios históricos guardados (nunca el catálogo actual).

## ADDED Requirements

### Requirement: Cliente obligatorio para venta
El sistema SHALL requerir que se seleccione un cliente existente antes de permitir confirmar una venta.

#### Scenario: Sin cliente seleccionado no se puede confirmar
- **WHEN** el usuario no ha seleccionado un cliente
- **THEN** el botón "Confirmar Venta" permanece deshabilitado y el sistema NO crea la venta

#### Scenario: Error al forzar confirmación sin cliente
- **WHEN** se dispara el submit sin cliente seleccionado (por ejemplo, mediante teclado o código)
- **THEN** el sistema NO crea la venta y muestra el error "Seleccione un cliente" en `#errores-venta`

#### Scenario: Cliente seleccionado habilita confirmación (si hay renglones válidos)
- **WHEN** el usuario selecciona un cliente de la lista Y hay al menos un renglón válido
- **THEN** el botón "Confirmar Venta" se habilita

#### Scenario: Crear cliente refresca el estado del botón
- **WHEN** el usuario crea un cliente desde la vista Clientes mientras hay renglones cargados en Ventas
- **THEN** el selector `#venta-cliente` se repuebla, queda sin selección y el botón "Confirmar Venta" se deshabilita

### Requirement: Composición de renglones con libro y cantidad
El sistema SHALL permitir agregar renglones seleccionando un libro existente e ingresando una cantidad entera mayor a cero.

#### Scenario: Agregar renglón válido
- **WHEN** el usuario selecciona un libro, ingresa una cantidad válida (entero > 0) y hace click en "Agregar"
- **THEN** el renglón aparece en la tabla con: libro (título), cantidad, precio unitario (actual del catálogo), subtotal (cantidad × precio, 2 decimales)

#### Scenario: Rechazar cantidad inválida
- **WHEN** el usuario ingresa una cantidad no válida (0, negativo, decimal, notación científica como "2e3", vacío, o no numérico)
- **THEN** el sistema NO agrega el renglón y muestra un error visible ("Cantidad debe ser un número entero mayor a 0")

#### Scenario: Libro duplicado suma cantidad al renglón existente
- **WHEN** el usuario intenta agregar un libro que ya está en los renglones
- **THEN** el sistema NO crea un nuevo renglón; suma la cantidad al renglón existente y recalcula su subtotal y el total

#### Scenario: Editar cantidad de renglón existente
- **WHEN** el usuario modifica la cantidad de un renglón ya agregado
- **THEN** el sistema valida la nueva cantidad (entero > 0); si es válida, recalcula subtotal y total; si es inválida, rechaza el cambio y restaura el valor anterior

#### Scenario: Quitar renglón
- **WHEN** el usuario hace click en "Quitar" en un renglón
- **THEN** el renglón se elimina de la tabla y el total se recalcula; si no quedan renglones, reaparece el estado vacío y el botón confirmar se deshabilita

### Requirement: Cálculo de totales con dos decimales
El sistema SHALL calcular y mostrar subtotales y total con exactamente dos decimales.

#### Scenario: Subtotal por renglón
- **WHEN** un renglón tiene cantidad N y precio unitario P
- **THEN** el subtotal mostrado ES N × P redondeado a 2 decimales

#### Scenario: Total de la venta
- **WHEN** hay uno o más renglones
- **THEN** el total mostrado ES la suma de todos los subtotales, redondeado a 2 decimales

### Requirement: Validación previa a confirmar (bloqueo)
El sistema SHALL impedir la confirmación si faltan requisitos obligatorios.

#### Scenario: Bloquear sin cliente
- **WHEN** no hay cliente seleccionado
- **THEN** el botón "Confirmar Venta" está deshabilitado y no se crea la venta

#### Scenario: Bloquear sin renglones
- **WHEN** no hay renglones en la tabla
- **THEN** el botón "Confirmar Venta" está deshabilitado y no se crea la venta

#### Scenario: Bloquear con cantidad inválida en algún renglón
- **WHEN** algún renglón tiene cantidad inválida (aunque el usuario no la editó directamente, p. ej. estado inconsistente)
- **THEN** el botón "Confirmar Venta" está deshabilitado y no se crea la venta

### Requirement: Confirmación de venta con snapshot histórico
El sistema SHALL registrar la venta copiando el precio unitario actual de cada libro como valor histórico inmutable, junto con datos descriptivos (título, ISBN).

#### Scenario: Venta confirmada genera objeto Venta completo
- **WHEN** el usuario hace click en "Confirmar Venta" con datos válidos
- **THEN** se crea un objeto Venta con: `id` único, `fecha` ISO 8601, `clienteId`, `renglones[]` (cada uno con `libroId`, `cantidad`, `precioUnitarioSnapshot`, `subtotal`, `titulo`, `isbn`), `total` (suma subtotales, 2 decimales)

#### Scenario: Snapshot de precio inmutable
- **WHEN** se confirma la venta
- **THEN** cada renglón guarda `precioUnitarioSnapshot = libro.precio` actual; posteriores cambios en el catálogo NO afectan el historial

#### Scenario: Datos descriptivos en renglón
- **WHEN** se confirma la venta
- **THEN** cada renglón guarda `titulo` e `isbn` del libro al momento de la venta (para legibilidad sin consultar catálogo)

#### Scenario: Persistencia en localStorage
- **WHEN** la venta se confirma
- **THEN** se agrega al array `ventas[]` en memoria y se persiste en `localStorage` bajo clave `libreria_ventas` (vía `Data.guardarTodos()`)

### Requirement: Limpieza y mensaje de resultado post-confirmación
El sistema SHALL limpiar el formulario para una nueva venta y mostrar un mensaje de éxito.

#### Scenario: Formulario limpio tras confirmar
- **WHEN** la venta se confirma exitosamente
- **THEN** el selector de cliente vuelve a "Seleccionar cliente…", la tabla de renglones queda vacía (estado vacío visible), total $ 0,00, y el botón confirmar se deshabilita

#### Scenario: Mensaje de resultado visible
- **WHEN** la venta se confirma exitosamente
- **THEN** se muestra un mensaje de éxito en `#resultado-venta` (role="status", aria-live="polite") con texto tipo "Venta confirmada correctamente"

### Requirement: Historial de ventas con listado y detalle
El sistema SHALL mostrar un listado de todas las ventas confirmadas y permitir ver el detalle de cada una.

#### Scenario: Listado de historial
- **WHEN** el usuario navega a la vista Historial
- **THEN** se muestra una tabla con columnas: ID, Fecha (formato legible dd/mm/yyyy hh:mm), Cliente (nombre completo), Total (2 decimales), Acciones ("Ver detalle"); si no hay ventas, muestra estado vacío "No hay ventas registradas"

#### Scenario: Detalle de venta usa snapshot histórico
- **WHEN** el usuario hace click en "Ver detalle" de una venta
- **THEN** se abre un modal mostrando: ID venta, fecha, cliente, total, y tabla de renglones con libro, ISBN, cantidad, precio unitario (snapshot), subtotal; los precios SON los guardados en `precioUnitarioSnapshot`, NO el precio actual del catálogo

#### Scenario: Ventas inmutables (sin edición ni eliminación)
- **WHEN** el usuario ve el historial o el detalle
- **THEN** NO hay botones ni acciones para editar o eliminar ventas

### Requirement: Estado vacío visible en Ventas e Historial
El sistema SHALL mostrar un mensaje claro cuando no hay renglones en la venta actual o no hay ventas en el historial.

#### Scenario: Estado vacío en composer de venta
- **WHEN** no hay renglones agregados
- **THEN** la tabla muestra una fila con clase `fila-vacia` y texto "Sin renglones agregados." (hidden=false)

#### Scenario: Estado vacío en historial
- **WHEN** no hay ventas registradas
- **THEN** la tabla muestra una fila con clase `fila-vacia` y texto "No hay ventas registradas." (hidden=false)

### Requirement: Validación estricta de cantidad (solo dígitos enteros positivos)
El sistema SHALL rechazar cualquier entrada que no sea un entero positivo escrito solo con dígitos (sin espacios, signos, decimales, notación científica).

#### Scenario: Rechazar "2e3" (notación científica)
- **WHEN** el usuario ingresa "2e3" en el input de cantidad
- **THEN** el sistema lo rechaza como inválido (no lo acepta como 2000)

#### Scenario: Rechazar "2.9" (decimal)
- **WHEN** el usuario ingresa "2.9"
- **THEN** el sistema lo rechaza (no lo trunca a 2)

#### Scenario: Rechazar "+2" o "-1"
- **WHEN** el usuario ingresa "+2" o "-1"
- **THEN** el sistema los rechaza

#### Scenario: Rechazar espacios (" 3 " o "3 ")
- **WHEN** el usuario ingresa una cantidad con espacios al inicio o al final
- **THEN** el sistema la rechaza como inválida (no aplica trim)

#### Scenario: Aceptar "3" (dígitos puros)
- **WHEN** el usuario ingresa "3"
- **THEN** el sistema lo acepta como cantidad válida