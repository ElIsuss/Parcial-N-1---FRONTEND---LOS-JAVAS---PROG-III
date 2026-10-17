# SPEC — Ejercicio 1: Estructura y pantallas HTML de la librería

## 1. Objetivo

Implementar la estructura HTML de una aplicación web para la gestión de una librería, cumpliendo estrictamente los requisitos del Ejercicio 1: Estructura y pantallas HTML.

El resultado debe ser un único archivo llamado `index.html`, que contenga el esqueleto completo de la aplicación.

La implementación debe priorizar:

- HTML semántico y correctamente estructurado.
- Navegación clara entre las cinco vistas requeridas.
- Formularios con campos y etiquetas correctamente asociados.
- Tablas con encabezados explícitos.
- Mensajes y estados previstos por el enunciado.
- Separación lógica del contenido para facilitar la incorporación futura de CSS y JavaScript.

## 2. Restricciones obligatorias

### 2.1. Archivos permitidos

El único archivo que se debe crear o modificar para esta tarea es:

`index.html`

Está prohibido:

- Crear archivos CSS.
- Crear archivos JavaScript.
- Crear archivos adicionales de HTML.
- Instalar dependencias o incorporar frameworks.
- Modificar configuraciones, documentación u otros archivos del proyecto.
- Incorporar código CSS mediante etiquetas `<style>` o atributos `style`.
- Incorporar código JavaScript mediante etiquetas `<script>`, atributos de eventos o código ejecutable equivalente.
- Utilizar estilos visuales para decorar la interfaz.

El documento debe utilizar HTML5 estándar, sin dependencias externas.

### 2.2. Presentación visual

El resultado debe ser un esqueleto HTML sin diseño visual.

No incorporar:

- Colores definidos manualmente.
- Fondos decorativos.
- Bordes decorativos.
- Sombras.
- Gradientes.
- Iconos decorativos.
- Imágenes decorativas.
- Animaciones.
- Estilos de tipografía.
- Clases de frameworks visuales.

Se permite utilizar atributos semánticos, identificadores y clases descriptivas como preparación para futuras hojas de estilo. Estos elementos no deben contener reglas de presentación.

El navegador utilizará su presentación predeterminada.

### 2.3. JavaScript y funcionalidades futuras

Esta etapa no implementa lógica de aplicación.

No se deben programar búsquedas, altas, cálculos, filtros, persistencia, validaciones personalizadas ni navegación mediante JavaScript.

La estructura HTML debe dejar preparados los campos y elementos que una futura implementación JavaScript necesitará utilizar.

No simular operaciones exitosas ni mostrar datos inventados como si provinieran de una base de datos.

## 3. Documento HTML

Crear un documento HTML5 válido con:

- `<!DOCTYPE html>`.
- Elemento raíz `<html>` con atributo `lang="es"`.
- Elemento `<head>`.
- Codificación UTF-8.
- Configuración de viewport para dispositivos móviles.
- Un título descriptivo del sistema de gestión de la librería.
- Elemento `<body>` que contenga toda la interfaz.

Utilizar nombres de clases e identificadores descriptivos, consistentes y escritos en minúsculas con guiones cuando corresponda.

No incluir dependencias externas ni recursos que requieran conexión a Internet.

## 4. Estructura semántica general

La página debe respetar la siguiente organización conceptual:

- `header`: encabezado general de la aplicación.
- `nav`: navegación principal entre las vistas.
- `main`: contenido principal de la aplicación.
- `section`: separación de las cinco vistas y sus subsecciones.
- `form`: formularios de búsqueda, alta y composición de ventas.
- `fieldset` y `legend`: agrupación de campos relacionados cuando resulte conveniente.
- `label`: etiquetas asociadas a sus respectivos controles.
- `table`: representación tabular de los listados.
- `thead`, `tbody` y `th`: encabezados y organización de tablas.
- `footer`: pie de página opcional, únicamente si aporta información útil.

