## 1. Verificación y completitud de persistencia en data.js

- [x] 1.1 Revisar `Data.inicializar()` contra RN-PER-02/03: flag `libreria_inicializado`, carga semilla solo si no existe, recuperación de claves `libreria_libros`, `libreria_clientes`, `libreria_ventas`, `libreria_editoriales`, `libreria_generos`, `libreria_autores`, fallback a semilla si parseo falla o arrays vacíos
- [x] 1.2 Revisar `Data.guardarTodos()` contra RN-PER-01/04: escribe las 6 claves, `try/catch` con logging sin excepción propagada
- [x] 1.3 Verificar que `Data.crearLibro()` y `Data.crearCliente()` invocan `guardarTodos()` tras alta exitosa (ya implementado)
- [x] 1.4 Implementar `Data.crearVenta(venta)` con validaciones RN-VTA-01 a RN-VTA-10, snapshot de precios (`precioUnitarioSnapshot`), cálculo subtotales (2 dec) y total (2 dec), guardado en `ventas[]` + `guardarTodos()`, retorno `{ok, errors[], venta?}`
- [x] 1.5 Verificar IDs estables con `generateId()` y loop anti-colisión en `crearVenta` (igual que `crearLibro`/`crearCliente`)
- [x] 1.6 Probar persistencia: abrir `index.html` limpio → verificar semilla + flag; recargar → verificar sin duplicados; alta libro/cliente → recargar → verificar persistencia; venta → recargar → verificar historial con snapshot

## 2. Validaciones de integridad (ISBN, email, cantidad, duplicados en venta)

- [x] 2.1 Verificar `normalizeISBN()` en `utils.js`: `replace(/[\s-]/g,'').toUpperCase()` usado en `_isbnExists` y validación
- [x] 2.2 Verificar `_isbnExists(normalizedIsbn, excludeId)` compara normalizado y excluye ID actual (para futuras ediciones)
- [x] 2.3 Verificar `_emailExists(normalizedEmail, excludeId)` usa `trim().toLowerCase()` tanto al guardar como al validar
- [x] 2.4 Verificar `isValidEmail()` regex básica `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` con `trim()`
- [x] 2.5 En `crearVenta()`: validar cliente obligatorio (RN-VTA-01), ≥1 renglón (RN-VTA-02), cantidad entero >0 (RN-VTA-03), libroId existe (RN-VTA-04), no duplicado por libroId (RN-VTA-05: modificar cantidad existente)
- [x] 2.6 Probar casos: ISBN duplicado con formato distinto → rechazo; email duplicado solo por mayúsculas → rechazo; email formato inválido → rechazo; cantidad 0/-1/1.5 → rechazo; libro inexistente → rechazo; libro repetido en venta → incrementa cantidad, no crea renglón extra

## 3. Snapshot de precios históricos inmutable

- [x] 3.1 En `crearVenta()`: cada renglón guarda `precioUnitarioSnapshot: libro.precio`, `titulo`, `isbn`, `cantidad`, `subtotal = cantidad * precioUnitarioSnapshot` (2 decimales)
- [x] 3.2 Verificar que `Data.getVentas()` retorna ventas con renglones conteniendo snapshot (no referencia a libro actual)
- [x] 3.3 Probar inmutabilidad: confirmar venta → editar `localStorage.libreria_libros` cambiando precio → recargar → abrir historial → verificar precio unitario, subtotales, total inalterados
- [x] 3.4 Verificar que detalle de venta (modal) usa exclusivamente `precioUnitarioSnapshot`, `subtotal`, `titulo`, `isbn` del renglón guardado

## 4. README.md completo

