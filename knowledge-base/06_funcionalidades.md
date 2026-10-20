# Funcionalidades (Historias de Usuario / Features por Épica)

## Épica 1: Navegación y Estructura Base (Ejercicio 1)

| ID | Historia | Criterios de Aceptación | Puntos |
|----|----------|-------------------------|--------|
| **HU-01** | Como usuario quiero acceder a la librería desde `index.html` y navegar entre las 5 vistas | - `index.html` es entrada única<br>- Nav visible con 5 enlaces: Catálogo, Libros, Clientes, Ventas, Historial<br>- Cambio de vista sin recargar (SPA) O multi-página con nav consistente<br>- Header con título de la librería | 10 |
| **HU-02** | Como usuario quiero que cada vista use HTML semántico y formularios accesibles | - Etiquetas: `header`, `nav`, `main`, `section`, `article`, `table`, `form`, `label`, `button`<br>- Cada `<input>`/`<select>`/`<textarea>` tiene `<label for="id">`<br>- Botones con texto descriptivo (`<button>Agregar libro</button>`)<br>- Tablas con `<thead><th scope="col">` | 10 |

## Épica 2: Presentación y Accesibilidad (Ejercicio 2)

| ID | Historia | Criterios de Aceptación | Puntos |
|----|----------|-------------------------|--------|
| **HU-03** | Como usuario quiero una identidad visual coherente y reusable | - Paleta de colores, tipografía, espaciado definidos en variables CSS<br>- Clases reutilizadas para elementos equivalentes (`.card`, `.btn`, `.form-group`, `.table-container`)<br>- CSS en archivos externos (`/css/*.css`) | 8 |
| **HU-04** | Como usuario quiero que la interfaz sea usable en móvil (320px) y desktop (1280px) | - Flexbox/Grid para layout<br>- 320px: textos legibles, controles usables, **sin scroll horizontal de página**<br>- 1280px: aprovechamiento de ancho<br>- Tablas con `overflow-x: auto` en contenedor propio si exceden ancho | 8 |
| **HU-05** | Como usuario con teclado quiero navegar y ver foco claramente | - `:focus-visible` en todos los controles interactivos<br>- Tab order lógico<br>- `Enter`/`Space` activan botones<br>- Mensajes de error con texto (no solo color rojo)<br>- Imágenes informativas con `alt` descriptivo; decorativas con `alt=""` | 4 |

## Épica 3: Datos Locales, Catálogo y Filtro (Ejercicio 3)

| ID | Historia | Criterios de Aceptación | Puntos |
|----|----------|-------------------------|--------|
| **HU-06** | Como sistema quiero datos semilla con mínimos requeridos | - ≥6 libros, ≥2 editoriales, ≥2 géneros, ≥3 autores, ≥3 clientes<br>- Cada libro: editorial existente, 1+ autores existentes, género opcional (existente si asignado)<br>- IDs estables (no índices de array) | 5 |
| **HU-07** | Como empleado quiero ver el catálogo renderizado desde datos | - Catálogo generado por JS desde `libros[]`<br>- Cada tarjeta/fila: título, ISBN, editorial, género ("Sin clasificar" si null), autores, precio (2 decimales) | 5 |
| **HU-08** | Como cliente quiero filtrar libros por título | - Input de búsqueda + botón/enter<br>- Insensible a mayúsculas, parcial, trim<br>- Vacío → catálogo completo<br>- Sin resultados → mensaje claro | 5 |

## Épica 4: Altas de Libros y Clientes (Ejercicio 4)

| ID | Historia | Criterios de Aceptación | Puntos |
|----|----------|-------------------------|--------|
| **HU-09** | Como empleado quiero dar de alta un libro con validaciones | - Formulario: título, ISBN, precio, select editorial, select género (incluye "Sin clasificar"), multi-select autores<br>- Selectores poblados desde datos locales<br>- Validaciones: RN-LIB-01 a RN-LIB-06<br>- `preventDefault`, errores cerca del formulario<br>- Alta exitosa → actualiza listado y selectores de venta sin recargar | 6 |
| **HU-10** | Como empleado quiero dar de alta un cliente con validaciones | - Formulario: nombre completo, email<br>- Validaciones: RN-CLI-01 a RN-CLI-03<br>- `preventDefault`, errores cerca del formulario<br>- Alta exitosa → actualiza listado y selector de venta sin recargar | 4 |
| **HU-11** | Como empleado quiero ver listados de libros y clientes registrados | - Tablas con encabezados<br>- Datos conectados a `libros[]` / `clientes[]` (localStorage)<br>- Mensajes si lista vacía | 5 |