No utilizar etiquetas genéricas como sustituto de elementos semánticos cuando exista una etiqueta HTML apropiada.

La estructura debe poder comprenderse incluso sin estilos visuales.

## 5. Encabezado y navegación

El encabezado debe incluir el nombre de la librería como título principal de la aplicación.

Incorporar una navegación principal con enlaces claramente identificados para acceder a:

1. Catálogo.
2. Libros.
3. Clientes.
4. Historial.
5. Ventas.

Como se solicita un único archivo HTML, utilizar enlaces internos mediante fragmentos de URL y atributos `id`.

Cada enlace debe apuntar al identificador de la sección correspondiente.

La navegación debe ser clara, consistente y accesible mediante teclado.

No utilizar botones sin acción ni enlaces con destinos vacíos.

## 6. Vista Catálogo

### 6.1. Propósito

Mostrar los libros disponibles en el catálogo y permitir que la estructura contemple una búsqueda por título.

### 6.2. Encabezado

Incluir un encabezado de sección con el título «Catálogo».

### 6.3. Buscador

Incorporar un formulario de búsqueda con:

- Campo de texto para el título del libro.
- Etiqueta visible asociada al campo.
- Texto de ayuda opcional que indique que se puede buscar por título.
- Botón con el texto «Buscar».
- Botón con el texto «Limpiar búsqueda», únicamente como control previsto para una futura implementación.

El campo debe tener un identificador y un nombre descriptivos.

No implementar el filtrado ni el vaciado del campo mediante JavaScript.

### 6.4. Listado de libros

Incorporar una tabla con las siguientes columnas obligatorias:

1. Título.
2. ISBN.
3. Editorial.
4. Género.
5. Autores.
6. Precio.

Los encabezados deben describir claramente cada columna.

La tabla debe utilizar `thead`, `tbody` y elementos `th` con el alcance correspondiente.

En la estructura de presentación de los datos se debe contemplar que, cuando un libro no tenga género asignado, se muestre «Sin clasificar».

Como todavía no se implementa la conexión con datos, no inventar registros reales ni simular resultados provenientes del sistema.

Se permite incluir una fila de estado vacío con el texto «No hay libros disponibles en el catálogo», claramente identificada como contenido inicial de ejemplo estructural y preparada para ser sustituida posteriormente por los datos reales.

### 6.5. Estados contemplados

Reservar espacios semánticos para:

- Catálogo sin libros.
- Búsqueda sin resultados.
- Resultado de una búsqueda.
- Mensaje de operación correcta.
- Mensaje de operación rechazada.

Los mensajes deben ser comprensibles y estar asociados a su sección.

No mostrar simultáneamente mensajes contradictorios ni afirmar que se realizó una búsqueda real.

## 7. Vista Libros

### 7.1. Propósito

Contemplar el alta de libros y el listado de los libros registrados.

### 7.2. Formulario de alta

Incluir una sección titulada «Registrar libro».

El formulario debe contener campos para:

- Título.
- ISBN.
- Editorial.
- Género.
- Autores.
- Precio.

Todos los campos deben tener una etiqueta visible correctamente asociada mediante los atributos `for` e `id`.

Requisitos particulares:

- **Título:** campo de texto.
- **ISBN:** campo de texto, conservando los ceros iniciales y los posibles guiones.
- **Editorial:** campo de texto.
- **Género:** campo de selección que contemple la opción «Sin clasificar» y opciones estructurales que puedan completarse posteriormente.
- **Autores:** campo de texto o control de selección apropiado para representar los autores asociados al libro.
- **Precio:** campo numérico con una configuración de precisión adecuada para importes monetarios.

No inventar un catálogo definitivo de géneros ni autores.

Si se utilizan valores de ejemplo para los selectores, deben identificarse como opciones provisionales y no como datos reales del sistema.

Incluir un botón de envío con el texto «Registrar libro».

