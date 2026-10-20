// ========================================
// CATALOGO.JS — Renderizado, Filtro y Poblar Selects
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';

// ========================================
// RENDERIZADO DEL CATÁLOGO
// ========================================

/**
 * Renderiza el catálogo de libros en el contenedor grid.
 * Usa inserción segura (textContent/createTextNode) — NUNCA innerHTML. DEC-11
 * @param {Array} libros - Array de libros a renderizar
 */
export function renderCatalogo(libros) {
  const contenedor = document.getElementById('contenedor-catalogo');
  const mensajeVacio = document.getElementById('mensaje-catalogo-vacio');

  if (!contenedor || !mensajeVacio) return;

  // Limpieza segura sin innerHTML
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }

  if (!libros || libros.length === 0) {
    contenedor.hidden = true;
    mensajeVacio.hidden = false;
    return;
  }

  contenedor.hidden = false;
  mensajeVacio.hidden = true;

  libros.forEach(libro => {
    const editorial = Data.getEditoriales().find(e => e.id === libro.editorialId);
    const genero = libro.generoId ? Data.getGeneros().find(g => g.id === libro.generoId) : null;
    const autores = (libro.autorIds || [])
      .map(id => Data.getAutores().find(a => a.id === id)?.nombre)
      .filter(Boolean);

    const card = document.createElement('article');
    card.className = 'libro-card';

    // Título
    const h3 = document.createElement('h3');
    h3.textContent = libro.titulo;
    card.appendChild(h3);

    // Meta: ISBN, Editorial, Género, Autores
    const meta = document.createElement('p');
    meta.className = 'meta';
    const metaParts = [];
    metaParts.push(`ISBN: ${libro.isbn}`);
    metaParts.push(`Editorial: ${editorial?.nombre || 'Desconocida'}`);
    metaParts.push(`Género: ${genero?.nombre || 'Sin clasificar'}`);
    if (autores.length) {
      metaParts.push(`Autores: ${autores.join(', ')}`);
    }
    meta.textContent = metaParts.join(' | ');
    card.appendChild(meta);

    // Precio
    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = formatPriceARS(libro.precio);
    card.appendChild(precio);

    contenedor.appendChild(card);
  });
}

// ========================================
// FILTRADO POR TÍTULO
// ========================================

/**
 * Filtra libros por título (substring, case-insensitive, trim).
 * RN-CAT-01, RN-CAT-02
 * @param {string} termino - Término de búsqueda
 * @returns {Array} Libros filtrados
 */
export function filtrarLibros(termino) {
  const t = String(termino).trim().toLowerCase();
  if (!t) return Data.getLibros(); // RN-CAT-02: vacío → catálogo completo
  return Data.getLibros().filter(libro =>
    libro.titulo.toLowerCase().includes(t) // RN-CAT-01: substring case-insensitive
  );
}

// ========================================
// EVENTOS DE BÚSQUEDA
// ========================================

/**
 * Vincula eventos del formulario de búsqueda.
 * Event submit: preventDefault + filtrar + render
 * Event input: filtrado inmediato + mostrar/ocultar botón limpiar
 */
export function bindBusqueda() {
  const form = document.getElementById('form-busqueda');
  const input = document.getElementById('input-busqueda');
  const btnLimpiar = document.getElementById('btn-limpiar-busqueda');

  if (!form || !input || !btnLimpiar) return;

  // Submit: preventDefault + filtrar
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const resultados = filtrarLibros(input.value);
    renderCatalogo(resultados);
  });

  // Input: filtrado inmediato (PA-12: sin debounce obligatorio)
  input.addEventListener('input', () => {
    const termino = input.value;
    const resultados = filtrarLibros(termino);
    renderCatalogo(resultados);

    // Mostrar/ocultar botón limpiar
    btnLimpiar.hidden = !termino.trim();
  });

  // Click limpiar: vaciar input + catálogo completo + ocultar botón
  btnLimpiar.addEventListener('click', () => {
    input.value = '';
    renderCatalogo(Data.getLibros());
    btnLimpiar.hidden = true;
    input.focus();
  });
}

// ========================================
// POBLAR SELECTS (helpers para app.js)
// ========================================

/**
 * Limpia options de un select preservando el placeholder (primer option).
 * @param {HTMLSelectElement} selectEl
 */
function _limpiarSelect(selectEl) {
  if (!selectEl) return;
  while (selectEl.options.length > 1) {
    selectEl.remove(1);
  }
}

/**
 * Puebla select de editoriales desde Data.
 * @param {HTMLSelectElement} selectEl
 */
export function poblarSelectEditorial(selectEl) {
  if (!selectEl) return;
  _limpiarSelect(selectEl);
  Data.getEditoriales().forEach(ed => {
    const opt = document.createElement('option');
    opt.value = ed.id;
    opt.textContent = ed.nombre;
    selectEl.appendChild(opt);
  });
}

/**
 * Puebla select de géneros desde Data + opción "Sin clasificar".
 * @param {HTMLSelectElement} selectEl
 */
export function poblarSelectGenero(selectEl) {
  if (!selectEl) return;
  _limpiarSelect(selectEl);
  // Opción "Sin clasificar" ya existe en HTML (value="")
  Data.getGeneros().forEach(gen => {
    const opt = document.createElement('option');
    opt.value = gen.id;
    opt.textContent = gen.nombre;
    selectEl.appendChild(opt);
  });
}

/**
 * Puebla contenedor de autores con checkboxes.
 * @param {HTMLElement} contenedorEl
 */
export function poblarContenedorAutores(contenedorEl) {
  if (!contenedorEl) return;
  // Limpieza segura
  while (contenedorEl.firstChild) {
    contenedorEl.removeChild(contenedorEl.firstChild);
  }
  Data.getAutores().forEach(aut => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = aut.id;
    checkbox.name = 'autorIds';
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + aut.nombre));
    contenedorEl.appendChild(label);
  });
}

/**
 * Puebla select de clientes desde Data.
 * @param {HTMLSelectElement} selectEl
 */
export function poblarSelectCliente(selectEl) {
  if (!selectEl) return;
  _limpiarSelect(selectEl);
  Data.getClientes().forEach(cli => {
    const opt = document.createElement('option');
    opt.value = cli.id;
    opt.textContent = `${cli.nombreCompleto} (${cli.email})`;
    selectEl.appendChild(opt);
  });
}

/**
 * Puebla select de libros desde Data.
 * @param {HTMLSelectElement} selectEl
 */
export function poblarSelectLibro(selectEl) {
  if (!selectEl) return;
  _limpiarSelect(selectEl);
  Data.getLibros().forEach(lib => {
    const opt = document.createElement('option');
    opt.value = lib.id;
    opt.textContent = `${lib.titulo} — ${formatPriceARS(lib.precio)}`;
    selectEl.appendChild(opt);
  });
}