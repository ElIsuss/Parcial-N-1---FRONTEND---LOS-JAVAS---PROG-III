# Descripción General

## Stack Tecnológico
| Capa | Tecnología | Versión/Detalle |
|------|------------|-----------------|
| **Marcado** | HTML5 semántico | Etiquetas: header, nav, main, section, article, table, form, label, button |
| **Estilos** | CSS3 nativo | Archivos .css externos; Flexbox/Grid; variables CSS para tema coherente |
| **Comportamiento** | JavaScript ES6+ nativo | Módulos (type="module" opcional), DOM API, EventTarget, localStorage API |
| **Almacenamiento** | localStorage (Web Storage API) | Claves: libros, clientes, ventas, (editoriales, géneros, autores opcional) |
| **Entorno de ejecución** | Navegador moderno | Sin servidor; apertura directa de `index.html` via `file://` o servidor estático simple |
| **Tooling** | Ninguno obligatorio | Editor de código + navegador; sin npm, bundlers, transpiladores |

## Arquitectura General
```
┌─────────────────────────────────────────────────────────────┐
│                      index.html (entrada)                    │
├─────────────────────────────────────────────────────────────┤
│  Header (título librería)  │  Nav (enlaces a 5 vistas)       │
├─────────────────────────────────────────────────────────────┤
│  Main: una vista activa a la vez (SPA con secciones          │
│  ocultadas/mostradas) O múltiples .html con nav compartida    │
├─────────────────────────────────────────────────────────────┤
│  /css                                                       │
│    ├── variables.css      # Paleta, tipografía, spacing     │
│    ├── layout.css         # Grid/Flex, contenedores         │
│    ├── components.css     # Tarjetas, formularios, botones  │
│    ├── tables.css         # Tablas, scroll interno          │
│    └── messages.css       # Estados vacíos, errores, éxito  │
├─────────────────────────────────────────────────────────────┤
│  /js                                                        │
│    ├── data.js            # Arrays/objetos semilla + API    │
│    │                        localStorage (CRUD simulado)    │
│    ├── catalog.js         # Render catálogo + filtro        │
│    ├── books.js           # Alta libro + listado            │
│    ├── clients.js         # Alta cliente + listado          │
│    ├── sales.js           # Composición venta + confirmación│
│    ├── history.js         # Listado + detalle historial     │
│    ├── nav.js             # Cambio de vista (SPA)           │
│    └── utils.js           # Helpers: formateo, validación   │
├─────────────────────────────────────────────────────────────┤
│  /assets                                                    │
│    ├── images/            # Portadas, decorativas (alt "")  │
│    └── icons/             # SVG inline o archivos           │
└─────────────────────────────────────────────────────────────┘
```

**Patrón**: Separación por responsabilidad (estructura / estilos / comportamiento). Cada vista tiene su módulo JS que importa `data.js` y `utils.js`. Navegación centralizada en `nav.js`.

## Integraciones Externas
| Integración | Tipo | Detalle |
|-------------|------|---------|
| **Ninguna obligatoria** | — | El enunciado prohíbe CDNs, librerías, frameworks, APIs externas |
| **Imágenes de portadas** | Opcional | Archivos locales en `/assets/images/`; referenciadas con `<img src="...">`; `alt` descriptivo o vacío si decorativa |
| **Fuentes web** | Opcional | Si se usan, deben ser archivos locales (woff2) o `font-face`; no Google Fonts vía CDN |

## Entidades de Dominio Principales
| Entidad | Atributos Clave | Relaciones |
|---------|-----------------|------------|
| **Libro** | id, título, ISBN (normalizado sin espacios/guiones), precio (>0), editorialId, generoId (opcional), autorIds[] | N:1 Editorial, N:M Autor, N:1 Género (opcional) |
| **Editorial** | id, nombre | 1:N Libro |
| **Género** | id, nombre | 1:N Libro (opcional) |
| **Autor** | id, nombre | M:N Libro |
| **Cliente** | id, nombreCompleto, email (único, case-insensitive, trim) | 1:N Venta |
| **Venta** | id, fecha (ISO), clienteId, renglones[], total | 1:N RenglónVenta, N:1 Cliente |
| **RenglónVenta** | libroId, cantidad (>0), precioUnitarioSnapshot, subtotal | N:1 Libro (precio congelado), N:1 Venta |

## Puntos de Extensión Futura (No Implementados)
- Editar/eliminar libros, clientes, ventas
- Gestión de editoriales, géneros, autores (CRUD)
- Autenticación / roles / sesiones
- Backend real + sincronización
- Reportes / exportación / impresión
- Carrito persistente entre sesiones (más allá de localStorage actual)