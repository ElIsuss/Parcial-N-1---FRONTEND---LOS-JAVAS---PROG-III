## Por qué

Este change implementa el **Ejercicio 6: Persistencia, verificación y documentación** del trabajo práctico. Completar la persistencia en localStorage para libros, clientes y ventas (garantizando carga única de semilla y recuperación sin duplicados), validar todos los casos manuales de la consigna (7 casos de prueba), y documentar todo en un README.md completo con limitaciones de localStorage y resultados de pruebas.

## Qué cambia

- **Persistencia completa**: Verificar y completar `js/data.js` para asegurar que `guardarTodos()` e `inicializar()` cumplen RN-PER-01 a RN-PER-05 (claves `libreria_libros`, `libreria_clientes`, `libreria_ventas`, flag `libreria_inicializado`, sin duplicados al recargar).
- **Validaciones de integridad**: Confirmar que ISBN duplicado, email inválido/duplicado (case-insensitive), cantidades inválidas y libros repetidos en venta se rechazan correctamente (RN-LIB-02, RN-LIB-08, RN-CLI-02, RN-CLI-03, RN-VTA-03, RN-VTA-04, RN-VTA-05).
- **Snapshot de precios históricos**: Verificar que ventas confirmadas conservan `precioUnitarioSnapshot`, subtotales y total aunque el catálogo cambie luego (RN-VTA-08, RN-HIS-03).
- **README.md completo**: Autores, pasos de apertura, navegación, funcionalidades, ubicación de datos, límites de localStorage (navegador/perfil/ubicación), tabla de 7 casos manuales con resultados esperados y reales, procedencia de imágenes.
- **Ejecución y documentación de 7 casos manuales**: Probar cada caso en navegador (320px y 1280px, navegación teclado) y registrar resultado real (aprobado/fallido/pendiente).

## Capacidades

### Nuevas capacidades
- `persistencia-verificacion-documentacion`: Persistencia localStorage completa, verificación de 7 casos manuales, y documentación en README.

### Capacidades modificadas
- `data-catalogo-filtro`: Completar comportamiento de persistencia (RN-PER-02, RN-PER-03) — ya existe `inicializar()` y `guardarTodos()` pero debe verificarse contra todos los casos de Flujo 6 y 7.
- `altas-libros-clientes-listados`: Verificar validaciones de unicidad ISBN/email y actualización reactiva de selectores tras persistencia.
- `venta-simulada-historial-snapshot`: Verificar snapshot de precios e inmutabilidad del historial tras recarga y cambio de catálogo.

## Impacto

- **Código**: `js/data.js` (verificación/completitud de persistencia), `README.md` (nuevo archivo).
- **Tests**: 7 casos manuales documentados con resultados reales en README.
- **Documentación**: README.md cubre todos los requisitos de HU-18.
- **Dependencias**: Requiere C-05 completado (ventas/historial implementados) para verificar casos 5, 6, 7.