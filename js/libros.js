// ========================================
// LIBROS.JS — Alta y Listado de Libros (Conectado a LIBRERIA-API)
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';
import { actualizarCatalogoRemoto, poblarSelectLibro } from './catalogo.js';

// Estado local de autores verificados para el formulario de alta de libro
let _autoresSeleccionados = [];

// ========================================
// LISTADO DE LIBROS
// ========================================

/**
 * Renderiza el listado de libros registrados en #tabla-libros.
 * Inserción segura (textContent) — NUNCA innerHTML.
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
    const editorialNombre = libro.editorial?.nombre
      || (libro.editorialId ? Data._findEditorialById(libro.editorialId)?.nombre : null)
      || '—';
    const generoNombre = libro.genero?.nombre
      || (libro.generoId ? Data._findGeneroById(libro.generoId)?.nombre : null)
      || 'Sin clasificar';

    const tr = document.createElement('tr');

    const celdas = [
      String(libro.id),
      libro.titulo,
      libro.isbn,
      editorialNombre,
      generoNombre,
      String(libro.stock ?? 0),
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
// GESTIÓN DE AUTORES VERIFICADOS POR ID
// ========================================

function _renderAutoresSeleccionados() {
  const contenedor = document.getElementById('contenedor-autores');
  if (!contenedor) return;

  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }

  if (_autoresSeleccionados.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'meta';
    hint.textContent = 'Ningún autor agregado todavía. Ingrese un ID de autor y presione "Verificar y agregar".';
    contenedor.appendChild(hint);
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'lista-autores-seleccionados';

  _autoresSeleccionados.forEach((item, index) => {
    item.orden = index + 1;
    const li = document.createElement('li');
    li.className = 'autor-item';

    const span = document.createElement('span');
    span.textContent = `${item.orden}. #${item.autor_id} — ${item.nombre} (${item.nacionalidad}) — Rol: ${item.rol}`;
    li.appendChild(span);

    const btnQuitar = document.createElement('button');
    btnQuitar.type = 'button';
    btnQuitar.className = 'btn btn-secundario btn-quitar-autor';
    btnQuitar.textContent = 'Quitar';
    btnQuitar.addEventListener('click', () => {
      _autoresSeleccionados.splice(index, 1);
      _renderAutoresSeleccionados();
    });
    li.appendChild(btnQuitar);

    ul.appendChild(li);
  });

  contenedor.appendChild(ul);
}

// ========================================
// FORMULARIO DE ALTA
// ========================================

function _mostrarErrores(contenedor, errors) {
  const exitoEl = document.getElementById('exito-libro');
  if (exitoEl) exitoEl.hidden = true;
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

function _mostrarExitoLibro(libro) {
  const exitoEl = document.getElementById('exito-libro');
  const contenedorErrores = document.getElementById('errores-libro');
  if (contenedorErrores) contenedorErrores.hidden = true;
  if (!exitoEl) return;
  exitoEl.textContent = `Libro #${libro.id} "${libro.titulo}" creado correctamente (201 Created).`;
  exitoEl.hidden = false;
}

/**
 * Vincula el formulario de alta de libro (#form-libro) y el verificador de autores por ID.
 */
export function bindFormLibro() {
  const form = document.getElementById('form-libro');
  const contenedorErrores = document.getElementById('errores-libro');
  const inputAutorId = document.getElementById('autor-buscar-id');
  const selectAutorRol = document.getElementById('autor-rol');
  const btnVerificarAutor = document.getElementById('btn-verificar-autor');

  if (!form) return;

  _renderAutoresSeleccionados();

  if (btnVerificarAutor && inputAutorId && selectAutorRol) {
    btnVerificarAutor.addEventListener('click', async () => {
      const idVal = inputAutorId.value;
      const rolVal = selectAutorRol.value || 'autor';

      if (!idVal) {
        _mostrarErrores(contenedorErrores, ['Ingrese un ID de autor para verificar.']);
        return;
      }

      if (_autoresSeleccionados.some(a => Number(a.autor_id) === Number(idVal))) {
        _mostrarErrores(contenedorErrores, [`El autor con ID #${idVal} ya fue agregado al libro.`]);
        return;
      }

      btnVerificarAutor.disabled = true;
      const res = await Data.fetchAutorPorId(idVal);
      btnVerificarAutor.disabled = false;

      if (!res.ok) {
        _mostrarErrores(contenedorErrores, res.errors);
        return;
      }

      if (contenedorErrores) contenedorErrores.hidden = true;

      _autoresSeleccionados.push({
        autor_id: res.autor.id,
        nombre: res.autor.nombre,
        nacionalidad: res.autor.nacionalidad,
        rol: rolVal,
        orden: _autoresSeleccionados.length + 1
      });

      inputAutorId.value = '';
      _renderAutoresSeleccionados();
    });
  }

  form.addEventListener('reset', () => {
    setTimeout(() => {
      _autoresSeleccionados = [];
      _renderAutoresSeleccionados();
      if (contenedorErrores) contenedorErrores.hidden = true;
    }, 0);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const resultado = await Data.crearLibro({
      titulo: form.elements['titulo']?.value,
      isbn: form.elements['isbn']?.value,
      precio: form.elements['precio']?.value,
      stock: form.elements['stock']?.value,
      editorialId: form.elements['editorialId']?.value,
      generoId: form.elements['generoId']?.value,
      autores: _autoresSeleccionados
    });

    if (submitBtn) submitBtn.disabled = false;

    if (!resultado.ok) {
      _mostrarErrores(contenedorErrores, resultado.errors);
      return;
    }

    if (contenedorErrores) contenedorErrores.hidden = true;
    form.reset();
    _autoresSeleccionados = [];
    _renderAutoresSeleccionados();
    _mostrarExitoLibro(resultado.libro);

    await actualizarCatalogoRemoto();
    renderListadoLibros();
    poblarSelectLibro(document.getElementById('venta-libro'));
  });
}
