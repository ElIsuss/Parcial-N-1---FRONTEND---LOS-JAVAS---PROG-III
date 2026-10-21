# Librería — Parcial 1 Programación III

Trabajo Práctico de Frontend — Universidad Tecnológica Nacional / Universidad Nacional de Tucumán

## Autores

- [Nombre Apellido] — [Legajo]
- [Nombre Apellido] — [Legajo]

---

## Apertura del proyecto

Este proyecto **no requiere instalación** ni herramientas de build (npm, webpack, vite, etc.). Es una aplicación vanilla HTML/CSS/JS que funciona abriendo directamente el archivo `index.html` en un navegador moderno.

### Opción A: Doble clic (protocolo `file://`)
1. Descargar/clonar el repositorio
2. Navegar a la carpeta del proyecto
3. Hacer doble clic en `index.html`

> **Nota**: Algunos navegadores (Chrome, Edge) bloquean ES Modules (`<script type="module">`) al abrir vía `file://` por política CORS. Si la aplicación no carga, usar Opción B.

### Opción B: Servidor estático simple (recomendado)
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8000
```
Luego abrir `http://localhost:8000` en el navegador.

---

## Navegación

La aplicación es una **SPA (Single Page Application)** con 5 vistas accesibles desde la barra de navegación superior:

| Vista | Descripción |
|-------|-------------|
| **Catálogo** | Exploración y búsqueda de libros (pública) |
| **Libros** | Alta de nuevos libros + listado registrado |
| **Clientes** | Alta de nuevos clientes + listado registrado |
| **Ventas** | Composición y confirmación de ventas |
| **Historial** | Listado de ventas confirmadas con detalle |

La navegación no recarga la página; solo muestra/oculta secciones (`<section class="vista">`).

---

## Funcionalidades

### ✅ Implementadas (Ejercicios 1–5)

| Ejercicio | Funcionalidad | Estado |
|-----------|---------------|--------|
| 1 | Estructura HTML semántica (header, nav, main, section, form, table) | ✅ |
| 1 | Navegación SPA 5 vistas | ✅ |
| 2 | CSS Mobile-first, variables, Flexbox/Grid, responsive 320px/1280px | ✅ |
| 2 | Accesibilidad básica (foco visible, navegación teclado, aria-live) | ✅ |
| 3 | Datos semilla (≥6 libros, ≥2 editoriales, ≥2 géneros, ≥3 autores, ≥3 clientes) | ✅ |
| 3 | Repository `Data` con localStorage, flag `libreria_inicializado` | ✅ |
| 3 | Catálogo renderizado desde datos, tarjetas con metadatos | ✅ |
| 3 | Filtro por título (substring, case-insensitive, trim) | ✅ |
| 3 | Poblar selects editorial/género/autores/clientes/libros dinámicamente | ✅ |
| 4 | Alta libro con validaciones (título, ISBN único normalizado, precio>0, editorial, ≥1 autor) | ✅ |
| 4 | Alta cliente con validaciones (nombre, email formato + único case-insensitive) | ✅ |
| 4 | Listados libros/clientes en tablas, actualización reactiva sin recarga | ✅ |
| 4 | Feedback errores cerca formulario (`aria-live="polite"`) | ✅ |
| 5 | Composición venta: selector cliente, agregar renglones (libro + cantidad) | ✅ |
| 5 | Validaciones venta: cliente obligatorio, ≥1 renglón, cantidad entera >0, libro existe | ✅ |
| 5 | Anti-duplicado renglones (modifica cantidad existente) | ✅ |
| 5 | Cálculo subtotales y total (2 decimales) | ✅ |
| 5 | Confirmación: snapshot precio (`precioUnitarioSnapshot`), total, fecha ISO | ✅ |
| 5 | Historial: tabla (id, fecha legible, cliente, total), botón "Ver detalle" | ✅ |
| 5 | Detalle venta: renglones con snapshot inmutable (precio, subtotal, título, ISBN) | ✅ |
| 5 | Ventas inmutables (sin edición/eliminación) | ✅ |
| 6 | Persistencia completa localStorage (libros, clientes, ventas, catálogos apoyo) | ✅ |
| 6 | Carga semilla solo primer inicio, recuperación sin duplicados | ✅ |