Incluir un botón de reinicio del formulario únicamente si se mantiene su comportamiento HTML nativo y su finalidad es clara.

No programar el registro, la validación personalizada ni el almacenamiento de datos.

### 7.3. Listado de libros registrados

Debajo del formulario, incorporar una sección titulada «Libros registrados».

La tabla debe contemplar, como mínimo, las columnas:

- Título.
- ISBN.
- Editorial.
- Género.
- Autores.
- Precio.

La información debe ser coherente con los campos del formulario y con los requisitos del catálogo.

Incluir una fila o espacio de estado vacío con el texto «Todavía no hay libros registrados».

Los datos reales deberán incorporarse en una etapa posterior.

## 8. Vista Clientes

### 8.1. Propósito

Contemplar el registro y el listado de clientes de la librería.

### 8.2. Formulario de alta

Incluir una sección titulada «Registrar cliente».

Contemplar los siguientes campos:

- Nombre.
- Apellido.
- Documento de identidad.
- Correo electrónico.
- Teléfono.

Todos los campos deben disponer de etiquetas visibles correctamente asociadas.

Usar tipos de entrada HTML apropiados:

- Texto para nombre y apellido.
- Texto para documento de identidad, para conservar ceros iniciales y otros formatos.
- Correo electrónico para el correo.
- Teléfono para el número de contacto.

Los campos propuestos constituyen una estructura inicial razonable para el ejercicio. Si el proyecto ya define otros campos obligatorios en sus especificaciones, respetar esos requisitos sin alterar el resto del alcance.

Incluir un botón de envío con el texto «Registrar cliente».

No implementar almacenamiento, validaciones personalizadas ni confirmaciones funcionales.

### 8.3. Listado de clientes

Incorporar una tabla titulada «Clientes registrados», con las columnas:

- Nombre.
- Apellido.
- Documento.
- Correo electrónico.
- Teléfono.

Los encabezados deben coincidir con la información contemplada en el formulario.

Incluir un estado vacío con el texto «Todavía no hay clientes registrados».

## 9. Vista Historial

### 9.1. Propósito

Contemplar el listado de ventas registradas y el acceso a sus detalles.

### 9.2. Listado de ventas

Crear una sección titulada «Historial de ventas».

La tabla debe contemplar, como mínimo:

- Identificador de venta.
- Fecha.
- Cliente.
- Cantidad de renglones o ítems.
- Importe total.
- Acción para consultar los detalles.

Los nombres de columnas deben ser claros y descriptivos.

Cada venta debe contar con un control identificable para acceder a sus detalles cuando existan datos.

No generar identificadores, fechas, clientes ni importes ficticios presentados como ventas reales.

### 9.3. Detalles de venta

Incorporar una sección de detalles de venta dentro del mismo documento HTML.

Esta sección debe contemplar:

- Identificador de la venta.
- Fecha.
- Cliente.
- Listado de libros vendidos.
- Cantidad por libro.
- Precio unitario.
- Subtotal por renglón.
- Importe total.

La tabla de detalle debe contar con encabezados semánticos.

Los controles de acceso a los detalles deben estar preparados estructuralmente para relacionarse con la venta correspondiente cuando se incorpore JavaScript.

Como no se permite implementar lógica, no es necesario crear una navegación dinámica entre cada fila y su detalle.

### 9.4. Estado vacío

Mostrar un espacio para el mensaje «Todavía no hay ventas registradas».

Prever también un espacio para informar que una venta no tiene detalles disponibles, si corresponde.

## 10. Vista Ventas

### 10.1. Propósito

Contemplar la composición de una venta mediante la selección de un cliente y la incorporación de libros en renglones.

### 10.2. Selección del cliente

Incluir una sección titulada «Nueva venta».

Incorporar un campo de selección de cliente con:

- Etiqueta visible.
- Identificador único.
- Nombre descriptivo.
- Opción inicial que solicite seleccionar un cliente.

