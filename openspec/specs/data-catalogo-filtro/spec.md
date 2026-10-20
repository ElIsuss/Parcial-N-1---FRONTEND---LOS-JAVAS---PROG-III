# Spec: Data, Catálogo y Filtro (Delta C-03)

> Especificación delta para el change C-03. Extiende la arquitectura base (C-01, C-02) con capa de datos, renderizado de catálogo y filtro por título.

## Capability Path
`data-catalogo-filtro`

## Dependencias
- `estructura-base-navegacion` (C-01) — hooks HTML, estructura SPA
- `css-mobile-first-accesibilidad` (C-02) — estilos, navegación JS (`mostrarVista`)

---

## 1. Modelo de Datos en Memoria (`js/data.js`)

### 1.1 Estado Global (Repository Pattern)
```javascript
const Data = {
  // Arrays en memoria (single source of truth)
  libros: [],
  editoriales: [],
  generos: [],
  autores: [],
  clientes: [],
  ventas: [],

  // Flag de inicialización
  _inicializado: false,
}
```

### 1.2 Datos Semilla (Mínimos Requeridos)
```javascript
const SEED = {
  editoriales: [
    { id: "ed1", nombre: "Editorial Sudamericana" },
    { id: "ed2", nombre: "Penguin Random House" }
  ],
  generos: [
    { id: "gen1", nombre: "Ficción" },
    { id: "gen2", nombre: "No Ficción" }
  ],
  autores: [
    { id: "aut1", nombre: "Jorge Luis Borges" },
    { id: "aut2", nombre: "Julio Cortázar" },
    { id: "aut3", nombre: "Adolfo Bioy Casares" }
  ],
  libros: [
    { id: "lib1", titulo: "Ficciones", isbn: "978-987-1234-56-7", precio: 1500.00, editorialId: "ed1", generoId: "gen1", autorIds: ["aut1", "aut2"] },
    { id: "lib2", titulo: "Rayuela", isbn: "978-950-07-1234-5", precio: 2200.00, editorialId: "ed2", generoId: "gen1", autorIds: ["aut2"] },
    { id: "lib3", titulo: "El Aleph", isbn: "978-987-6543-21-0", precio: 1800.00, editorialId: "ed1", generoId: "gen1", autorIds: ["aut1"] },
    { id: "lib4", titulo: "Sapiens: De animales a dioses", isbn: "978-84-397-3456-7", precio: 3500.00, editorialId: "ed2", generoId: "gen2", autorIds: ["aut3"] },
    { id: "lib5", titulo: "Historia de la lectira", isbn: "978-950-12-3456-7", precio: 2800.00, editorialId: "ed1", generoId: "gen2", autorIds: ["aut1", "aut3"] },
    { id: "lib6", titulo: "Cuentos completos", isbn: "978-987-1111-22-2", precio: 1900.00, editorialId: "ed2", generoId: null, autorIds: ["aut2", "aut3"] }
  ],
  clientes: [
    { id: "cli1", nombreCompleto: "Juan Pérez", email: "juan@email.com" },
    { id: "cli2", nombreCompleto: "María García", email: "maria@email.com" },
    { id: "cli3", nombreCompleto: "Carlos López", email: "carlos@email.com" }
  ],
  ventas: []
}
```

### 1.3 API Pública (ES Module Exports)

#### `Data.inicializar()`
- Si `!localStorage.getItem('libreria_inicializado')` → `cargarSemilla()` + `guardarTodos()` + set flag
- Sino → leer `libreria_libros`, `libreria_clientes`, `libreria_ventas` (+ opcionales editoriales/géneros/autores) → poblar arrays
- Setea `Data._inicializado = true`
- **No lanza**, no retorna Promise (sync)

#### `Data.cargarSemilla()`
- Pobla arrays internos con `SEED` (copia profunda)
- IDs ya vienen pregenerados en semilla (estables)

#### `Data.guardarTodos()`
- `localStorage.setItem('libreria_libros', JSON.stringify(Data.libros))`
- `localStorage.setItem('libreria_clientes', JSON.stringify(Data.clientes))`
- `localStorage.setItem('libreria_ventas', JSON.stringify(Data.ventas))`
- Opcional: `libreria_editoriales`, `libreria_generos`, `libreria_autores`
- `localStorage.setItem('libreria_inicializado', 'true')`

#### Getters (Read-Only, retornan copias)
- `Data.getLibros()` → `[...Data.libros]`
- `Data.getEditoriales()` → `[...Data.editoriales]`
- `Data.getGeneros()` → `[...Data.generos]`
- `Data.getAutores()` → `[...Data.autores]`
- `Data.getClientes()` → `[...Data.clientes]`
- `Data.getVentas()` → `[...Data.ventas]`

#### Helpers internos (no exportados, usados por mutaciones futuras C-04+)
- `Data._findLibroById(id)`
- `Data._findClienteById(id)`
- `Data._findEditorialById(id)`
- etc.

