# Actores y Roles

## Actores del Sistema

| Actor | Descripción | Objetivos Principales |
|-------|-------------|----------------------|
| **Cliente (visitante)** | Navega el catálogo, busca libros, ve detalles | Encontrar libros, filtrar por título, ver información completa |
| **Empleado (operador)** | Gestiona libros, clientes, registra ventas, consulta historial | Alta de libros/clientes, composición de ventas, consulta de historial con precios históricos |

## Tabla de Permisos Conceptual (RBAC Simplificado)

| Acción | Cliente | Empleado |
|--------|---------|----------|
| Ver catálogo | ✅ | ✅ |
| Filtrar catálogo | ✅ | ✅ |
| Ver detalle libro | ✅ | ✅ |
| Alta libro | ❌ | ✅ |
| Listar libros | ❌ | ✅ |
| Alta cliente | ❌ | ✅ |
| Listar clientes | ❌ | ✅ |
| Componer venta | ❌ | ✅ |
| Confirmar venta | ❌ | ✅ |
| Ver historial ventas | ❌ | ✅ |
| Ver detalle venta (precio histórico) | ❌ | ✅ |

> **Nota**: No hay autenticación real ni login. La distinción de roles es **conceptual** para definir qué funcionalidades se muestran en cada vista. El "empleado" accede a las vistas de gestión (Libros, Clientes, Ventas, Historial) mediante la navegación principal.

## Rutas Públicas (Navegación Principal)

| Vista | Ruta (SPA) | Acceso |
|-------|------------|--------|
| Catálogo | `#vista-catalogo` | Público (Cliente + Empleado) |
| Libros | `#vista-libros` | Empleado |
| Clientes | `#vista-clientes` | Empleado |
| Ventas | `#vista-ventas` | Empleado |
| Historial | `#vista-historial` | Empleado |

## Accesibilidad por Rol
- **Cliente**: Navegación teclado completa en catálogo, foco visible, búsqueda accesible
- **Empleado**: Formularios con labels asociados, validaciones con mensajes de texto (no solo color), tablas navegables, modales con focus trap

## Supuestos de Autorización
- No hay backend → no hay tokens, sesiones, ni verificación real de permisos
- La UI muestra/oculta funcionalidades según la vista activa (SPA)
- En una versión real, cada endpoint validaría rol via JWT/sesión