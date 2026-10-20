# Visión y Objetivos

## Propósito
Construir el **frontend de una librería** como evaluación parcial (Parcial 1) de la materia **Programación III** (Unidad: HTML, CSS y JavaScript). El sistema presenta un catálogo de libros y permite registrar libros, clientes y ventas simuladas, usando **únicamente tecnologías nativas del navegador** (HTML, CSS, JavaScript) sin frameworks, librerías, CDNs, backend, base de datos ni servidor.

## Objetivos por Actor

| Actor | Objetivos |
|-------|-----------|
| **Estudiante / Desarrollador** | - Demostrar dominio de HTML semántico, CSS adaptable y JavaScript nativo (DOM, eventos, localStorage)<br>- Implementar 6 ejercicios progresivos que cubren: estructura/pantallas, presentación, datos/catálogo/filtro, altas, ventas/historial, persistencia y pruebas<br>- Entregar un proyecto funcional, legible y documentado en un README |
| **Docente / Evaluador** | - Verificar el funcionamiento observado en el navegador<br>- Comprobar correspondencia entre interfaz, datos y documentación<br>- Validar casos manuales reproducibles registrados en el README<br>- Evaluar según rúbrica de 100 puntos distribuidos en 6 ejercicios |

## Alcance (In Scope)
- **Vistas/Pantallas**: Catálogo, Libros (alta + listado), Clientes (alta + listado), Ventas (composición + resumen), Historial (listado + detalle)
- **Navegación**: Encabezado + navegación clara entre vistas (puede ser SPA o multi-página)
- **Datos locales (simulados)**: Libros, editoriales, géneros, autores, clientes, ventas — arrays/objetos en memoria + localStorage
- **Catálogo**: Renderizado desde array de libros, filtro por título (insensible a mayúsculas, parcial, trim)
- **Altas**: Libros (título, ISBN, precio, editorial, género opcional, autores múltiples) y Clientes (nombre completo, email) con validaciones
- **Ventas**: Selección de cliente, renglones (libro + cantidad), cálculos (subtotal, total 2 decimales), confirmación con snapshot de precios históricos
- **Historial**: Listado de ventas (id, fecha, cliente, total) + detalle de renglones con precios congelados
- **Persistencia**: localStorage para libros, clientes, ventas; carga de ejemplos en primer inicio; recuperación sin duplicados
- **Accesibilidad básica**: Foco visible, navegación por teclado, mensajes de error con texto (no solo color), alt en imágenes informativas
- **Responsive**: Comprobado en 320px y 1280px; tablas con scroll propio si necesario
- **Documentación**: README con pasos de apertura, navegación, funcionalidades, ubicación de datos iniciales, límites de localStorage, resultados de casos manuales, procedencia de imágenes

## Fuera de Alcance (Out of Scope)
- **Backend / API / Base de datos / Servidor**: No se requiere ni se permite
- **Autenticación / Login real**: "No se requiere un inicio de sesión real"
- **Gestión de stock, cobros, facturación fiscal**: La venta es simulada
- **Edición/eliminación de registros**: "No se exige editar ni eliminar registros" (libros, clientes, ventas)
- **Gestión de editoriales, géneros, autores**: Solo selección desde datos locales preexistentes
- **Librerías, frameworks, CDNs de CSS/JS**: "No se utilizan librerías, frameworks ni CDNs"
- **Herramientas de compilación / bundlers / npm**: "No se incluyen dependencias instaladas ni herramientas de compilación"
- **Seguridad / integridad garantizada**: "Los datos son ficticios... no representan seguridad ni integridad garantizada"
- **Validación de dígito de control de ISBN**: "No se requiere implementar su dígito de control"
- **Campo apellido separado en cliente**: "No se requiere un campo de apellido separado"