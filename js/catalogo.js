// ========================================
// CATALOGO.JS — Renderizado, Filtro Remoto, Paginación y Poblar Selects
// ========================================

import { Data } from './data.js';
import { formatPriceARS, debounce } from './utils.js';

const _paginacion = {
  limit: 20,
  offset: 0,
  ultimoConteo: 0
};

// ========================================
// RENDERIZADO DEL CATÁLOGO
// ========================================

/**
 * Actualiza el estado de los controles de paginación (limit y offset).
 */
function _actualizarControlesPaginacion() {
  const btnAnt = document.getElementById('btn-pagina-anterior');
  const btnSig = document.getElementById('btn-pagina-siguiente');
  const infoEl = document.getElementById('info-paginacion');

  if (btnAnt) {
    btnAnt.disabled = _paginacion.offset <= 0;
  }
  if (btnSig) {
    btnSig.disabled = _paginacion.ultimoConteo < _paginacion.limit;
  }
  if (infoEl) {
    infoEl.textContent = `Offset: ${_paginacion.offset} | Limit: ${_paginacion.limit}`;
  }
}

/**
 * Renderiza el catálogo de libros en el contenedor grid.
 * Usa inserción segura (textContent/createTextNode) — NUNCA innerHTML.
 * @param {Array} libros - Array de libros a renderizar
 */
export function renderCatalogo(libros) {
  const contenedor = document.getElementById('contenedor-catalogo');
  const mensajeVacio = document.getElementById('mensaje-catalogo-vacio');
  const estadoCatalogo = document.getElementById('estado-catalogo');

  if (!contenedor || !mensajeVacio) return;
  if (estadoCatalogo) estadoCatalogo.hidden = true;

  const listaLibros = Array.isArray(libros) ? libros : [];
  _paginacion.ultimoConteo = listaLibros.length;
  _actualizarControlesPaginacion();

  // Limpieza segura sin innerHTML
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }

  if (listaLibros.length === 0) {
    contenedor.hidden = true;
    const input = document.getElementById('input-busqueda');
    const selectGenero = document.getElementById('filtro-genero');
    const hayFiltro = Boolean(input?.value.trim()) || Boolean(selectGenero?.value);
    mensajeVacio.textContent = hayFiltro
      ? 'No se encontraron libros que coincidan con la búsqueda.'
      : (_paginacion.offset > 0 ? 'No hay más libros en esta página.' : 'El catálogo está vacío.');
    mensajeVacio.hidden = false;
    return;
  }

  contenedor.hidden = false;
  mensajeVacio.hidden = true;

  listaLibros.forEach(libro => {
    const editorialNombre = libro.editorial?.nombre
      || Data._findEditorialById(libro.editorialId)?.nombre
      || 'Desconocida';
    const generoNombre = libro.genero?.nombre
      || (libro.generoId ? Data._findGeneroById(libro.generoId)?.nombre : null)
      || 'Sin clasificar';

    const card = document.createElement('article');
    card.className = 'libro-card';
    card.dataset.libroId = String(libro.id);

    // Título
    const h3 = document.createElement('h3');
    h3.textContent = libro.titulo;
    card.appendChild(h3);

    // Meta: ISBN, Editorial, Género, Stock
    const meta = document.createElement('p');
    meta.className = 'meta';
    const metaParts = [
      `ID: #${libro.id}`,
      `ISBN: ${libro.isbn}`,
      `Editorial: ${editorialNombre}`,
      `Género: ${generoNombre}`,
      `Stock: ${libro.stock ?? 0}`
    ];
    meta.textContent = metaParts.join(' | ');
    card.appendChild(meta);

    // Precio
    const precio = document.createElement('p');
    precio.className = 'precio';
    precio.textContent = formatPriceARS(libro.precio);
    card.appendChild(precio);

    // Contenedor de detalle de autores bajo demanda (GET /libros/{id})
    const autoresInfo = document.createElement('p');
    autoresInfo.className = 'meta autores-detalle';

    if (Array.isArray(libro.autores) && libro.autores.length > 0) {
      const lista = libro.autores
        .map(a => `${a.nombre} (${a.rol})`)
        .join(', ');
      autoresInfo.textContent = `Autores: ${lista}`;
      card.appendChild(autoresInfo);
    } else {
      autoresInfo.hidden = true;
      const btnAutores = document.createElement('button');
      btnAutores.type = 'button';
      btnAutores.className = 'btn btn-secundario btn-ver-autores';
      btnAutores.textContent = 'Ver autores';
      btnAutores.addEventListener('click', async () => {
        btnAutores.disabled = true;
        btnAutores.textContent = 'Consultando…';
        const res = await Data.fetchLibroDetalle(libro.id);
        if (!res.ok) {
          autoresInfo.textContent = res.errors.join(' ');
          autoresInfo.hidden = false;
          btnAutores.disabled = false;
          btnAutores.textContent = 'Reintentar';
          return;
        }
        const autores = res.libro?.autores || [];
        autoresInfo.textContent = autores.length
          ? `Autores: ${autores.map(a => `${a.nombre} (${a.rol})`).join(', ')}`
          : 'Sin autores registrados.';
        autoresInfo.hidden = false;
        btnAutores.remove();
      });
      card.appendChild(btnAutores);
      card.appendChild(autoresInfo);
    }

    contenedor.appendChild(card);
  });
}