La lista de clientes deberá completarse con los datos registrados cuando se implemente la integración.

No inventar clientes reales ni implementar la carga dinámica.

### 10.3. Composición de renglones

Incorporar una sección titulada «Libros de la venta».

Debe contemplar una tabla para los renglones de venta con las siguientes columnas:

- Libro.
- Precio unitario.
- Cantidad.
- Subtotal.
- Acción para quitar el renglón.

Cada renglón representa un libro incluido en la venta.

Preparar un control para seleccionar el libro y otro para indicar la cantidad.

Incluir un botón con el texto «Agregar libro» para representar la acción futura de incorporar un renglón.

Incluir un control con el texto «Quitar» o «Eliminar renglón» para representar la eliminación futura de un renglón.

Los controles no deben ejecutar operaciones sin una implementación posterior.

No calcular subtotales automáticamente ni modificar las filas mediante JavaScript.

### 10.4. Resumen de la venta

Incorporar una sección titulada «Resumen de la venta» que contemple:

- Cliente seleccionado.
- Cantidad total de unidades.
- Importe total.

Los valores deben quedar preparados para ser completados por una futura implementación.

No presentar totales inventados ni afirmar que se calculan automáticamente.

### 10.5. Confirmación de la venta

Incluir un botón principal con el texto «Registrar venta».

Este control debe representar el envío de la venta para su registro futuro.

No guardar la venta ni confirmar una operación que no se haya ejecutado.

Incluir espacios para mensajes de operación correcta y de operación rechazada.

## 11. Mensajes y estados de la interfaz

La estructura debe contemplar los siguientes estados:

- Listado vacío.
- Búsqueda sin resultados.
- Operación correcta.
- Operación rechazada.
- Ausencia de detalles de una venta.

Los mensajes deben ubicarse en la sección a la que pertenecen.

Utilizar elementos semánticos apropiados, como `p`, `section` y, cuando corresponda, atributos de accesibilidad como `role="status"` o `role="alert"`.

No utilizar estos atributos para afirmar que una operación ya ocurrió cuando todavía no existe lógica que la ejecute.

Los mensajes deben ser claros, breves y descriptivos.

## 12. Preparación para JavaScript futuro

La estructura debe permitir que JavaScript pueda identificar los elementos necesarios sin tener que reescribir el HTML.

Para ello:

- Utilizar `id` únicos.
- Utilizar `name` descriptivos en los campos de formulario.
- Incorporar clases semánticas para las secciones, formularios, tablas, filas y mensajes.
- Mantener identificadores estables para las vistas.
- Separar claramente los formularios de los listados.
- Mantener las tablas preparadas para incorporar filas generadas dinámicamente.
- Reservar espacios para mensajes de estado.
- Mantener separados el listado de ventas y sus detalles.
- Diferenciar los controles que corresponden a los libros, clientes y ventas.

No incorporar plantillas JavaScript, atributos de eventos ni lógica ejecutable.

No es necesario añadir atributos `data-*` si no aportan una utilidad concreta a la estructura actual.

## 13. Accesibilidad y calidad del HTML

El documento debe cumplir las siguientes condiciones:

- Cada campo de formulario debe tener una etiqueta asociada.
- Cada formulario debe contar con un propósito claro.
- Los botones deben describir su acción.
- Los enlaces deben tener destinos válidos dentro del documento.
- Las tablas deben contar con encabezados.
- Los encabezados deben mantener una jerarquía lógica.
- Los identificadores no deben repetirse.
- Los elementos deben utilizarse según su propósito semántico.
- La navegación debe ser utilizable mediante teclado.
- Los campos deben contar con nombres accesibles.
- No deben utilizarse tablas para maquetar la página.
- No deben utilizarse caracteres especiales o símbolos decorativos como sustitutos de controles o etiquetas.
- El contenido debe estar redactado en español.