### ❌ Pendientes / No requeridas

| Funcionalidad | Motivo |
|---------------|--------|
| Editar/eliminar libros, clientes, ventas | Fuera de alcance (consigna) |
| CRUD editoriales, géneros, autores | No requerido |
| Login / autenticación / roles | No requerido |
| Backend, API, base de datos | Solo frontend vanilla |
| Validación dígito control ISBN | No requerido |

---

## Datos iniciales

Los datos de prueba (semilla) se definen en **`js/data.js`** dentro del objeto `SEED`:

- **6 libros** con títulos, ISBN, precios, editorial, género y autores
- **2 editoriales**: Editorial Sudamericana, Penguin Random House
- **2 géneros**: Ficción, No Ficción
- **3 autores**: Borges, Cortázar, Bioy Casares
- **3 clientes**: Juan Pérez, María García, Carlos López
- **0 ventas** (inicial)

Al **primer inicio** (no existe `libreria_inicializado` en localStorage):
1. Se cargan los arrays semilla en memoria
2. Se persisten en localStorage bajo claves `libreria_libros`, `libreria_clientes`, `libreria_ventas`, `libreria_editoriales`, `libreria_generos`, `libreria_autores`
3. Se setea `libreria_inicializado = "true"`

En **inicios posteriores**:
1. Se leen las claves de localStorage
2. Se pueblan los arrays internos **sin volver a insertar la semilla**
3. Si localStorage está corrupto/vacío → fallback a semilla + warning en consola

---

## Funcionamiento y límites de localStorage

### Claves utilizadas
| Clave | Contenido |
|-------|-----------|
| `libreria_libros` | Array de libros (semilla + altas) |
| `libreria_clientes` | Array de clientes (semilla + altas) |
| `libreria_ventas` | Array de ventas confirmadas con snapshots |
| `libreria_editoriales` | Array de editoriales (para consistencia selectores) |
| `libreria_generos` | Array de géneros (para consistencia selectores) |
| `libreria_autores` | Array de autores (para consistencia selectores) |
| `libreria_inicializado` | Flag `"true"` indica que ya se cargó la semilla |

### Limitaciones importantes

> **⚠️ Los datos en localStorage dependen del navegador, perfil de usuario y ubicación de apertura.**
> - **Navegador**: Chrome, Firefox, Edge, Safari tienen storages separados
> - **Perfil**: Cada perfil de usuario del navegador tiene su propio localStorage
> - **Ubicación**: `file://` vs `http://localhost:8000` vs `https://dominio.com` son orígenes distintos → **no comparten datos**
> - **Modo privado/incógnito**: localStorage puede fallar o no persistir al cerrar
> - **Cuota**: ~5 MB por origen; si se excede, `setItem` falla (la app loguea en consola y sigue en memoria)
> - **No hay sincronización** entre dispositivos, usuarios ni navegadores

### Para la prueba guiada del precio histórico (Ejercicio 6, Caso 6)
1. Confirmar una venta con al menos un libro
2. Abrir DevTools (F12) → Application → Local Storage → `libreria_libros`
3. Editar el `precio` del libro vendido (cambiar valor numérico)
4. Recargar la página (F5)
5. Ir a **Historial** → **Ver detalle** de esa venta
6. Verificar que **precio unitario, subtotales y total** conservan los valores originales del momento de la venta

---

## Casos de prueba manuales (Consigna — Flujo 7)

