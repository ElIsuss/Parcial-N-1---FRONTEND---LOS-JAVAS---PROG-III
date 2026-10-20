# Arquitectura Propuesta

## Patrones de Diseño

### 1. SPA con Secciones (Single Page Application)
- **Un único `index.html`** como entry point
- 5 `<section class="vista" id="vista-*">` ocultadas/mostradas via clase `.activa`
- Navegación instantánea sin recarga, compatible con `file://`
- JS centralizado en `nav.js`: `mostrarVista(vistaId)` togglea `.activa` y actualiza `aria-current`

### 2. Separación de Responsabilidades (SoC)
| Capa | Archivos | Responsabilidad |
|------|----------|-----------------|
| **Estructura** | `index.html` | Solo HTML semántico, hooks (`id`, `data-*`, `class`) |
| **Presentación** | `/css/*.css` | Variables, layout, componentes, tablas, formularios, mensajes |
| **Comportamiento** | `/js/*.js` | Lógica de negocio, DOM manipulation, eventos, localStorage |

**Regla**: Cero estilos inline, cero JS inline, cero HTML en JS (solo `textContent`/`createTextNode`)

### 3. Repository Pattern Simulado (`data.js`)
```javascript
// API consistente para todos los módulos
const Data = {
  // Estado en memoria (arrays)
  libros: [], editoriales: [], generos: [], autores: [], clientes: [], ventas: [],

  // Inicialización
  inicializar() { /* carga semilla o localStorage */ },
  cargarSemilla() { /* escribe datos mínimos + flag */ },
  guardarTodos() { /* escribe 3 claves principales en localStorage */ },

  // Getters (read-only para vistas)
  getLibros() { return [...this.libros]; },
  getEditoriales() { return [...this.editoriales]; },
  // ... etc.

  // Mutaciones (solo vía métodos)
  crearLibro(libro) { /* validación + push + save */ },
  crearCliente(cliente) { /* validación + push + save */ },
  crearVenta(venta) { /* validación + push + save */ },
};
```
- Centraliza acceso a localStorage
- Facilita testing y futuro reemplazo por API real
- API consistente: `getAll()`, `save()`, `create()`, `findById()`

### 4. Módulos ES6 (`type="module"`)
- `<script type="module" src="js/app.js">` en `index.html`
- Imports/exports explícitos evitan colisiones globales
- `app.js` → importa `nav.js`, `data.js` → bootstrap
- Cada vista tiene su módulo: `catalogo.js`, `libros.js`, `clientes.js`, `ventas.js`, `historial.js`
- Comparten `data.js` y `utils.js`

### 5. Validaciones Sincrónicas (DEC-13)
```javascript
// Patrón uniforme en todos los formularios
function validarFormulario(datos) {
  const errors = [];
  if (!datos.titulo?.trim()) errors.push("Título requerido");
  // ...
  return { ok: errors.length === 0, errors };
}
```
- Retornan `{ok: boolean, errors: string[]}`
- UX inmediata sin callbacks/Promises
- Fácil testing unitario

### 5. Inserción Segura (DEC-11)
- **NUNCA** `innerHTML` con datos de usuario
- Solo `textContent`, `createTextNode`, `setAttribute`
- Prevención XSS básica (buena práctica educativa)

## Estructura de Directorios

