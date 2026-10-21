## Contexto

El proyecto ya tiene implementados C-01 a C-03 (estructura, CSS, datos/catálogo/filtro) y C-04 (altas/listados) en código aunque C-04 figura como pendiente en CHANGES.md. El archivo `js/data.js` ya contiene `inicializar()`, `guardarTodos()`, `crearLibro()`, `crearCliente()`, y el stub de `crearVenta()`. Los módulos `libros.js`, `clientes.js`, `catalogo.js`, `nav.js`, `app.js` funcionan. Falta C-05 (`ventas.js`, `historial.js`) y este C-06 (completar persistencia, verificar 7 casos, README).

El stack es vanilla HTML/CSS/JS (ES Modules), sin build, sin npm. localStorage es el único almacenamiento. La arquitectura usa repository pattern en `data.js` con getters de solo lectura y mutaciones sincrónicas `{ok, errors[]}`.

## Objetivos / No objetivos

**Objetivos:**
- Verificar y completar la persistencia en `js/data.js` para cumplir RN-PER-01 a RN-PER-05
- Asegurar que las validaciones de ISBN/email/cantidad/duplicados funcionan correctamente tras recarga
- Confirmar snapshot de precios inmutable en ventas (requiere C-05 implementado)
- Crear `README.md` completo con todas las secciones requeridas por HU-18
- Ejecutar y documentar los 7 casos manuales con resultados reales (no inventados)

**No objetivos:**
- Implementar `ventas.js` ni `historial.js` (corresponde a C-05)
- Cambiar la arquitectura de datos ni el patrón repository
- Agregar validación de dígito de control ISBN
- Implementar edición/eliminación de registros
- Agregar backend, autenticación, o cualquier librería externa

## Decisiones

### 1. Verificación de persistencia en `data.js` existente
**Decisión**: Revisar `Data.inicializar()` y `Data.guardarTodos()` línea por línea contra los requisitos RN-PER, y completar/ajustar solo lo que falte.
**Racional**: El código ya implementa la lógica base (flag `libreria_inicializado`, claves versionadas, fallback a semilla). Reescribir sería duplicar trabajo y arriesgar regresiones.
**Alternativa**: Reescribir todo el módulo desde cero — descartada por riesgo y tiempo.

### 2. Claves localStorage para editoriales/géneros/autores
**Decisión**: Mantener las claves opcionales `libreria_editoriales`, `libreria_generos`, `libreria_autores` en `guardarTodos()` e `inicializar()` (ya presentes en código actual).
**Racional**: RN-PER-04 dice "opcional pero recomendado para consistencia de selectores". Los selectores se poblan desde estos arrays; si no persisten, se pierde consistencia si alguien los modificara en futuro.
**Alternativa**: No persistirlos y siempre usar semilla — más simple pero rompe consistencia si se editan.

### 3. Snapshot de precios en `crearVenta()`
**Decisión**: Implementar `Data.crearVenta()` copiando `libro.precio` → `precioUnitarioSnapshot` en cada renglón, guardando también `titulo` e `isbn` descriptivos. El total y subtotales se calculan con 2 decimales usando `Number(...).toFixed(2)` o aritmética de centavos.
**Racional**: RN-VTA-08/09 y RN-HIS-03 exigen inmutabilidad histórica. Copiar el precio al confirmar es la única forma correcta.
**Alternativa**: Guardar referencia a libro y leer precio al mostrar historial — descartada por violar requisito explícito.

### 4. Validación de duplicados en venta (RN-VTA-05)
**Decisión**: En el composer de venta (C-05), al agregar renglón, buscar por `libroId` en el array temporal; si existe, incrementar `cantidad` del renglón existente y recalcular subtotal; NO agregar segundo renglón.
**Racional**: La consigna dice "se modifica la cantidad del renglón existente O se informa el duplicado". Modificar cantidad es mejor UX.
**Alternativa**: Mostrar error y no modificar — peor UX, descartada.

### 5. Formato de fecha legible en historial
**Decisión**: Usar `new Date(fechaISO).toLocaleString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })` → ej. "15/10/2026, 14:30".
**Racional**: PA-06 en preguntas abiertas; locale es-AR coincide con moneda ARS.
**Alternativa**: ISO corto (`yyyy-mm-dd hh:mm`) — menos legible para usuario local.

### 6. Estructura del README.md
**Decisión**: Markdown GFM con tablas pipe. Secciones obligatorias en orden: Autores, Apertura, Navegación, Funcionalidades, Datos iniciales, Límites localStorage, Tabla 7 casos, Imágenes.
**Racional**: PA-16; formato estándar, legible en GitHub y visores markdown.
**Alternativa**: HTML — no pedido, menos portable.

### 7. Ejecución de casos manuales
**Decisión**: Probar cada caso en navegador (Chrome/Edge/Firefox) a 320px (device toolbar) y 1280px, navegando solo con Tab/Enter/Esc. Registrar resultado en tabla README como "Aprobado" / "Fallido: <detalle>" / "Pendiente".
**Racional**: La consigna exige verificación docente guiada; el README debe reflejar resultados reales.
**Alternativa**: Automatizar con Playwright/Cypress — fuera de alcance (no librerías, no build).

## Riesgos / Compensaciones

| Riesgo | Mitigación |
|--------|------------|
| `crearVenta()` no existe aún (C-05 pendiente) → no se puede verificar snapshot ni casos 5-6 | Documentar en README que casos 5-6 requieren C-05; marcarlos "Pendiente (C-05 no implementado)" si no se puede probar |
| localStorage falla en modo privado / cuota excedida / `file://` en algunos navegadores | `try/catch` en `guardarTodos()` e `inicializar()` ya existe; logging en consola; app sigue en memoria |
| Normalización ISBN/email inconsistente entre creación y validación | `normalizeISBN` e `isValidEmail` son funciones puras en `utils.js` usadas tanto en `data.js` como en formularios; single source of truth |
| IDs generados con `generateId()` colisionan (probabilidad muy baja) | Loop `while (_findById(id)) id = generateId()` en `crearLibro`/`crearCliente` ya implementado |
| Selectores de venta no se actualizan tras recarga si `poblarSelectLibro/Cliente` no se llama en `app.js` | `app.js` ya llama `poblarSelectLibro` y `poblarSelectCliente` en bootstrap tras `Data.inicializar()` |
| README no refleja resultados reales si no se ejecutan pruebas | Ejecutar casos manuales ANTES de escribir tabla; registrar exactamente lo observado |

## Plan de migración

No aplica migración de datos (localStorage es por navegador/perfil). Pasos de despliegue:
1. Verificar/completar `js/data.js` (persistencia y `crearVenta`)
2. Implementar C-05 (`ventas.js`, `historial.js`) — prerequisito para casos 5-6
3. Crear `README.md` con estructura completa
4. Ejecutar 7 casos manuales en navegador (320px y 1280px, teclado)
5. Actualizar tabla de casos en README con resultados reales
6. Verificar que `index.html` abre directo via `file://` y funciona sin servidor

Rollback: N/A (archivos estáticos; si algo falla, se corrige y se recarga).

## Preguntas abiertas

- Ninguna: las decisiones técnicas están resueltas en DEC-01 a DEC-16 y SUP-01 a SUP-15. La única dependencia externa es C-05 completado para verificar casos 5 y 6 completamente.