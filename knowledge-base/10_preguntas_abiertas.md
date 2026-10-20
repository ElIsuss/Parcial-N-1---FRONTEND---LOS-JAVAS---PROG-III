# Preguntas Abiertas

> Inconsistencias detectadas, ambigüedades y preguntas priorizadas para resolver con el docente o durante la implementación.

## Prioridad Alta (Bloqueantes / Afectan Alcance)

### PA-01: ¿SPA (secciones) o Multi-página (archivos .html separados)?
**Contexto**: Consigna dice "Se permite usar varias páginas o secciones de una misma página, siempre que exista navegación clara".
**Impacto**: 
- SPA: Más simple, navegación instantánea, funciona en `file://` sin servidor.
- Multi-página: Requiere duplicar nav/header o include manual; `fetch` no funciona en `file://`.
**Decisión Tentativa**: SPA (DEC-01). **Confirmar con docente** si tiene preferencia.

### PA-02: ¿Módulos ES6 (`<script type="module">`) permitidos en evaluación?
**Contexto**: `file://` bloquea ES Modules en Chrome/Edge por CORS (requiere `--allow-file-access-from-files` o servidor local).
**Impacto**: 
- Si no permitidos → IIFE + `window.App` namespace.
- Si se usa servidor estático simple (`npx serve`, `python -m http.server`) → ES Modules OK.
**Pregunta**: ¿El docente abre con `file://` directo o con servidor local?

### PA-03: ¿Validación de formato ISBN estricta (ISBN-10/ISBN-13 con dígito de control)?
**Contexto**: Consigna: "Para este parcial, el ISBN se compara sin espacios ni guiones; no se requiere implementar su dígito de control".
**Interpretación**: Solo normalización + unicidad. **Confirmar** que no se espera regex de formato (ej: `^\d{10}$|^\d{13}$`).

### PA-04: ¿Regex de email "básica" es suficiente o se espera RFC 5322?
**Contexto**: "email tenga un formato válido" — sin especificar nivel.
**Decisión Tentativa**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (básica). **Confirmar** si se rechaza `usuario@dominio` (sin TLD) o `usuario@sub.dominio.tld`.

### PA-05: ¿Cómo se identifica "libro repetido en la misma venta"?
**Contexto**: "No se admiten libros repetidos dentro de la misma venta: se modifica la cantidad del renglón existente o se informa el duplicado".
**Ambigüedad**: ¿Por `libroId` (PK) o por ISBN? **Asumido**: `libroId` (PK estable). Confirmar.

---

## Prioridad Media (Afectan UX / Detalles de Implementación)

### PA-06: ¿Formato de fecha legible en historial?
**Contexto**: Consigna muestra "fecha" en listado y detalle. No especifica formato.
**Opciones**: 
- `dd/mm/yyyy hh:mm` (locale es-AR)
- `yyyy-mm-dd hh:mm` (ISO corto)
- `toLocaleString('es-AR')`
**Decisión Tentativa**: `new Date(fecha).toLocaleString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })`.

### PA-07: ¿Orden de listados (catálogo, libros, clientes, historial)?
**Contexto**: No especificado.
**Opciones**: 
- Por ID ascendente (orden inserción)
- Alfabético por título/nombre
- Más recientes primero (historial)
**Decisión Tentativa**: ID ascendente (SUP-13). Historial: más reciente primero.

### PA-08: ¿Placeholder para libros sin portada en catálogo?
**Contexto**: "Las imágenes informativas tienen texto alternativo; las decorativas no repiten información innecesaria".
**Pregunta**: ¿Se espera imagen por defecto (placeholder SVG) o solo texto? ¿Dónde conseguir portadas? (Datos ficticios → probablemente no hay imágenes reales).