- [x] 4.1 Crear `README.md` en raíz del proyecto con estructura:
  - **Autores**: nombres de quienes realizan el trabajo
  - **Apertura**: pasos para abrir `index.html` sin npm (doble click o servidor estático simple)
  - **Navegación**: explicación de las 5 vistas y nav
  - **Funcionalidades**: tabla con implementadas (✓) y pendientes (✗) por ejercicio
  - **Datos iniciales**: ubicación en `js/data.js` → `SEED` y `cargarSemilla()`; claves localStorage
  - **Límites localStorage**: depende de navegador, perfil, ubicación (`file://` vs servidor); no comparte entre usuarios; modo privado puede fallar; cuota ~5MB
  - **Tabla 7 casos manuales**: columnas "Caso", "Resultado Esperado", "Resultado Real" (Aprobado/Fallido:detalle/Pendiente)
  - **Imágenes ajenas**: procedencia si las hay (placeholder SVG inline o "Ninguna")
- [x] 4.2 Usar Markdown GFM con tablas pipe; lenguaje español; formato limpio y legible

## 5. Ejecución y documentación de 7 casos manuales

- [x] 5.1 **Caso 1 - Búsqueda**: Probar "FICCIONES" (mayúsculas) → coincidencias; vaciar input → catálogo completo; "xyz123" (inexistente) → mensaje vacío. Registrar resultado.
- [x] 5.2 **Caso 2 - Alta libro**: Intentar ISBN semilla (`978-987-1234-56-7`) → error duplicado; ISBN nuevo válido (`978-987-0000-00-1`) → aparece en catálogo y `#venta-libro`. Registrar resultado.
- [x] 5.3 **Caso 3 - Alta cliente**: Email `invalido` → error formato; `JUAN@EMAIL.COM` (duplicado case-insensitive) → error duplicado; `nuevo@test.com` → en listado y `#venta-cliente`. Registrar resultado.
- [x] 5.4 **Caso 4 - Validaciones venta**: Sin cliente → error; cantidad 0/-1/1.5 → error; mismo libro dos veces → no renglón duplicado, cantidad se modifica (ej. 2). Registrar resultado.
- [x] 5.5 **Caso 5 - Venta válida**: Ficciones 2×$1.500 + Rayuela 1×$2.200 → subtotales $3.000, $2.200, total $5.200; venta en historial con esos valores. Registrar resultado.
- [x] 5.6 **Caso 6 - Precio histórico**: Venta confirmada (Ficciones 2×$1.500 + Rayuela 1×$2.200) → editar `localStorage.libreria_libros` precio Ficciones ($1.500→$9.999) → recargar → historial muestra valores originales ($1.500/$3.000/$2.200/$5.200). Registrar resultado.
- [x] 5.7 **Caso 7 - Recarga + navegación teclado + responsive**: Tras altas y venta, recargar → datos sin duplicados (libro, cliente, venta); navegar solo con Tab/Enter/Esc entre vistas, formularios, tablas a 320px y 1280px → foco visible, sin scroll horizontal de página, tablas con scroll interno. Registrar resultado.
- [x] 5.8 Actualizar tabla en README con resultados reales de cada caso (no inventados)

## 6. Verificación final y cierre

- [x] 6.1 Ejecutar `index.html` en `file://` y en servidor estático (`python -m http.server`) → verificar que funciona en ambos
- [x] 6.2 Verificar navegación teclado completa: Tab/Shift+Tab, Enter en botones/links, Esc cierra modal
- [x] 6.3 Verificar 320px (Chrome DevTools device toolbar) y 1280px: sin scroll horizontal de página, tablas con `overflow-x: auto`, textos legibles, controles usables
- [x] 6.4 Confirmar que todas las claves localStorage esperadas existen tras uso: `libreria_libros`, `libreria_clientes`, `libreria_ventas`, `libreria_editoriales`, `libreria_generos`, `libreria_autores`, `libreria_inicializado`
- [x] 6.5 Marcar C-06 como `[x]` en `CHANGES.md`
- [x] 6.6 Ejecutar `/opsx-archive c-06-persistencia-localstorage-readme-casos` para archivar el change