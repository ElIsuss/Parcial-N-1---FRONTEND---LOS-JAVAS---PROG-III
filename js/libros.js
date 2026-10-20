// ========================================
// LIBROS.JS — Alta y Listado de Libros
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';
import { renderCatalogo, filtrarLibros, poblarSelectLibro } from './catalogo.js';

// ========================================
// LISTADO DE LIBROS
// ========================================

/**
 * Renderiza el listado de libros registrados en #tabla-libros.
 * Inserción segura (textContent) — NUNCA innerHTML. DEC-11
 */
export function renderListadoLibros() {
  const tbody = document.querySelector('#tabla-libros tbody');
  if (!tbody) return;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  const libros = Data.getLibros();

  if (libros.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'fila-vacia';
    const td = document.createElement('td');
    td.colSpan = 7;
    td.textContent = 'No hay libros registrados.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  libros.forEach(libro => {
    const editorial = libro.editorialId ? Data._findEditorialById(libro.editorialId) : null;
    const genero = libro.generoId ? Data._findGeneroById(libro.generoId) : null;
    const autores = (libro.autorIds || [])
      .map(id => Data._findAutorById(id)?.nombre)
      .filter(Boolean);

    const tr = document.createElement('tr');

    const celdas = [
      libro.id,
      libro.titulo,
      libro.isbn,
      editorial ? editorial.nombre : '—',
      genero ? genero.nombre : 'Sin clasificar',
      autores.length ? autores.join(', ') : '—',
      formatPriceARS(libro.precio)
    ];

    celdas.forEach(valor => {
      const td = document.createElement('td');
      td.textContent = valor;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

// ========================================
// FORMULARIO DE ALTA
// ========================================

/**
 * Muestra la lista de errores de validación cerca del formulario.
 * DEC-13, DEC-14, RN-LIB-09
 * @param {HTMLElement} contenedor
 * @param {string[]} errors
 */
function _mostrarErrores(contenedor, errors) {
  if (!contenedor) return;
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
  const lista = document.createElement('ul');
  errors.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    lista.appendChild(li);
  });
  contenedor.appendChild(lista);
  contenedor.hidden = false;
}

/**
 * Vincula el formulario de alta de libro (#form-libro).
 * RN-LIB-01..10, RN-UX-01, RN-UX-02
 */
export function bindFormLibro() {
  const form = document.getElementById('form-libro');
  const contenedorErrores = document.getElementById('errores-libro');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const autorIds = Array.from(form.querySelectorAll('input[name="autorIds"]:checked'))
      .map(cb => cb.value);

    const resultado = Data.crearLibro({
      titulo: form.elements['titulo']?.value,
      isbn: form.elements['isbn']?.value,
      precio: form.elements['precio']?.value,
      editorialId: form.elements['editorialId']?.value,
      generoId: form.elements['generoId']?.value,
      autorIds
    });

    if (!resultado.ok) {
      _mostrarErrores(contenedorErrores, resultado.errors);
      return;
    }

    if (contenedorErrores) contenedorErrores.hidden = true;
    form.reset();

    renderListadoLibros();

    // RN-LIB-07, RN-LIB-10: refrescar dependencias sin recargar
    const inputBusqueda = document.getElementById('input-busqueda');
    renderCatalogo(filtrarLibros(inputBusqueda ? inputBusqueda.value : ''));
    poblarSelectLibro(document.getElementById('venta-libro'));
  });
}