### PA-09: ¿Mensajes de éxito/error: toast global, inline cerca del formulario, o ambos?
**Contexto**: "se muestran errores cerca del formulario y solo se agrega el registro si todas las comprobaciones pasan", "muestra un mensaje de resultado".
**Decisión Tentativa**: Inline (debajo del formulario) + `aria-live="polite"`. Toast global opcional para confirmaciones de venta.

### PA-10: ¿Selector de autores: `<select multiple>` o checkboxes?
**Contexto**: "autores mediante un selector múltiple o controles de selección equivalentes".
**Consideraciones**: 
- `<select multiple>`: Nativo, pero UX pobre en móvil (requiere Ctrl/Cmd click)
- Checkboxes: Mejor UX, accesible, más HTML
**Decisión Tentativa**: Checkboxes con label cada uno (mejor accesibilidad móvil).

### PA-11: ¿Persistencia de editoriales, géneros, autores en localStorage?
**Contexto**: Consigna menciona localStorage para "libros, clientes y ventas". No menciona catálogos de apoyo.
**Impacto**: Si no se persisten, selectores pierden opciones añadidas (aunque consigna dice "no se requiere administrar altas de editoriales, géneros o autores").
**Decisión Tentativa**: Persistirlos también (bajo claves `libreria_editoriales`, etc.) para consistencia si se editaran en futuro.

### PA-12: ¿Debounce en filtro de catálogo?
**Contexto**: "El filtro por título ignora diferencias... busca coincidencias parciales".
**Pregunta**: ¿Filtrado en cada `input` (inmediato) o con debounce (150ms)?
**Decisión Tentativa**: Inmediato (arrays pequeños ≥6 libros). Debounce solo si performance lo requiere.

---

## Prioridad Baja (Detalles Cosméticos / Extensiones)

### PA-13: ¿Tema de colores / identidad visual específica?
**Contexto**: "Se define una identidad visual propia y coherente: colores, tipografía, espaciado, tarjetas, formularios y botones".
**Libertad**: Total. **Sugerencia**: Paleta profesional (azul/gris) o temática librería (marrón/beige/verde).

### PA-14: ¿Tipografía: sistema (`system-ui`) o fuente local personalizada?
**Contexto**: "tipografía" en identidad visual. Sin CDN → fuente local (woff2) o `system-ui`.
**Decisión Tentativa**: `font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;` (cero dependencias, buen rendering).

### PA-15: ¿Animaciones/transiciones CSS requeridas?
**Contexto**: No mencionado. "Coherencia y organización: 8 pts; adaptaci: 8 pts; accesibilidad básica: 4 pts".
**Decisión Tentativa**: Transiciones sutiles (`transition: 0.2s ease`) en botones, cards, mensajes. Sin animaciones complejas.

### PA-16: ¿README: formato Markdown con tablas GFM o HTML?
**Contexto**: "README.md". Tabla de casos manuales en consigna usa formato tabla.
**Decisión Tentativa**: Markdown GFM (GitHub Flavored) con tablas pipe `|`.

### PA-17: ¿Imágenes ajenas: se usan placeholders (via.placeholder.com) o archivos locales?
**Contexto**: "procedencia de imágenes ajenas, si existen". Placeholders externos = CDN/red → ¿cuenta como "CDN prohibido"?
**Decisión Tentativa**: SVGs inline o archivos locales generados. Sin URLs externas.

### PA-18: ¿Manejo de acentos/ñ en normalización ISBN y email?
**Contexto**: ISBN solo dígitos/guiones/espacios. Email: dominio puede tener IDN (acentos).
**Decisión Tentativa**: ISBN: solo ASCII. Email: validar formato ASCII; dominios IDN fuera de alcance.

---

## Preguntas sobre Evaluación / Entrega

### PA-19: ¿Canal y formato de entrega exacto?
**Contexto**: "El docente comunica por separado las fechas, el canal de entrega y la modalidad de trabajo".
**Pendiente**: Carpeta comprimida (.zip) vs repositorio Git vs Classroom/Drive.

