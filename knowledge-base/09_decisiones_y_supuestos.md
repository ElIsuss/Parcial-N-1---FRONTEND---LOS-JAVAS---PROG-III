# Decisiones y Supuestos

## Decisiones de Diseño (Documentadas)

| ID | Decisión | Justificación | Alternativas Consideradas |
|----|----------|---------------|---------------------------|
| **DEC-01** | **SPA con secciones ocultadas/mostradas** (una sola `index.html`) vs multi-página | - Simplicidad: un solo punto de entrada, navegación instantánea sin recarga<br>- Cumple "navegación clara entre vistas" sin complejidad de routing<br>- `file://` no permite `fetch` de HTML parciales | Multi-página (`catalogo.html`, `libros.html`, ...) con nav compartida vía include manual o duplicación |
| **DEC-02** | **Módulos ES6 (`type="module"`)** vs IIFE/Global | - Separación nativa de responsabilidades<br>- Imports/exports explícitos evitan colisiones globales<br>- Compatible con `file://` en navegadores modernos (Chrome/Edge/Firefox permiten ES modules en local con flag o servidor estático simple) | IIFE por archivo (`(function(){...})()`) exponiendo en `window.App` |
| **DEC-03** | **Repository pattern simulado en `data.js`** | - Centraliza acceso a localStorage<br>- Facilita testing y futuro reemplazo por API real<br>- API consistente: `getAll()`, `save()`, `create()`, `findById()` | Llamadas directas a `localStorage` esparcidas en cada módulo |
| **DEC-04** | **Snapshot de precio en renglón de venta (`precioUnitarioSnapshot`)** | - Requisito explícito: "el precio unitario se copia al renglón como valor histórico"<br>- Garantiza inmutabilidad del historial ante cambios de catálogo | Recalcular desde catálogo al ver historial (incumple requisito) |
| **DEC-05** | **ISBN normalizado sin espacios/guiones para comparación** | - Requisito explícito: "ISBN se compara sin espacios ni guiones"<br>- Evita falsos duplicados por formato | Validar formato estricto (ISBN-10/13 con dígito control) — fuera de alcance |
| **DEC-06** | **Email único case-insensitive + trim** | - Requisito explícito: "comparado sin espacios exteriores y sin distinguir mayúsculas de minúsculas"<br>- UX realista | Case-sensitive exacto |
| **DEC-07** | **Género opcional con opción "Sin clasificar"** | - Requisito explícito: "selector de género incluye la opción 'Sin clasificar'"<br>- Modelo: `generoId: null` | Género obligatorio; o campo libre texto |
| **DEC-08** | **Autores como multi-select (checkboxes o `<select multiple>`)** | - Requisito: "selector múltiple o controles de selección equivalentes"<br>- Mínimo 1 autor obligatorio (RN-LIB-06) | Input texto con autores separados por coma (propenso a errores) |
| **DEC-09** | **Sin edición/eliminación de registros** | - Requisito explícito: "No se exige editar ni eliminar registros"<br>- Simplifica estado y persistencia | Implementar CRUD completo (fuera de alcance) |
| **DEC-10** | **CSS Mobile-first con variables + BEM simplificado** | - Requisito: "identidad visual propia y coherente", "Flexbox o Grid", "320px y 1280px"<br>- Variables facilitan tema coherente; BEM evita especificidad | CSS-in-JS, Tailwind (prohibido: "no CDNs/frameworks"), floats |
| **DEC-11** | **Inserción de datos solo vía `textContent` / `createTextNode`** | - Prevención XSS básica (buena práctica educativa)<br>- Requisito: "datos escritos por usuarios se insertan como texto en el DOM" | `innerHTML` con sanitización manual |
| **DEC-12** | **Flag `libreria_inicializado` para semilla única** | - Requisito: "En el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales" | Verificar si `libros.length > 0` (frágil si usuario borra todo) |
| **DEC-13** | **Validaciones sincrónicas retornando `{ok, errors[]}`** | - UX inmediata sin callbacks/Promises<br>- Fácil testing unitario | Excepciones (`throw`) o callbacks |
| **DEC-14** | **Mensajes de error cerca del formulario (no `alert`)** | - Requisito: "se muestran errores cerca del formulario"<br>- Mejor UX, accesible (`aria-live`) | `alert()` / `confirm()` / toasts globales |
| **DEC-15** | **Tablas con scroll horizontal interno (`overflow-x: auto` en contenedor)** | - Requisito: "Si una tabla necesita más espacio, se desplaza dentro de su propio contenedor"<br>- Evita scroll horizontal de página completa | `table-layout: fixed` + `text-overflow: ellipsis` (pierde datos) |
| **DEC-16** | **Vanilla only — sin librerías/frameworks/CDN** | - Consigna explícita: "no se usen librerías", "todo vanilla"<br>- Entregable: archivos estáticos puros, sin `node_modules`, sin `package.json`, sin build<br>- Simplifica evaluación: abre `index.html` en navegador y funciona | Cualquier framework (React, Vue, Svelte), UI kit (Bootstrap, Tailwind), utilidad (Lodash, Axios), CDN externo |

---

## Supuestos Inferidos (No Explícitos en Consigna)