No añadir campos obligatorios mediante el atributo `required` sin que exista una exigencia explícita en los requisitos del proyecto. La validación funcional pertenece a una etapa posterior.

## 14. Organización interna del archivo

Ordenar el documento de manera clara:

1. Declaración del documento y configuración general.
2. Encabezado.
3. Navegación principal.
4. Contenido principal.
5. Vista Catálogo.
6. Vista Libros.
7. Vista Clientes.
8. Vista Historial.
9. Vista Ventas.
10. Pie de página opcional.

Cada vista debe estar separada por comentarios HTML descriptivos.

Ejemplo de comentarios:

`<!-- Vista: Catálogo -->`

`<!-- Vista: Libros -->`

`<!-- Vista: Clientes -->`

`<!-- Vista: Historial -->`

`<!-- Vista: Ventas -->`

Dentro de cada vista, utilizar comentarios adicionales solo cuando ayuden a comprender la organización.

No crear secciones vacías sin propósito ni duplicar controles innecesariamente.

## 15. Criterios de aceptación

La tarea se considerará completa cuando se cumplan todos los puntos siguientes:

- [ ] Existe un único archivo de salida: `index.html`.
- [ ] El documento utiliza HTML5 válido.
- [ ] No se crean ni modifican archivos adicionales.
- [ ] No contiene CSS, ni interno ni externo.
- [ ] No contiene JavaScript ni código ejecutable.
- [ ] No incorpora colores ni decoración visual.
- [ ] Incluye encabezado, navegación y contenido principal semántico.
- [ ] La navegación contempla Catálogo, Libros, Clientes, Historial y Ventas.
- [ ] El Catálogo contiene buscador por título y listado con todos los campos exigidos.
- [ ] El Catálogo contempla el texto «Sin clasificar» para libros sin género.
- [ ] Libros contiene formulario de alta y listado.
- [ ] Clientes contiene formulario de alta y listado.
- [ ] Historial contiene listado de ventas y estructura para consultar detalles.
- [ ] Ventas contempla cliente, renglones, cantidades y resumen.
- [ ] Los formularios tienen etiquetas asociadas.
- [ ] Las tablas tienen encabezados semánticos.
- [ ] Existen espacios para estados vacíos, búsquedas sin resultados y mensajes de operación.
- [ ] Los identificadores son únicos y las clases son descriptivas.
- [ ] La estructura está preparada para una futura integración con CSS y JavaScript.
- [ ] No se afirma que una operación funciona cuando solo existe su estructura HTML.
- [ ] El código está ordenado, indentado y es fácil de mantener.

## 16. Instrucciones finales para el agente

Antes de modificar cualquier archivo:

1. Leer esta spec completa.
2. Revisar la estructura actual del proyecto.
3. Verificar si existe alguna spec incompleta o pendiente que deba resolverse antes de comenzar, siguiendo las reglas del proyecto.
4. Comprobar si el proyecto define requisitos adicionales que afecten directamente al ejercicio.
5. Presentar un resumen de los cambios propuestos y solicitar confirmación explícita antes de escribir código.

No implementar nada hasta recibir la confirmación.

Después de la confirmación:

1. Implementar exclusivamente `index.html`.
2. Seguir esta spec y los requisitos del ejercicio sin agregar funcionalidades no solicitadas.
3. Verificar que el archivo contenga únicamente HTML y que no incluya CSS ni JavaScript.
4. Revisar la estructura semántica, la navegación, los formularios, las tablas y los estados.
5. Comprobar que no se hayan modificado otros archivos.
6. Informar qué se implementó, qué criterios de aceptación se verificaron y qué funcionalidades quedan pendientes para las siguientes etapas.

No modificar esta spec ni crear archivos adicionales durante la implementación.

El objetivo de esta etapa es entregar el esqueleto HTML completo, no una aplicación funcional ni una interfaz diseñada visualmente.