### PA-20: ¿Modalidad de trabajo: individual o grupal?
**Contexto**: "identifica a quienes realizan el trabajo" (plural en README).
**Pregunta**: ¿Grupos de cuántos? ¿Roles definidos?

### PA-21: ¿Prueba de precio histórico: se hace en la defensa oral o automática?
**Contexto**: "La comprobación del precio histórico se realiza de forma guiada por el docente en una copia del proyecto y con datos de prueba".
**Implicación**: Código debe permitir inspección fácil en DevTools (claves localStorage claras, estructura predecible).

### PA-22: ¿Se evalúa código (legibilidad, nombres, funciones acotadas) además de funcionamiento?
**Contexto**: "Se valora código legible, nombres comprensibles, funciones acotadas y separación entre estructura, estilos y comportamiento".
**Confirmar**: Peso relativo en rúbrica (¿parte de los 100 pts o criterio cualitativo?).

---

## Registro de Respuestas (Para Completar Durante Implementación)

| Pregunta | Respuesta | Fuente | Fecha |
|----------|-----------|--------|-------|
| PA-01 | [Pendiente] | — | — |
| PA-02 | [Pendiente] | — | — |
| PA-03 | [Pendiente] | — | — |
| PA-04 | [Pendiente] | — | — |
| PA-05 | [Pendiente] | — | — |
| PA-06 | [Pendiente] | — | — |
| PA-07 | [Pendiente] | — | — |
| PA-08 | [Pendiente] | — | — |
| PA-09 | [Pendiente] | — | — |
| PA-10 | [Pendiente] | — | — |
| PA-11 | [Pendiente] | — | — |
| PA-12 | [Pendiente] | — | — |
| PA-13 | [Pendiente] | — | — |
| PA-14 | [Pendiente] | — | — |
| PA-15 | [Pendiente] | — | — |
| PA-16 | [Pendiente] | — | — |
| PA-17 | [Pendiente] | — | — |
| PA-18 | [Pendiente] | — | — |
| PA-19 | [Pendiente] | — | — |
| PA-20 | [Pendiente] | — | — |
| PA-21 | [Pendiente] | — | — |
| PA-22 | [Pendiente] | — | — |

---

## Inconsistencias Detectadas en Consigna

| ID | Inconsistencia | Detalle |
|----|----------------|---------|
| **INC-01** | "No se requiere un inicio de sesión real" pero "Ventas: selección de cliente" | Implica que el "empleado" selecciona cliente de una lista, no que el cliente se loguea. Consistencia OK si se entiende como POS. |
| **INC-02** | "No se utilizan librerías, frameworks ni CDNs de CSS o JavaScript" vs "imágenes informativas tienen texto alternativo" | Imágenes locales OK. Placeholders externos (via.placeholder.com) técnicamente son CDN/red. |
| **INC-03** | "Se utilizan únicamente HTML, CSS y JavaScript nativos" pero "Se permite usar varias páginas" | Multi-página nativo OK. SPA nativo OK. Ambos válidos. |
| **INC-04** | Ejercicio 6: "La comprobación del precio histórico se realiza de forma guiada por el docente en una copia del proyecto" | Implica que el docente tiene acceso a modificar localStorage manualmente. Código no necesita UI para editar precios. |
| **INC-05** | "El ISBN se compara sin espacios ni guiones" pero no dice si se almacenan normalizados o con formato original | **Decisión**: Guardar original (para mostrar), comparar normalizado. |
| **INC-06** | "Las opciones se generan a partir de los datos locales: editorial y género mediante selectores, y autores mediante un selector múltiple" | No dice si selectores se actualizan dinámicamente al agregar editoriales/géneros/autores (aunque "no se requiere administrar altas"). |
| **INC-07** | "No se requiere traer datos con fetch ni administrar altas, bajas y modificaciones de editoriales, géneros o autores" | Pero selectores deben reflejar datos locales. Si se persisten en localStorage, están disponibles. |