| Caso | Descripción | Resultado Esperado | Resultado Real |
|------|-------------|-------------------|----------------|
| **1** | Búsqueda: "FICCIONES" (mayúsculas) → vacía → "xyz123" (inexistente) | Coincide sin case; catálogo completo; mensaje "No se encontraron libros" | ✅ Aprobado |
| **2** | Alta libro: ISBN semilla (`978-987-1234-56-7`) → ISBN nuevo válido (`978-987-0000-00-1`) | Duplicado rechazado; nuevo aparece en catálogo y selector `#venta-libro` | ✅ Aprobado |
| **3** | Alta cliente: email `invalido` → `JUAN@EMAIL.COM` (dup. case-insensitive) → `nuevo@test.com` | 2 primeros rechazados (formato, duplicado); nuevo en listado y selector `#venta-cliente` | ✅ Aprobado |
| **4** | Venta: sin cliente / cantidad 0/-1/1.5 / mismo libro 2 veces | No confirma; errores claros; duplicado no crea renglón extra, suma cantidad (ej. 2) | ✅ Aprobado |
| **5** | Venta válida: Ficciones 2×$1.500 + Rayuela 1×$2.200 | Subtotales $3.000, $2.200; total $5.200; venta en historial con esos importes | ✅ Aprobado |
| **6** | Precio histórico: venta confirmada (Ficciones 2×$1.500 + Rayuela 1×$2.200) → editar precio Ficciones en localStorage ($1.500→$9.999) → recargar → historial | Precio unitario histórico $1.500, subtotal Ficciones $3.000, subtotal Rayuela $2.200, total $5.200 **conservados** (snapshot inmutable); catálogo muestra $9.999 | ✅ Aprobado |
| **7** | Recarga tras altas y venta + navegación teclado 320px/1280px | Datos recuperados sin duplicados (libro, cliente, venta); foco visible; navegación Tab funcional; interfaz usable en 320px y 1280px sin scroll horizontal | ✅ Aprobado |

> **Nota**: Los 7 casos de prueba se ejecutaron manualmente en navegador (Chrome/Edge) a 320px (device toolbar) y 1280px, navegando exclusivamente con Tab, Shift+Tab, Enter y Escape. Todos resultaron **Aprobados**. Resultados reales registrados arriba.

---

## Procedencia de imágenes ajenas

**Ninguna**. La aplicación no utiliza imágenes externas, CDNs ni placeholders remotos. Todo el contenido visual se genera mediante HTML/CSS nativo (tarjetas, botones, tablas, iconos Unicode).

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Marcado | HTML5 semántico |
| Estilos | CSS3 nativo (variables, Flexbox, Grid, mobile-first) |
| Comportamiento | JavaScript ES6+ nativo (Módulos ES, DOM API, localStorage) |
| Almacenamiento | localStorage (Web Storage API) |
| Entorno | Navegador moderno (Chrome, Firefox, Edge, Safari) |
| Tooling | **Ninguno** — solo editor + navegador |

---

## Estructura del proyecto

```
.
├── index.html           # Entry point SPA
├── css/
│   ├── base.css         # Reset, variables, utilidades
│   ├── layout.css       # Grid header/nav/main, responsive
│   ├── catalogo.css     # Grid catálogo, tarjetas, toolbar
│   ├── formularios.css  # Formularios, botones, errores
│   └── tablas.css       # Tablas, modal, scroll interno
├── js/
│   ├── app.js           # Bootstrap, navegación, inicialización
│   ├── nav.js           # mostrarVista() SPA
│   ├── data.js          # Repository + localStorage + semilla
│   ├── utils.js         # normalizeISBN, formatPriceARS, isValidEmail, generateId, debounce
│   ├── catalogo.js      # Render catálogo, filtro, poblar selects
│   ├── libros.js        # Alta/listado libros
│   ├── clientes.js      # Alta/listado clientes
│   ├── ventas.js        # Compositor venta, validaciones, confirmación
│   └── historial.js     # Listado historial, modal detalle (snapshot)
├── README.md            # Este archivo
├── CHANGES.md           # Roadmap de changes OpenSpec
├── AGENTS.md            # Instrucciones para agentes IA
├── CLAUDE.md            # Instrucciones para agentes IA (copia)
├── knowledge-base/      # Base de conocimiento del dominio
└── openspec/            # Especificaciones y changes OpenSpec
```

---

## Créditos

Trabajo Práctico — Programación III — UNT/UTN