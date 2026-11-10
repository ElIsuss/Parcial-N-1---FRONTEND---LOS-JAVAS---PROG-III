// ========================================
// VENTAS.JS — Composición y Confirmación de Venta (Conectado a LIBRERIA-API)
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';
import { poblarSelectLibro, poblarSelectCliente, actualizarCatalogoRemoto } from './catalogo.js';
import { renderListadoLibros } from './libros.js';
import { renderListadoClientes } from './clientes.js';
import { renderHistorial } from './historial.js';

// ========================================
// ESTADO LOCAL DEL COMPOSER
// ========================================
const _composerState = {
  renglones: []
};

// ========================================
// HELPERS
// ========================================
function _limpiarRenglonesComposer() {
  _composerState.renglones = [];
  _renderTablaRenglones();
  _actualizarTotal();
  _toggleBotonConfirmar();
}

function _renderTablaRenglones() {
  const tbody = document.querySelector('#tabla-renglones tbody');
  if (!tbody) return;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  if (_composerState.renglones.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'fila-vacia';
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = 'Sin renglones agregados.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  _composerState.renglones.forEach((renglon, index) => {
    const tr = document.createElement('tr');
    tr.dataset.index = String(index);

    // 1. Libro
    const tdLibro = document.createElement('td');
    tdLibro.textContent = `#${renglon.libroId} — ${renglon.titulo}`;
    tr.appendChild(tdLibro);

    // 2. Cantidad editable ("Permití cambiar cantidades y quitar renglones")
    const tdCant = document.createElement('td');
    const inputCant = document.createElement('input');
    inputCant.type = 'number';
    inputCant.min = '1';
    inputCant.step = '1';
    inputCant.value = String(renglon.cantidad);
    inputCant.style.width = '72px';
    inputCant.setAttribute('aria-label', `Cantidad para ${renglon.titulo}`);
    inputCant.addEventListener('change', () => {
      const nuevaCant = Number(inputCant.value);
      if (Number.isInteger(nuevaCant) && nuevaCant > 0) {
        renglon.cantidad = nuevaCant;
        renglon.subtotal = Number((nuevaCant * renglon.precioUnitarioSnapshot).toFixed(2));
        _renderTablaRenglones();
        _actualizarTotal();
      } else {
        inputCant.value = String(renglon.cantidad);
      }
    });
    tdCant.appendChild(inputCant);
    tr.appendChild(tdCant);

    // 3. Precio unitario
    const tdPrecio = document.createElement('td');
    tdPrecio.textContent = formatPriceARS(renglon.precioUnitarioSnapshot);
    tr.appendChild(tdPrecio);

    // 4. Subtotal
    const tdSubtotal = document.createElement('td');
    tdSubtotal.textContent = formatPriceARS(renglon.subtotal);
    tr.appendChild(tdSubtotal);

    // 5. Acciones (Quitar)
    const tdAcciones = document.createElement('td');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-eliminar';
    btn.textContent = 'Quitar';
    btn.addEventListener('click', () => _quitarRenglon(index));
    tdAcciones.appendChild(btn);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
}

function _actualizarTotal() {
  const totalEl = document.getElementById('venta-total');
  if (!totalEl) return;
  const total = _composerState.renglones.reduce((sum, r) => sum + r.subtotal, 0);
  totalEl.textContent = formatPriceARS(total);
}

function _obtenerClienteIdSeleccionado() {
  const selectVal = document.getElementById('venta-cliente')?.value;
  const inputVal = document.getElementById('venta-cliente-id-input')?.value;
  return selectVal || inputVal || '';
}

function _toggleBotonConfirmar() {
  const btn = document.getElementById('btn-confirmar-venta');
  if (!btn) return;
  const hayCliente = Boolean(_obtenerClienteIdSeleccionado());
  btn.disabled = _composerState.renglones.length === 0 || !hayCliente;
}

function _quitarRenglon(index) {
  _composerState.renglones.splice(index, 1);
  _renderTablaRenglones();
  _actualizarTotal();
  _toggleBotonConfirmar();
}

function _mostrarErroresVenta(errors) {
  const contenedor = document.getElementById('errores-venta');
  const exitoEl = document.getElementById('exito-venta');
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

function _mostrarExitoVenta(venta) {
  const exitoEl = document.getElementById('exito-venta');
  const contenedorErrores = document.getElementById('errores-venta');
  if (contenedorErrores) contenedorErrores.hidden = true;
  if (!exitoEl) return;

  while (exitoEl.firstChild) {
    exitoEl.removeChild(exitoEl.firstChild);
  }

  const pTitulo = document.createElement('p');
  pTitulo.style.fontWeight = '600';
  pTitulo.textContent = `Venta #${venta.id} registrada (201 Created) — Total confirmado por la API: ${formatPriceARS(venta.total)}`;
  exitoEl.appendChild(pTitulo);

  if (Array.isArray(venta.renglones) && venta.renglones.length > 0) {
    const ul = document.createElement('ul');
    ul.style.margin = '0.35rem 0 0 1.2rem';
    venta.renglones.forEach(r => {
      const li = document.createElement('li');
      const pu = r.precio_unitario ?? r.precioUnitarioSnapshot ?? 0;
      li.textContent = `${r.titulo} (#${r.libro_id ?? r.libroId}): ${r.cantidad} x ${formatPriceARS(pu)} = ${formatPriceARS(r.subtotal)}`;
      ul.appendChild(li);
    });
    exitoEl.appendChild(ul);
  }

  exitoEl.hidden = false;
}

// ========================================
// FORMULARIO DE VENTA
// ========================================
export function bindFormVenta() {
  const form = document.getElementById('form-venta');
  const selectLibro = document.getElementById('venta-libro');
  const inputLibroManual = document.getElementById('venta-libro-id-manual');
  const chkForzarSeparado = document.getElementById('venta-forzar-renglon-separado');
  const inputCantidad = document.getElementById('venta-cantidad');
  const btnAgregar = document.getElementById('btn-agregar-renglon');
  const btnConfirmar = document.getElementById('btn-confirmar-venta');
  const selectCliente = document.getElementById('venta-cliente');
  const inputClienteId = document.getElementById('venta-cliente-id-input');
  const btnVerificarCliente = document.getElementById('btn-verificar-cliente-venta');

  if (!form || !selectLibro || !inputCantidad || !btnAgregar || !btnConfirmar || !selectCliente) return;

  selectCliente.addEventListener('change', () => {
    if (selectCliente.value && inputClienteId) {
      inputClienteId.value = '';
    }
    _toggleBotonConfirmar();
  });

  if (inputClienteId) {
    inputClienteId.addEventListener('input', _toggleBotonConfirmar);
  }

  // Verificar cliente por ID con GET /clientes/{id}
  if (btnVerificarCliente && inputClienteId) {
    btnVerificarCliente.addEventListener('click', async () => {
      const idVal = inputClienteId.value;
      if (!idVal) {
        _mostrarErroresVenta(['Ingrese un ID de cliente para verificar.']);
        return;
      }

      btnVerificarCliente.disabled = true;
      const res = await Data.fetchClientePorId(idVal);
      btnVerificarCliente.disabled = false;

      if (!res.ok) {
        _mostrarErroresVenta(res.errors);
        return;
      }

      const contenedorErrores = document.getElementById('errores-venta');
      if (contenedorErrores) contenedorErrores.hidden = true;

      poblarSelectCliente(selectCliente);
      selectCliente.value = String(res.cliente.id);
      inputClienteId.value = '';
      renderListadoClientes();
      _toggleBotonConfirmar();
    });
  }

  // Agregar renglón
  btnAgregar.addEventListener('click', () => {
    const manualId = inputLibroManual && inputLibroManual.value ? Number(inputLibroManual.value) : null;
    const libroId = manualId || Number(selectLibro.value);
    const cantidad = Number(inputCantidad.value);
    const forzarSeparado = Boolean(chkForzarSeparado && chkForzarSeparado.checked);

    if (!libroId || !Number.isInteger(libroId) || libroId <= 0) {
      _mostrarErroresVenta(['Debe seleccionar un libro o ingresar un ID de libro entero positivo.']);
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      _mostrarErroresVenta(['La cantidad debe ser un entero mayor a 0.']);
      return;
    }

    const libro = Data._findLibroById(libroId);
    const titulo = libro ? libro.titulo : `Libro ID #${libroId} (no verificado en catálogo)`;
    const precio = libro ? libro.precio : 0;
    const isbn = libro ? libro.isbn : '—';

    const existente = !forzarSeparado
      ? _composerState.renglones.find(r => Number(r.libroId) === libroId)
      : null;

    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = Number((existente.cantidad * existente.precioUnitarioSnapshot).toFixed(2));
    } else {
      _composerState.renglones.push({
        libroId,
        titulo,
        isbn,
        cantidad,
        precioUnitarioSnapshot: precio,
        subtotal: Number((cantidad * precio).toFixed(2))
      });
    }

    const contenedorErrores = document.getElementById('errores-venta');
    if (contenedorErrores) contenedorErrores.hidden = true;
    const exitoEl = document.getElementById('exito-venta');
    if (exitoEl) exitoEl.hidden = true;

    _renderTablaRenglones();
    _actualizarTotal();
    _toggleBotonConfirmar();

    inputCantidad.value = '1';
    if (inputLibroManual) inputLibroManual.value = '';
    selectLibro.focus();
  });

  // Confirmar venta (POST /ventas/)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const clienteId = _obtenerClienteIdSeleccionado();

    if (!clienteId) {
      _mostrarErroresVenta(['Debe seleccionar o ingresar un ID de cliente.']);
      return;
    }

    if (_composerState.renglones.length === 0) {
      _mostrarErroresVenta(['La venta debe tener al menos un renglón.']);
      return;
    }

    btnConfirmar.disabled = true;
    const resultado = await Data.crearVenta({
      clienteId: Number(clienteId),
      renglones: _composerState.renglones.map(r => ({
        libroId: Number(r.libroId),
        cantidad: Number(r.cantidad)
      }))
    });

    if (!resultado.ok) {
      // Conservar el borrador cuando se rechaza la operación (409 o 422)
      _toggleBotonConfirmar();
      _mostrarErroresVenta(resultado.errors);
      return;
    }

    form.reset();
    _limpiarRenglonesComposer();

    await actualizarCatalogoRemoto();
    await renderHistorial();
    renderListadoLibros();
    poblarSelectLibro(document.getElementById('venta-libro'));
    poblarSelectCliente(document.getElementById('venta-cliente'));

    _mostrarExitoVenta(resultado.venta);
  });

  // Reset del formulario (botón Cancelar)
  form.addEventListener('reset', () => {
    setTimeout(() => {
      _limpiarRenglonesComposer();
      const contenedorErrores = document.getElementById('errores-venta');
      if (contenedorErrores) contenedorErrores.hidden = true;
    }, 0);
  });
}

// Inicializar composer al mostrar la vista
export function inicializarVenta() {
  _limpiarRenglonesComposer();
  const exitoEl = document.getElementById('exito-venta');
  if (exitoEl) exitoEl.hidden = true;
  poblarSelectLibro(document.getElementById('venta-libro'));
  poblarSelectCliente(document.getElementById('venta-cliente'));
}
