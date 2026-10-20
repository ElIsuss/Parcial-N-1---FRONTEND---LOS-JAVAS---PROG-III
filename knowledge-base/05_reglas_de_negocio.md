# Reglas de Negocio

> Cada regla tiene un código **RN-XX** para trazabilidad. Se agrupan por dominio.

## Restricciones Técnicas Obligatorias (RN-TEC)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-TEC-01** | **Vanilla only — sin librerías externas** | **Prohibido** uso de cualquier dependencia npm/CDN/framework (React, Vue, jQuery, Bootstrap, Tailwind, Lodash, Axios, etc.). Solo HTML5, CSS3, ES6+ nativos del navegador. |
| **RN-TEC-02** | Sin `node_modules` / `package.json` | El proyecto **no** incluye gestión de paquetes; se entrega como archivos estáticos puros. |

## Catálogo y Filtro (RN-CAT)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-CAT-01** | Filtro por título | Búsqueda **insensible a mayúsculas/minúsculas**, **coincidencia parcial** (substring), **trim** en extremos. |
| **RN-CAT-02** | Búsqueda vacía | Si el input está vacío o solo espacios → muestra **todo el catálogo**. |
| **RN-CAT-03** | Sin coincidencias | Si el filtro no arroja resultados → muestra **mensaje claro** ("No se encontraron libros"). |
| **RN-CAT-04** | Género no asignado | Libro sin `generoId` → mostrar **"Sin clasificar"** en catálogo y listados. |
| **RN-CAT-05** | Datos de catálogo | El catálogo se genera **exclusivamente** desde el array `libros[]` en memoria (proveniente de localStorage). |

## Alta de Libros (RN-LIB)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-LIB-01** | Título requerido | `titulo.trim() !== ""` |
| **RN-LIB-02** | ISBN requerido y único | `isbn.normalizado.trim() !== ""` Y no existe en `libros[]` (comparación normalizada: sin espacios, sin guiones, case-insensitive). |
| **RN-LIB-03** | Precio numérico > 0 | `Number(precio) > 0` y es número válido. |
| **RN-LIB-04** | Editorial obligatoria y existente | `editorialId` seleccionado ∈ `editoriales[].id`. |
| **RN-LIB-05** | Género opcional | `generoId` puede ser `null` / "Sin clasificar"; si se elige, debe existir en `generos[].id`. |
| **RN-LIB-06** | Al menos un autor | `autorIds.length ≥ 1` y cada id ∈ `autores[].id`. |
| **RN-LIB-07** | Selectores generados desde datos | `<select>` de editorial, género, autores se poblan dinámicamente desde `editoriales[]`, `generos[]`, `autores[]`. |
| **RN-LIB-08** | ISBN normalización | Para comparación: `isbn.replace(/[\s-]/g, '').toUpperCase()`. No se valida dígito de control. |
| **RN-LIB-09** | Feedback de error | Errores mostrados **cerca del formulario** (no solo alert); lista de errores si hay varios. |
| **RN-LIB-10** | Actualización reactiva | Tras alta exitosa: listado de libros y selectores de venta se actualizan **sin recargar página**. |

## Alta de Clientes (RN-CLI)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-CLI-01** | Nombre completo requerido | `nombreCompleto.trim() !== ""` |
| **RN-CLI-02** | Email requerido y formato válido | `email.trim() !== ""` Y pasa regex básica (ej: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). |
| **RN-CLI-03** | Email único (case-insensitive + trim) | `nuevoEmail.trim().toLowerCase()` no existe en `clientes[].email` (normalizado igual). |
| **RN-CLI-04** | Un solo campo nombre | No hay campo apellido separado. |
| **RN-CLI-05** | Feedback y actualización | Igual que RN-LIB-09 / RN-LIB-10. |