#### Mutaciones (stubs en C-03, implementadas en C-04/C-05)
- `Data.crearLibro(libro)` — validaciones RN-LIB-01..06 + push + save — **C-04**
- `Data.crearCliente(cliente)` — validaciones RN-CLI-01..03 + push + save — **C-04**
- `Data.crearVenta(venta)` — validaciones RN-VTA-01..10 + push + save — **C-05**

### 1.4 Reglas de Negocio Aplicadas
- **RN-PER-01**: Claves localStorage mínimas
- **RN-PER-02**: Carga semilla primer inicio
- **RN-PER-03**: Recuperación sin duplicados (flag)
- **RN-PER-04**: Persistencia opcional catálogos apoyo
- **DEC-03**: Repository pattern centralizado
- **DEC-12**: Flag `libreria_inicializado`

---

## 2. Utilidades Compartidas (`js/utils.js`)

### 2.1 Exports

#### `normalizeISBN(isbn: string): string`
```javascript
export function normalizeISBN(isbn) {
  return String(isbn).replace(/[\s-]/g, '').toUpperCase();
}
```
- **RN-LIB-02, RN-LIB-08, DEC-05**: Comparación sin espacios/guiones, case-insensitive

#### `formatPriceARS(amount: number): string`
```javascript
export function formatPriceARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
}
```
- **SUP-06**: Formato ARS 2 decimales

#### `isValidEmail(email: string): boolean`
```javascript
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}
```
- **RN-CLI-02, DEC-06**: Formato básico + trim

#### `generateId(): string`
```javascript
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
```
- **DEC-08, SUP-08**: IDs estables, no índices array

#### `debounce(fn: Function, ms: number): Function`
```javascript
export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```
- **PA-12**: Para filtro futuro (no obligatorio en C-03)

---

## 3. Catálogo y Filtro (`js/catalogo.js`)

### 3.1 Exports

#### `renderCatalogo(libros: Libro[]): void`
- Selecciona `#contenedor-catalogo` (`.catalogo-grid`, role="list")
- Limpia contenido previo de forma segura: `while (contenedor.firstChild) contenedor.removeChild(contenedor.firstChild)` (sin `innerHTML`, **DEC-11**)
- Si `libros.length === 0`:
  - Oculta contenedor grid
  - Muestra `#mensaje-catalogo-vacio` (hidden=false)
- Sino:
  - Muestra contenedor grid
  - Oculta mensaje vacío
  - Para cada libro:
    - Crea `<article class="libro-card">`
    - `<h3>` → `libro.titulo` (textContent)
    - `<p class="meta">` → ISBN, Editorial (nombre via lookup), Género (nombre o "Sin clasificar" **RN-CAT-04**), Autores (nombres via lookup, join ", ")
    - `<p class="precio">` → `formatPriceARS(libro.precio)`
    - Append al contenedor
- **DEC-11**: Solo `textContent`/`createTextNode`/`appendChild` — **NUNCA** `innerHTML`

#### `filtrarLibros(termino: string): Libro[]`
```javascript
export function filtrarLibros(termino) {
  const t = String(termino).trim().toLowerCase();
  if (!t) return Data.getLibros(); // RN-CAT-02
  return Data.getLibros().filter(libro =>
    libro.titulo.toLowerCase().includes(t) // RN-CAT-01
  );
}
```
- Trim + lowercase + substring match
- Vacío → todos (RN-CAT-02)

#### `bindBusqueda(): void`
- Selecciona `#form-busqueda`, `#input-busqueda`, `#btn-limpiar-busqueda`
- Event `submit` en form: `preventDefault()` → `filtrarLibros(input.value)` → `renderCatalogo(resultado)`
- Event `input` en input: filtrado inmediato (sin debounce obligatorio, **PA-12**)
  - `filtrarLibros(input.value)` → `renderCatalogo(resultado)`
  - Si `input.value.trim()` → muestra `#btn-limpiar-busqueda` (hidden=false)
  - Sino → oculta botón limpiar
- Click `#btn-limpiar-busqueda`: `input.value = ''` → `renderCatalogo(Data.getLibros())` → oculta botón

### 3.2 Poblar Selects (Helpers internos, llamados desde app.js)

#### `poblarSelectEditorial(selectEl: HTMLSelectElement): void`
- Limpia options salvo placeholder
- `Data.getEditoriales().forEach(e => { opt = document.createElement('option'); opt.value = e.id; opt.textContent = e.nombre; selectEl.appendChild(opt); })`

#### `poblarSelectGenero(selectEl: HTMLSelectElement): void`
- Igual + option "Sin clasificar" value=""

