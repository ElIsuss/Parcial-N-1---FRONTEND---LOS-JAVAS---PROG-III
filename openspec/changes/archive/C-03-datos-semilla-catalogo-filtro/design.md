# Design: C-03-datos-semilla-catalogo-filtro

> Retroactivo — documenta las decisiones ya implementadas en `efe0980`.

## Context

C-01/C-02 dejaron HTML con hooks (`#contenedor-catalogo`, selects vacíos, `.fila-vacia`) y CSS estilizado, pero cero JS de dominio y cero datos. Ver proposal.md — Why.

## Goals / Non-Goals

**Goals:**
- Capa de datos única en memoria (single source of truth) con semilla y persistencia a localStorage
- Utilidades compartidas (ISBN, moneda, email, IDs) reutilizables por C-04/C-05
- Catálogo renderizado + filtro por título + selects poblados

**Non-Goals:**
- Alta/edición/borrado de registros (C-04; editar/eliminar nunca — DEC-09)
- Composición de ventas e historial (C-05)
- Persistencia verificada end-to-end y documentación (C-06)

## Decisions

1. **Repository pattern con estado privado (`_state`) y API `Data` exportada** (DEC-03). Los getters retornan copias shallow (`[...arr]`) para evitar mutaciones externas.
   *Descartado*: exports de arrays planos — permitsen mutar el estado desde cualquier módulo.

2. **Semilla con IDs pregenerados estables** (`ed1`, `lib1`, `aut1`…) (SUP-08) y flag `libreria_inicializado` (DEC-12) para no duplicar semilla al recargar. `inicializar()` es síncrono: no Promises, no throw.
   *Descartado*: `Date.now()` en semilla — IDs inestables entre sesiones romperían referencias.

3. **`inicializar()` con doble vía y fallback defensivo**: sin flag → semilla + `guardarTodos()`; con flag → parse de claves `libreria_*` con try/catch y semilla como fallback si el storage está corrupto/vacío.

4. **`normalizeISBN` = `replace(/[\s-]/g,'').toUpperCase()`** (RN-LIB-08, DEC-05) solo para comparaciones (unicidad); el ISBN se almacena y muestra tal cual. `isValidEmail` regex básica + trim (DEC-06). `generateId` = `Date.now().toString(36)` + random (DEC-08).

5. **Catálogo renderizado con limpieza por removeChild en loop y `textContent`/`createTextNode`** (DEC-11), nunca `innerHTML`. Tarjetas `<article class="libro-card">` con lookup de editorial/género/autores por `_find*ById`; género null → "Sin clasificar" (RN-CAT-04).

6. **Filtro por título: trim + lowercase + substring**, sin debounce obligatorio (PA-12); vacío retorna todo (RN-CAT-02). Eventos `submit` (preventDefault, RN-UX-01) e `input` (filtrado inmediato) + botón limpiar.

7. **Checkboxes para autores** en lugar de `<select multiple>` (DEC-08, mejor UX móvil); `poblarContenedorAutores` genera `<label><input type=checkbox name=autorIds value=id>`.

8. **Stubs de mutaciones en `data.js`** con contrato `{ok, errors[]}` desde el inicio (DEC-13), para que C-04 solo rellene el cuerpo sin tocar firmas.

9. **`js/nav.js` quedó radicado en este commit** (toggle `.activa` + `aria-current`), junto al bootstrap de `app.js`.

## Risks / Trade-offs

- [localStorage cuota o JSON corrupto] → try/catch en lectura/escritura + fallback a semilla; errores por consola
- [Getters copia shallow: objetos anidados mutables] → aceptado: patrón de solo-lectura por convención; C-05 usará `precioUnitarioSnapshot` en vez de depender de la referencia viva (DEC-04)

## Migration Plan

Sin migración: primer commit de datos. Rollback = revert de `efe0980`.

## Open Questions

Ninguna.