| ID | Supuesto | Impacto | Riesgo si Falso |
|----|----------|---------|-----------------|
| **SUP-01** | **Navegador moderno con soporte ES Modules, localStorage, CSS Grid/Flexbox** | Base técnica mínima | Navegadores antiguos (IE) no soportan — fuera de alcance educativo |
| **SUP-02** | **Apertura via `file://` O servidor estático simple** (sin backend) | `fetch` no funciona en `file://` → SPA con secciones ocultadas | Si se requiere multi-página real, necesitaría servidor |
| **SUP-03** | **Un solo usuario por navegador/perfil** (no multi-usuario) | localStorage no comparte datos entre perfiles | README debe documentar límite |
| **SUP-04** | **Datos ficticios; no hay seguridad real** | Validaciones solo UX; no integridad garantizada | Si se usa en producción real, falla |
| **SUP-05** | **ISBN sin dígito de control** | Normalización simple `replace(/[\s-]/g, '')` | Duplicados por typo en dígito control no detectados |
| **SUP-06** | **Precios en moneda local (ARS implícito) con 2 decimales** | `toFixed(2)` / `Intl.NumberFormat` | Si se usa otra moneda, ajustar formateo |
| **SUP-07** | **Fecha de venta = `new Date().toISOString()` al confirmar** | Timestamp preciso, ordenable | Si se requiere zona horaria específica, ajustar |
| **SUP-08** | **IDs como números autoincrementales simples** (`Date.now()` o contador) | Fácil implementación | Colisiones teóricas en alta concurrencia (no aplica) |
| **SUP-09** | **Portadas de libros opcionales; si existen, archivos locales en `/assets/images/`** | No CDN, no URLs externas | Si no hay imágenes, catálogo muestra placeholder o solo texto |
| **SUP-10** | **Evaluación en navegador del docente (Chrome/Edge/Firefox recientes)** | No polyfills necesarios | Si evalúa en entorno restringido, verificar compatibilidad |
| **SUP-11** | **Una venta = un cliente + ≥1 renglón; no carrito persistente entre sesiones** | Simplifica estado venta | Si se requiere carrito guardado, añadir `venta_en_curso` en localStorage |
| **SUP-12** | **Listado de libros en catálogo = mismo array que en vista Libros** | Single source of truth | Si se requieren vistas distintas, separar arrays |
| **SUP-13** | **Orden de listados: por ID ascendente (orden de inserción)** | Predecible, simple | Si se requiere orden alfabético, añadir sort |
| **SUP-14** | **Validación email: regex básica (no RFC 5322 completa)** | Suficiente para ejercicio | Emails válidos complejos rechazados (raro en datos ficticios) |
| **SUP-15** | **Cantidad en venta: entero positivo (`Number.isInteger`)** | Requisito: "cantidad entera mayor que cero" | Decimales rechazados |

---

## Decisiones Técnicas de Implementación (Detalle)

### Generación de IDs
```javascript
// utils.js
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
// O simple contador en localStorage: 'libreria_next_id_libro'
```

### Normalización ISBN
```javascript
// utils.js
export function normalizeISBN(isbn) {
  return String(isbn).replace(/[\s-]/g, '').toUpperCase();
}
```

### Formateo Precio (ARS)
```javascript
// utils.js
export function formatPrice(amount) {
  return new Intl.NumberFormat('es-AR', { 
    style: 'currency', 
    currency: 'ARS', 
    minimumFractionDigits: 2 
  }).format(amount);
}
// O simple: `$${Number(amount).toFixed(2).replace('.', ',')}`
```

### Validación Email
```javascript
// utils.js
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}
```

### Debounce Búsqueda
```javascript
// utils.js
export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```

---

## Trazabilidad Decisiones → Reglas → Ejercicios

| Decisión | Reglas Afectadas | Ejercicios |
|----------|------------------|------------|
| DEC-01 (SPA) | RN-UX-05 | 1, 2 |
| DEC-02 (ES Modules) | RN-UX-05 | 1, 3, 4, 5, 6 |
| DEC-03 (Repository) | RN-PER-01 a 05 | 3, 4, 5, 6 |
| DEC-04 (Snapshot precio) | RN-VTA-08, RN-HIS-03 | 5 |
| DEC-05 (ISBN normalizado) | RN-LIB-02, RN-LIB-08 | 4 |
| DEC-06 (Email unique CI) | RN-CLI-03 | 4 |
| DEC-07 (Género opcional) | RN-LIB-05, RN-CAT-04 | 1, 3, 4 |
| DEC-08 (Multi-select autores) | RN-LIB-06 | 4 |
| DEC-09 (Sin CRUD completo) | RN-LIB-10, RN-CLI-05, RN-VTA-13 | 4, 5 |
| DEC-10 (CSS Mobile-first) | RN-UX-03, RN-UX-04 | 2 |
| DEC-11 (textContent only) | RN-UX-05 (seguridad) | 3, 4, 5 |
| DEC-12 (Flag inicializado) | RN-PER-02, RN-PER-03 | 6 |
| DEC-13 (Validaciones sync) | RN-LIB-09, RN-CLI-05, RN-VTA-10 | 4, 5 |
| DEC-14 (Errores cerca form) | RN-LIB-09, RN-CLI-05, RN-VTA-10 | 4, 5 |
| DEC-15 (Table scroll interno) | RN-UX-04 | 2 |
| DEC-16 (Vanilla only) | RN-TEC-01, RN-TEC-02 | 1-6 (todos) |