// ========================================
// CONSULTA REMOTA CON FILTROS Y PAGINACIÓN
// ========================================

/**
 * Consulta libros al backend aplicando los filtros actuales de la barra de búsqueda y paginación.
 * @param {string} [terminoOverride]
 * @param {string|number} [generoOverride]
 */
export async function actualizarCatalogoRemoto(terminoOverride, generoOverride) {
  const input = document.getElementById('input-busqueda');
  const selectGenero = document.getElementById('filtro-genero');
  const selectLimit = document.getElementById('filtro-limit');
  const estadoCatalogo = document.getElementById('estado-catalogo');
  const contenedor = document.getElementById('contenedor-catalogo');
  const mensajeVacio = document.getElementById('mensaje-catalogo-vacio');

  const titulo = terminoOverride !== undefined ? terminoOverride : (input ? input.value : '');
  const generoId = generoOverride !== undefined ? generoOverride : (selectGenero ? selectGenero.value : '');
  if (selectLimit && selectLimit.value) {
    _paginacion.limit = Number(selectLimit.value) || 20;
  }

  if (estadoCatalogo) {
    estadoCatalogo.textContent = 'Cargando catálogo…';
    estadoCatalogo.hidden = false;
  }
  if (mensajeVacio) mensajeVacio.hidden = true;

  const res = await Data.fetchLibros({
    titulo,
    generoId,
    limit: _paginacion.limit,
    offset: _paginacion.offset
  });

  if (!res.ok) {
    if (contenedor) contenedor.hidden = true;
    if (estadoCatalogo) {
      estadoCatalogo.textContent = res.errors.join(' ');
      estadoCatalogo.hidden = false;
    }
    return [];
  }

  renderCatalogo(res.libros);
  return res.libros;
}

/**
 * Filtra libros en el caché local (fallback sincrónico usado por otros módulos).
 * @param {string} termino
 * @returns {Array}
 */
export function filtrarLibros(termino) {
  const t = String(termino ?? '').trim().toLowerCase();
  if (!t) return Data.getLibros();
  return Data.getLibros().filter(libro =>
    libro.titulo.toLowerCase().includes(t)
  );
}

// ========================================
// EVENTOS DE BÚSQUEDA Y PAGINACIÓN
// ========================================

/**
 * Vincula eventos del formulario de búsqueda y controles de paginación con consulta remota a GET /libros/.
 */