#### `poblarContenedorAutores(contenedorEl: HTMLElement): void`
- Limpia contenedor
- `Data.getAutores().forEach(a => { label = document.createElement('label'); checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.value = a.id; checkbox.name = 'autorIds'; label.appendChild(checkbox); label.appendChild(document.createTextNode(' ' + a.nombre)); contenedorEl.appendChild(label); })`
- **DEC-08**: Checkboxes (mejor UX móvil que `<select multiple>`)

#### `poblarSelectCliente(selectEl: HTMLSelectElement): void`
- Desde `Data.getClientes()`

#### `poblarSelectLibro(selectEl: HTMLSelectElement): void`
- Desde `Data.getLibros()` (para vista Ventas)

### 3.3 Reglas de Negocio Aplicadas
- **RN-CAT-01**: Filtro insensible mayúsculas, parcial, trim
- **RN-CAT-02**: Vacío → catálogo completo
- **RN-CAT-03**: Sin resultados → mensaje claro
- **RN-CAT-04**: Género null → "Sin clasificar"
- **RN-CAT-05**: Catálogo desde `libros[]` en memoria
- **RN-LIB-07**: Selectores generados desde datos
- **RN-UX-01**: `preventDefault` en form búsqueda
- **RN-UX-02**: Mensajes estado (vacío, sin resultados)
- **RN-UX-03**: Accesibilidad (role="list", labels, aria-live en mensaje)
- **RN-UX-05**: Separación HTML/CSS/JS
- **DEC-05**: ISBN normalizado (no usado en catálogo pero en data)
- **DEC-11**: Inserción segura `textContent`/`createTextNode`
- **DEC-13**: Validaciones sync (no aplica aquí pero patrón consistente)

---

## 4. Integración con Bootstrap (`js/app.js`)

### 4.1 Flujo de Inicialización (Existente en C-02, extendido)
```javascript
import { mostrarVista } from './nav.js';
import { Data } from './data.js';
import { renderCatalogo, bindBusqueda, poblarSelectEditorial, poblarSelectGenero, poblarContenedorAutores, poblarSelectCliente, poblarSelectLibro } from './catalogo.js';

document.addEventListener('DOMContentLoaded', () => {
  Data.inicializar(); // Carga semilla o localStorage
  
  // Poblar selects que existen en HTML (C-01)
  poblarSelectEditorial(document.getElementById('libro-editorial'));
  poblarSelectGenero(document.getElementById('libro-genero'));
  poblarContenedorAutores(document.getElementById('contenedor-autores'));
  poblarSelectCliente(document.getElementById('venta-cliente'));
  poblarSelectLibro(document.getElementById('venta-libro'));
  
  // Bind catálogo
  bindBusqueda();
  renderCatalogo(Data.getLibros());
  
  // Mostrar vista inicial
  mostrarVista('catalogo');
});
```

---

## 5. Interfaz con Changes Posteriores

| Change | Qué consume de C-03 |
|--------|---------------------|
| **C-04** | `Data.getLibros()`, `Data.getClientes()`, `Data.crearLibro()`, `Data.crearCliente()`, `renderCatalogo()`, `poblarSelect*` (actualizar tras altas) |
| **C-05** | `Data.getLibros()`, `Data.getClientes()`, `Data.getVentas()`, `Data.crearVenta()`, `poblarSelectLibro()`, `poblarSelectCliente()` |
| **C-06** | `Data.guardarTodos()`, `Data.inicializar()` completados |

---

## 6. Criterios de Aceptación (Resumen)

| ID | Criterio | Regla |
|----|----------|-------|
| AC-01 | `Data.inicializar()` carga semilla si no hay flag | RN-PER-02 |
| AC-02 | `Data.inicializar()` lee localStorage si hay flag | RN-PER-03 |
| AC-03 | `Data.guardarTodos()` escribe 3 claves mínimas | RN-PER-01 |
| AC-04 | `renderCatalogo()` muestra ≥6 libros en grid | HU-07 |
| AC-05 | Búsqueda vacía → catálogo completo | RN-CAT-02 |
| AC-06 | Búsqueda "borges" → "Ficciones" | RN-CAT-01 |
| AC-07 | Búsqueda sin resultados → mensaje | RN-CAT-03 |
| AC-08 | Libro sin género → "Sin clasificar" | RN-CAT-04 |
| AC-09 | Catálogo solo desde `libros[]` memoria | RN-CAT-05 |
| AC-10 | Selects poblados dinámicamente | RN-LIB-07 |
| AC-11 | Sin `innerHTML` en renderizado | DEC-11 |
| AC-12 | Vanilla only | RN-TEC-01, DEC-16 |

---

## 7. Fuera de Alcance (Out of Scope)
- Alta de libros/clientes (C-04)
- Validaciones de formulario alta (C-04)
- Persistencia completa localStorage (C-06)
- Ventas e historial (C-05)
- Debounce en filtro (opcional, PA-12)
- Editar/eliminar registros (nunca, DEC-09)