```
/ (raíz)
├── index.html                    # Entry point SPA
├── CHANGES.md                    # Roadmap de changes
├── AGENTS.md                     # Instrucciones para agentes
├── CLAUDE.md                     # Copia de AGENTS.md
├── knowledge-base/               # 10 archivos canónicos + README
│   ├── 01_vision_y_objetivos.md
│   ├── 02_descripcion_general.md
│   ├── 03_actores_y_roles.md
│   ├── 04_modelo_de_datos.md
│   ├── 05_reglas_de_negocio.md
│   ├── 06_funcionalidades.md
│   ├── 07_flujos_principales.md
│   ├── 08_arquitectura_propuesta.md
│   ├── 09_decisiones_y_supuestos.md
│   ├── 10_preguntas_abiertas.md
│   └── README.md
├── .atl/
│   └── skill-registry.md         # Registry de skills (generado)
├── openspec/
│   ├── config.yaml
│   ├── specs/
│   └── changes/
│       ├── proposed/
│       └── archive/
│           └── C-01-estructura-base-navegacion/
│               ├── proposal.md
│               ├── design.md
│               └── tasks.md
├── css/
│   ├── base.css          # Reset, variables, utilidades
│   ├── layout.css        # Grid header/nav/main, .vista/.activa, responsive
│   ├── catalogo.css      # Grid tarjetas, toolbar búsqueda
│   ├── formularios.css   # Forms, botones, errores, focus states
│   └── tablas.css        # Tablas, scroll interno, modal detalle
├── js/
│   ├── app.js            # Bootstrap DOMContentLoaded
│   ├── nav.js            # mostrarVista(vistaId)
│   ├── data.js           # Repository pattern + localStorage
│   ├── utils.js          # Helpers: normalizeISBN, formatPrice, isValidEmail, generateId, debounce
│   ├── catalogo.js       # renderCatalogo, filtrarLibros, bindBusqueda
│   ├── libros.js         # bindFormLibro, renderListadoLibros
│   ├── clientes.js       # bindFormCliente, renderListadoClientes
│   ├── ventas.js         # bindFormVenta, composer, confirmar, snapshot
│   └── historial.js      # renderHistorial, modal detalle
└── assets/
    ├── images/           # Portadas locales (opcional)
    └── icons/            # SVG inline o archivos
```

## Convenciones de Código

### CSS (Mobile-First + BEM Simplificado)
```css
/* Variables globales en base.css */
:root {
  --color-primary: #2c3e50;
  --color-secondary: #34495e;
  --color-accent: #e67e22;
  --color-bg: #f8f9fa;
  --color-text: #2c3e50;
  --color-border: #dee2e6;
  --color-error: #c0392b;
  --color-success: #27ae60;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --radius: 4px;
  --transition: 0.2s ease;
}

/* Breakpoints */
@media (min-width: 320px) { /* base */ }
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1280px) { /* desktop */ }
```

```css
/* Clases BEM-ligeras reutilizables */
.btn { /* base */ }
.btn-primario { /* primary action */ }
.btn-secundario { /* secondary */ }
.form-row { display: flex; flex-direction: column; gap: var(--spacing-xs); }
.form-group { border: 1px solid var(--color-border); padding: var(--spacing-md); border-radius: var(--radius); }
.table-container { overflow-x: auto; }
.tabla-datos { width: 100%; border-collapse: collapse; }
.tabla-datos th, .tabla-datos td { padding: var(--spacing-sm); text-align: left; border-bottom: 1px solid var(--color-border); }
.fila-vacia td { text-align: center; color: #6c757d; }
.errores-formulario { color: var(--color-error); font-size: 0.875rem; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
```

### JavaScript (ES6+ Nativo)
```javascript
// Módulo típico (ej: catalogo.js)
import { Data } from './data.js';
import { normalizeISBN, formatPriceARS } from './utils.js';

export function renderCatalogo(libros) { /* ... */ }
export function filtrarLibros(termino) { /* ... */ }
export function bindBusqueda() { /* ... */ }

// En app.js (bootstrap)
import { mostrarVista } from './nav.js';
import { Data } from './data.js';
import { renderCatalogo } from './catalogo.js';
// ...

document.addEventListener('DOMContentLoaded', () => {
  Data.inicializar();
  mostrarVista('catalogo');
});
```

### Utilidades Comunes (`utils.js`)
```javascript
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function normalizeISBN(isbn) {
  return String(isbn).replace(/[\s-]/g, '').toUpperCase();
}

export function formatPriceARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```

## Variables de Entorno / Configuración
**Ninguna** — Sin backend, sin build, sin `.env`. Todo configuración en `data.js` (semilla) y CSS variables.

## Seguridad
- Sin autenticación real (ejercicio educativo)
- Validación solo cliente (UX, no integridad)
- `textContent`/`createTextNode` para inserción usuario
- localStorage aisla por origen (navegador/perfil/ubicación)

## Testing / Verificación
- **Manual**: 7 casos documentados en README (Flujo 7)
- **Automatizado**: Ninguno obligatorio (vanilla, sin test runner)
- **DevTools**: Inspección localStorage, console.log para debug

## Despliegue / Entrega
- Carpeta con archivos estáticos puros
- Apertura: doble click `index.html` O `npx serve` O `python -m http.server`
- Sin build, sin transpilación, sin dependencias