export function bindBusqueda() {
  const form = document.getElementById('form-busqueda');
  const input = document.getElementById('input-busqueda');
  const selectGenero = document.getElementById('filtro-genero');
  const selectLimit = document.getElementById('filtro-limit');
  const btnLimpiar = document.getElementById('btn-limpiar-busqueda');
  const btnAnt = document.getElementById('btn-pagina-anterior');
  const btnSig = document.getElementById('btn-pagina-siguiente');

  if (!form || !input || !btnLimpiar) return;

  const toggleLimpiar = () => {
    const hayFiltro = Boolean(input.value.trim()) || Boolean(selectGenero && selectGenero.value);
    btnLimpiar.hidden = !hayFiltro;
  };

  const buscarDebounced = debounce(() => {
    _paginacion.offset = 0; // Al cambiar el filtro, reiniciar el desplazamiento
    actualizarCatalogoRemoto();
  }, 250);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    _paginacion.offset = 0;
    toggleLimpiar();
    await actualizarCatalogoRemoto();
  });

  input.addEventListener('input', () => {
    toggleLimpiar();
    buscarDebounced();
  });

  if (selectGenero) {
    selectGenero.addEventListener('change', async () => {
      _paginacion.offset = 0;
      toggleLimpiar();
      await actualizarCatalogoRemoto();
    });
  }

  if (selectLimit) {
    selectLimit.addEventListener('change', async () => {
      _paginacion.limit = Number(selectLimit.value) || 20;
      _paginacion.offset = 0;
      await actualizarCatalogoRemoto();
    });
  }

  if (btnAnt) {
    btnAnt.addEventListener('click', async () => {
      _paginacion.offset = Math.max(0, _paginacion.offset - _paginacion.limit);
      await actualizarCatalogoRemoto();
    });
  }

  if (btnSig) {
    btnSig.addEventListener('click', async () => {
      _paginacion.offset += _paginacion.limit;
      await actualizarCatalogoRemoto();
    });
  }

  btnLimpiar.addEventListener('click', async () => {
    input.value = '';
    if (selectGenero) selectGenero.value = '';
    _paginacion.offset = 0;
    btnLimpiar.hidden = true;
    await actualizarCatalogoRemoto('', '');
    input.focus();
  });
}

// ========================================
// POBLAR SELECTS (helpers para app.js)
// ========================================

function _limpiarSelect(selectEl) {
  if (!selectEl) return;
  while (selectEl.options.length > 1) {
    selectEl.remove(1);
  }
}

export function poblarSelectEditorial(selectEl) {
  if (!selectEl) return;
  _limpiarSelect(selectEl);
  Data.getEditoriales().forEach(ed => {
    const opt = document.createElement('option');
    opt.value = String(ed.id);
    opt.textContent = ed.nombre;
    selectEl.appendChild(opt);
  });
}

export function poblarSelectGenero(selectEl) {
  if (!selectEl) return;
  _limpiarSelect(selectEl);
  Data.getGeneros().forEach(gen => {
    const opt = document.createElement('option');
    opt.value = String(gen.id);
    opt.textContent = gen.nombre;
    selectEl.appendChild(opt);
  });
}

export function poblarContenedorAutores(contenedorEl) {
  if (!contenedorEl) return;
  if (!contenedorEl.firstChild) {
    const hint = document.createElement('p');
    hint.className = 'meta';
    hint.textContent = 'Ningún autor agregado todavía. Ingrese un ID de autor y presione "Verificar y agregar".';
    contenedorEl.appendChild(hint);
  }
}

export function poblarSelectCliente(selectEl) {
  if (!selectEl) return;
  const valorPrevio = selectEl.value;
  _limpiarSelect(selectEl);
  Data.getClientes().forEach(cli => {
    const opt = document.createElement('option');
    opt.value = String(cli.id);
    const nombre = cli.nombre || cli.nombreCompleto;
    opt.textContent = `#${cli.id} — ${nombre} (${cli.email})`;
    selectEl.appendChild(opt);
  });
  if (valorPrevio && Array.from(selectEl.options).some(o => o.value === valorPrevio)) {
    selectEl.value = valorPrevio;
  }
}

export function poblarSelectLibro(selectEl) {
  if (!selectEl) return;
  const valorPrevio = selectEl.value;
  _limpiarSelect(selectEl);
  Data.getLibros().forEach(lib => {
    const opt = document.createElement('option');
    opt.value = String(lib.id);
    const stockTxt = `Stock: ${lib.stock ?? 0}`;
    opt.textContent = `#${lib.id} — ${lib.titulo} — ${formatPriceARS(lib.precio)} (${stockTxt})`;
    selectEl.appendChild(opt);
  });
  if (valorPrevio && Array.from(selectEl.options).some(o => o.value === valorPrevio)) {
    selectEl.value = valorPrevio;
  }
}