## Ventas (RN-VTA)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-VTA-01** | Cliente obligatorio | Debe seleccionarse un `clienteId` existente. |
| **RN-VTA-02** | Mínimo un renglón | `renglones.length ≥ 1` al confirmar. |
| **RN-VTA-03** | Cantidad entera > 0 | `Number.isInteger(cantidad) && cantidad > 0` por renglón. |
| **RN-VTA-04** | Libro existente | `libroId` de cada renglón ∈ `libros[].id` al momento de confirmar. |
| **RN-VTA-05** | Sin libros duplicados en la misma venta | Un `libroId` aparece **máximo una vez** en `renglones[]`. Si se intenta agregar duplicado → **modifica cantidad del renglón existente** O informa duplicado (no crea otro renglón). |
| **RN-VTA-06** | Cálculo subtotal | `subtotal = cantidad * precioUnitarioSnapshot` (2 decimales). |
| **RN-VTA-07** | Cálculo total | `total = Σ subtotales` (2 decimales). |
| **RN-VTA-08** | Precio unitario histórico (snapshot) | Al confirmar, `precioUnitarioSnapshot = libro.precio` **actual**; **no** se vuelve a leer del catálogo al consultar historial. |
| **RN-VTA-09** | Datos descriptivos en renglón | Se guardan `titulo`, `isbn` (o campos necesarios para leer el detalle sin consultar catálogo actual). |
| **RN-VTA-10** | Validación previa a confirmar | Impedir confirmar si: sin cliente, sin renglones, cantidad inválida, libro inexistente. |
| **RN-VTA-11** | Edición pre-confirmación | Permitir **cambiar cantidades** y **quitar renglones** antes de confirmar. |
| **RN-VTA-12** | Post-confirmación | Limpiar formulario para nueva venta + mostrar mensaje de resultado (éxito/error). |
| **RN-VTA-13** | Ventas inmutables | Ventas confirmadas **no se editan ni eliminan** desde la interfaz. |

## Historial (RN-HIS)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-HIS-01** | Listado de ventas | Muestra: `id`, `fecha` (formato legible), `cliente` (nombre), `total` (2 decimales). |
| **RN-HIS-02** | Detalle de venta | Al acceder al detalle: muestra renglones con `libro`, `cantidad`, `precioUnitarioSnapshot`, `subtotal`. |
| **RN-HIS-03** | Precio histórico inmutable | El detalle **siempre** usa `precioUnitarioSnapshot` guardado, **nunca** el precio actual del catálogo. |
| **RN-HIS-04** | Sin edición/eliminación | Igual que RN-VTA-13. |

## Persistencia (RN-PER)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-PER-01** | localStorage para libros, clientes, ventas | Claves: `libreria_libros`, `libreria_clientes`, `libreria_ventas` (mínimo). |
| **RN-PER-02** | Carga de semilla en primer inicio | Si `!localStorage.getItem('libreria_inicializado')` → escribir semilla + flag. |
| **RN-PER-03** | Recuperación sin duplicados | Al abrir: leer localStorage; **no** volver a insertar semilla si ya existe flag. |
| **RN-PER-04** | Persistencia de editoriales/géneros/autores | Opcional pero recomendado para consistencia de selectores. |
| **RN-PER-05** | Aislamiento de almacenamiento | El README debe documentar: "depende del navegador, perfil y ubicación de apertura; no comparte información entre usuarios". |

## Validación y UX (RN-UX)

| Código | Regla | Descripción |
|--------|-------|-------------|
| **RN-UX-01** | `preventDefault` en formularios | Envíos controlados por JS. |
| **RN-UX-02** | Mensajes de estado | Listas vacías, búsquedas sin resultados, operaciones correctas/rechazadas → **texto visible**. |
| **RN-UX-03** | Accesibilidad básica | Foco visible, navegación teclado, errores con texto (no solo color), alt en imágenes. |
| **RN-UX-04** | Responsive 320px / 1280px | Sin scroll horizontal de página; tablas con `overflow-x: auto` en contenedor propio. |
| **RN-UX-05** | Separación responsabilidades | HTML (estructura), CSS (presentación), JS (comportamiento) en archivos separados. |

## Tabla de Trazabilidad (Ejercicio ↔ Reglas)

| Ejercicio | Reglas Involucradas |
|-----------|---------------------|
| 1. HTML | RN-CAT-04, RN-CAT-05, RN-LIB-07, RN-CLI-04, RN-VTA-01, RN-VTA-02, RN-UX-02, RN-UX-05 |
| 2. CSS | RN-UX-03, RN-UX-04, RN-UX-05 |
| 3. Datos y Catálogo | RN-CAT-01 a RN-CAT-05, RN-PER-01 a RN-PER-03 |
| 4. Altas | RN-LIB-01 a RN-LIB-10, RN-CLI-01 a RN-CLI-05, RN-PER-01 a RN-PER-03 |
| 5. Ventas | RN-VTA-01 a RN-VTA-13, RN-HIS-01 a RN-HIS-04, RN-PER-01, RN-PER-03 |
| 6. Cierre | RN-PER-01 a RN-PER-05, RN-UX-02, RN-UX-03, RN-UX-04 |