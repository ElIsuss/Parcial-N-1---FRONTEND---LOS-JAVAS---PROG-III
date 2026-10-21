// ========================================
// VENTAS.JS — Composer de Venta + Validaciones + UI
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';
import { renderHistorial } from './historial.js';

// ========================================
// ESTADO INTERNO DEL COMPOSER
// ========================================
let renglones = [];
let resultadoTimer = null;

// ========================================
// HELPERS DE VALIDACIÓN
// ========================================

/**
 * Valida cantidad: solo dígitos enteros positivos (regex estricta).
 * Rechaza: 2e3, 2.9, +2, -1, vacío, espacios.
 * @param {string|number} valor
 * @returns {{ok: boolean, value?: number, error?: string}}
 */
export function validarCantidad(valor) {
  const v = String(valor);
  if (!/^\d+$/.test(v)) {
    return { ok: false, error: 'Cantidad debe ser un número entero mayor a 0' };
  }
  const n = Number(v);
  return n > 0 ? { ok: true, value: n } : { ok: false, error: 'Cantidad debe ser mayor a 0' };
}

// ========================================
// RENDER Y UI
// ========================================

function crearCelda(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function obtenerElementos() {
  return {
    selectCliente: document.getElementById('venta-cliente'),
    selectLibro: document.getElementById('venta-libro'),
    inputCantidad: document.getElementById('venta-cantidad'),
    btnAgregar: document.getElementById('btn-agregar-renglon'),
    tbody: document.querySelector('#tabla-renglones tbody'),
    totalEl: document.getElementById('venta-total'),
    btnConfirmar: document.getElementById('btn-confirmar-venta'),
    erroresEl: document.getElementById('errores-venta'),
    resultadoEl: document.getElementById('resultado-venta'),
    form: document.getElementById('form-venta'),
    filaVacia: document.querySelector('#tabla-renglones .fila-vacia'),
  };
}

function renderTablaRenglones({ tbody, filaVacia }) {
  tbody.replaceChildren();
  tbody.appendChild(filaVacia);
  filaVacia.hidden = renglones.length > 0;

  renglones.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.idx = String(idx);

    tr.appendChild(crearCelda(r.titulo));

    const tdCantidad = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cantidad-input';
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';
    input.value = String(r.cantidad);
    input.setAttribute('aria-label', `Cantidad de ${r.titulo}`);
    tdCantidad.appendChild(input);
    tr.appendChild(tdCantidad);

    tr.appendChild(crearCelda(formatPriceARS(r.precioUnitario)));
    tr.appendChild(crearCelda(formatPriceARS(r.subtotal)));

    const tdAcciones = document.createElement('td');
    const btnQuitar = document.createElement('button');
    btnQuitar.type = 'button';
    btnQuitar.className = 'btn-quitar';
    btnQuitar.textContent = 'Quitar';
    btnQuitar.setAttribute('aria-label', `Quitar ${r.titulo}`);
    tdAcciones.appendChild(btnQuitar);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
}

function renderTotal({ totalEl }) {
  const total = renglones.reduce((acc, r) => acc + r.subtotal, 0);
  totalEl.textContent = formatPriceARS(total);
}

function actualizarEstadoConfirmar({ selectCliente, btnConfirmar }) {
  const hayCliente = selectCliente.value !== '';
  const hayRenglones = renglones.length > 0;
  const todasValidas = renglones.every(r => Number.isInteger(r.cantidad) && r.cantidad > 0);
  btnConfirmar.disabled = !(hayCliente && hayRenglones && todasValidas);
}

function mostrarErrores(erroresEl, errors) {
  clearTimeout(resultadoTimer);
  const resultadoEl = document.getElementById('resultado-venta');
  if (resultadoEl) resultadoEl.hidden = true;
  erroresEl.replaceChildren();
  if (!errors.length) {
    erroresEl.hidden = true;
    return;
  }
  errors.forEach(err => {
    const p = document.createElement('p');
    p.textContent = err;
    erroresEl.appendChild(p);
  });
  erroresEl.hidden = false;
}

function mostrarResultado(resultadoEl, mensaje, tipo = 'exito') {
  clearTimeout(resultadoTimer);
  const erroresEl = document.getElementById('errores-venta');
  if (erroresEl) {
    erroresEl.replaceChildren();
    erroresEl.hidden = true;
  }
  resultadoEl.textContent = mensaje;
  resultadoEl.className = `mensaje-resultado ${tipo === 'error' ? 'error' : 'exito'}`;
  resultadoEl.hidden = false;
  if (tipo === 'exito') {
    resultadoTimer = setTimeout(() => { resultadoEl.hidden = true; }, 3000);
  }
}

function resetFormulario({ selectCliente, selectLibro, inputCantidad, tbody, filaVacia, totalEl, btnConfirmar, erroresEl, resultadoEl }) {
  clearTimeout(resultadoTimer);
  renglones = [];
  selectCliente.value = '';
  selectLibro.value = '';
  inputCantidad.value = '1';
  renderTablaRenglones({ tbody, filaVacia });
  renderTotal({ totalEl });
  actualizarEstadoConfirmar({ selectCliente, btnConfirmar });
  mostrarErrores(erroresEl, []);
  resultadoEl.hidden = true;
}

// ========================================
// LÓGICA DE NEGOCIO
// ========================================

function agregarRenglon({ selectLibro, inputCantidad, tbody, filaVacia, totalEl, btnConfirmar, selectCliente, erroresEl, resultadoEl }) {
  const libroId = selectLibro.value;
  const cantidadVal = inputCantidad.value;

  if (!libroId) {
    mostrarErrores(erroresEl, ['Seleccione un libro']);
    return;
  }

  const validacion = validarCantidad(cantidadVal);
  if (!validacion.ok) {
    mostrarErrores(erroresEl, [validacion.error]);
    return;
  }
  const cantidad = validacion.value;

  const libro = Data._findLibroById(libroId);
  if (!libro) {
    mostrarErrores(erroresEl, ['El libro seleccionado no existe']);
    return;
  }
  if (!Number.isFinite(libro.precio) || libro.precio <= 0) {
    mostrarErrores(erroresEl, ['El libro tiene un precio inválido']);
    return;
  }

  // Anti-duplicado por libroId (RN-VTA-05)
  const idxExistente = renglones.findIndex(r => r.libroId === libroId);
  if (idxExistente >= 0) {
    const nuevaCantidad = renglones[idxExistente].cantidad + cantidad;
    renglones[idxExistente].cantidad = nuevaCantidad;
    renglones[idxExistente].subtotal = nuevaCantidad * libro.precio;
  } else {
    renglones.push({
      libroId,
      cantidad,
      precioUnitario: libro.precio,
      subtotal: cantidad * libro.precio,
      titulo: libro.titulo,
      isbn: libro.isbn,
    });
  }

  inputCantidad.value = '1';
  renderTablaRenglones({ tbody, filaVacia });
  renderTotal({ totalEl });
  actualizarEstadoConfirmar({ selectCliente, btnConfirmar });
  mostrarErrores(erroresEl, []);
  mostrarResultado(resultadoEl, idxExistente >= 0 ? 'Cantidad actualizada' : 'Renglón agregado');
}

function editarCantidad(idx, nuevoValor, { tbody, totalEl, btnConfirmar, selectCliente, erroresEl }) {
  const validacion = validarCantidad(nuevoValor);
  if (!validacion.ok) {
    const input = tbody.querySelector(`tr[data-idx="${idx}"] .cantidad-input`);
    if (input) input.value = String(renglones[idx].cantidad);
    mostrarErrores(erroresEl, [validacion.error]);
    return;
  }
  const cantidad = validacion.value;
  const libro = Data._findLibroById(renglones[idx].libroId);
  if (!libro) {
    mostrarErrores(erroresEl, ['Error: libro no encontrado']);
    return;
  }
  renglones[idx].cantidad = cantidad;
  renglones[idx].subtotal = cantidad * libro.precio;
  const tr = tbody.querySelector(`tr[data-idx="${idx}"]`);
  if (tr) {
    const input = tr.querySelector('.cantidad-input');
    if (input) input.value = String(cantidad);
    if (tr.children[3]) tr.children[3].textContent = formatPriceARS(renglones[idx].subtotal);
  }
  renderTotal({ totalEl });
  actualizarEstadoConfirmar({ selectCliente, btnConfirmar });
  mostrarErrores(erroresEl, []);
}

function quitarRenglon(idx, { tbody, filaVacia, totalEl, btnConfirmar, selectCliente, erroresEl }) {
  renglones.splice(idx, 1);
  renderTablaRenglones({ tbody, filaVacia });
  renderTotal({ totalEl });
  actualizarEstadoConfirmar({ selectCliente, btnConfirmar });
  mostrarErrores(erroresEl, []);
}

function confirmarVenta({ selectCliente, selectLibro, inputCantidad, tbody, filaVacia, totalEl, btnConfirmar, erroresEl, resultadoEl }) {
  const clienteId = selectCliente.value;
  const errors = [];

  if (!clienteId) errors.push('Seleccione un cliente');
  if (renglones.length === 0) errors.push('Agregue al menos un renglón');
  if (renglones.some(r => !Number.isInteger(r.cantidad) || r.cantidad <= 0)) {
    errors.push('Hay cantidades inválidas en los renglones');
  }

  if (errors.length > 0) {
    mostrarErrores(erroresEl, errors);
    return;
  }

  const payload = {
    clienteId,
    renglones: renglones.map(r => ({
      libroId: r.libroId,
      cantidad: r.cantidad,
    })),
  };

  const result = Data.crearVenta(payload);
  if (!result.ok) {
    mostrarErrores(erroresEl, result.errors);
    return;
  }

  resetFormulario({ selectCliente, selectLibro, inputCantidad, tbody, filaVacia, totalEl, btnConfirmar, erroresEl, resultadoEl });
  mostrarResultado(resultadoEl, 'Venta confirmada correctamente');
  renderHistorial();
}

// ========================================
// ENTRY POINT
// ========================================

export function bindFormVenta() {
  const els = obtenerElementos();

  els.btnAgregar.addEventListener('click', () => agregarRenglon(els));

  els.selectCliente.addEventListener('change', () => {
    actualizarEstadoConfirmar(els);
    if (els.selectCliente.value) mostrarErrores(els.erroresEl, []);
  });

  els.inputCantidad.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarRenglon(els);
    }
  });

  els.tbody.addEventListener('change', e => {
    if (e.target.matches('.cantidad-input')) {
      const tr = e.target.closest('tr');
      const idx = Number(tr.dataset.idx);
      editarCantidad(idx, e.target.value, els);
    }
  });

  els.tbody.addEventListener('click', e => {
    if (e.target.matches('.btn-quitar')) {
      const tr = e.target.closest('tr');
      const idx = Number(tr.dataset.idx);
      quitarRenglon(idx, els);
    }
  });

  els.form.addEventListener('submit', e => {
    e.preventDefault();
    confirmarVenta(els);
  });

  els.form.addEventListener('reset', () => {
    resetFormulario(els);
  });

  renderTablaRenglones(els);
  renderTotal(els);
  actualizarEstadoConfirmar(els);
}