## Épica 5: Venta Simulada e Historial (Ejercicio 5)

| ID | Historia | Criterios de Aceptación | Puntos |
|----|----------|-------------------------|--------|
| **HU-12** | Como empleado quiero componer una venta seleccionando cliente y renglones | - Selector cliente (obligatorio, desde `clientes[]`)<br>- Agregar renglón: select libro (desde `libros[]`) + input cantidad (entero >0)<br>- No duplicados: si libro ya en renglones → modifica cantidad o informa<br>- Cada renglón muestra: libro, cantidad, precio unitario, subtotal (2 dec) | 8 |
| **HU-13** | Como empleado quiero ver resumen y confirmar la venta | - Total = Σ subtotales (2 dec)<br>- Validaciones previas: RN-VTA-01 a RN-VTA-05<br>- Botón confirmar habilitado solo si válido<br>- Confirmar → registra venta con id, fecha ISO, clienteId, renglones (con **snapshot precio**), total | 5 |
| **HU-14** | Como empleado quiero consultar el historial de ventas | - Tabla: id, fecha legible, cliente (nombre), total (2 dec)<br>- Botón/acción "Ver detalle" por fila | 7 |
| **HU-15** | Como empleado quiero ver el detalle de una venta con precios históricos | - Detalle muestra renglones: libro, cantidad, **precioUnitarioSnapshot**, subtotal<br>- Precio **no** se recalcula desde catálogo actual<br>- Ventas no editables ni eliminables | (incluido en 7) |

## Épica 6: Persistencia, Pruebas y Documentación (Ejercicio 6)

| ID | Historia | Criterios de Aceptación | Puntos |
|----|----------|-------------------------|--------|
| **HU-16** | Como sistema quiero persistir datos en localStorage | - Claves: `libreria_libros`, `libreria_clientes`, `libreria_ventas` (+ opcionales editoriales/géneros/autores)<br>- Flag `libreria_inicializado` para semilla única | 4 |
| **HU-17** | Como desarrollador quiero documentar casos manuales en README | - Tabla con 7 casos + resultados esperados (ver consigna pág. 5-6)<br>- Casos: filtro mayúsculas/vacío/inexistente, ISBN duplicado/nuevo, email inválido/existente/nuevo, venta sin cliente/cantidad inválida/duplicado, venta válida 2×1500 + 1×2000, precio histórico tras recarga, recarga tras altas/venta, navegación teclado 320/1280px | 3 |
| **HU-18** | Como entregable quiero un README completo | - Autores del trabajo<br>- Pasos para abrir `index.html` sin npm<br>- Navegación entre vistas<br>- Funcionalidades implementadas y pendientes<br>- Ubicación de datos iniciales (`data.js` / localStorage)<br>- Funcionamiento y límites de localStorage<br>- Resultados de casos manuales<br>- Procedencia de imágenes ajenas (si hay) | 3 |

## Matriz de Trazabilidad (Ejercicio → HU → Puntos)

| Ejercicio | HUs | Puntos Totales |
|-----------|-----|----------------|
| 1. HTML | HU-01, HU-02 | 20 |
| 2. CSS | HU-03, HU-04, HU-05 | 20 |
| 3. Datos/Catálogo | HU-06, HU-07, HU-08 | 15 |
| 4. Altas | HU-09, HU-10, HU-11 | 15 |
| 5. Ventas/Historial | HU-12, HU-13, HU-14, HU-15 | 20 |
| 6. Cierre | HU-16, HU-17, HU-18 | 10 |
| **TOTAL** | | **100** |

## Funcionalidades NO Requeridas (Explicitamente Out of Scope)
- Editar/eliminar libros, clientes, ventas
- CRUD de editoriales, géneros, autores
- Login / autenticación / roles técnicos
- Backend, API, base de datos, servidor
- Validación dígito control ISBN
- Campo apellido separado
- Librerías/frameworks/CDNs
- Herramientas de build (npm, webpack, vite, etc.)