# Knowledge Base — Primer Parcial Frontend Programación III

> Base de conocimiento generada automáticamente desde `docs/Consigna Primer Parcial.pdf` (Modo A: ingestión silenciosa).

## Índice de Archivos Canónicos

| # | Archivo | Descripción | Líneas aprox. |
|---|---------|-------------|---------------|
| 01 | [`01_vision_y_objetivos.md`](01_vision_y_objetivos.md) | Propósito, objetivos por actor, alcance, fuera de alcance | 95 |
| 02 | [`02_descripcion_general.md`](02_descripcion_general.md) | Stack tecnológico, arquitectura general, integraciones, entidades | 145 |
| 03 | [`03_actores_y_roles.md`](03_actores_y_roles.md) | Actores, tabla permisos conceptual, rutas públicas, accesibilidad | 110 |
| 04 | [`04_modelo_de_datos.md`](04_modelo_de_datos.md) | Entidades, atributos, ERD Mermaid, datos semilla, localStorage schema | 220 |
| 05 | [`05_reglas_de_negocio.md`](05_reglas_de_negocio.md) | 48 reglas codificadas (RN-XX) por dominio + trazabilidad ejercicios | 280 |
| 06 | [`06_funcionalidades.md`](06_funcionalidades.md) | 18 historias de usuario por 6 épicas + matriz puntos (100 totales) | 240 |
| 07 | [`07_flujos_principales.md`](07_flujos_principales.md) | 7 flujos E2E (Mermaid + pasos) + casos prueba manuales | 310 |
| 08 | [`08_arquitectura_propuesta.md`](08_arquitectura_propuesta.md) | Patrones, estructura directorios, convenciones, API data.js, checklist | 350 |
| 09 | [`09_decisiones_y_supuestos.md`](09_decisiones_y_supuestos.md) | 15 decisiones (DEC-XX), 15 supuestos (SUP-XX), trazabilidad | 380 |
| 10 | [`10_preguntas_abiertas.md`](10_preguntas_abiertas.md) | 22 preguntas priorizadas (PA-XX), inconsistencias, registro respuestas | 420 |

**Total**: ~2,550 líneas de documentación estructurada.

---

## Resumen del Proyecto

| Aspecto | Detalle |
|---------|---------|
| **Materia** | Programación III — Unidad HTML, CSS y JavaScript |
| **Evaluación** | Parcial 1 (100 pts, 6 ejercicios) |
| **Dominio** | Frontend de librería: catálogo, altas (libros/clientes), ventas simuladas, historial |
| **Tecnologías** | HTML5 semántico, CSS3 (Flexbox/Grid, variables), JS ES6+ nativo, localStorage |
| **Restricciones** | Sin frameworks, librerías, CDNs, backend, BD, servidor, build tools, auth real |
| **Entregable** | Carpeta con `index.html`, `/css`, `/js`, `/assets`, `README.md` |

---

## Ejercicios y Puntaje

| Ej | Tema | Puntos | Archivos KB Relacionados |
|----|------|--------|--------------------------|
| 1 | Estructura y pantallas HTML | 20 | 01, 02, 03, 06, 07 |
| 2 | Presentación CSS y uso adaptable | 20 | 02, 03, 06, 07, 08 |
| 3 | Datos locales, catálogo y filtro | 15 | 04, 05, 06, 07 |
| 4 | Alta de libros y clientes | 15 | 04, 05, 06, 07 |
| 5 | Venta simulada e historial | 20 | 04, 05, 06, 07 |
| 6 | Persistencia, verificación, documentación | 10 | 04, 05, 06, 07, 09, 10 |
| **Total** | | **100** | |

---

## Cómo Usar Esta KB

- **Para implementar**: Seguir orden 01 → 08 (visión → arquitectura)
- **Para validar**: Usar 05 (reglas), 06 (HUs), 07 (flujos), 10 (casos prueba)
- **Para dudas**: Consultar 09 (decisiones/supuestos) y 10 (preguntas abiertas)
- **Para documentar entrega**: Usar 06 (HU-18) y 10 (PA-19 a PA-22)

---

## Generación

- **Herramienta**: `kb-creator` (Mode A: silent ingestion from `docs/`)
- **Fuente**: `docs/Consigna Primer Parcial.pdf` (6 páginas)
- **Fecha**: 2026-10-20
- **Versión**: 1.0 (inicial)