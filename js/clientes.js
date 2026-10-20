// ========================================
// CLIENTES.JS — Alta y Listado de Clientes
// ========================================

import { Data } from './data.js';
import { poblarSelectCliente } from './catalogo.js';

// ========================================
// LISTADO DE CLIENTES
// ========================================

/**
 * Renderiza el listado de clientes registrados en #tabla-clientes.
 * Inserción segura (textContent) — NUNCA innerHTML. DEC-11
 */
export function renderListadoClientes() {
  const tbody = document.querySelector('#tabla-clientes tbody');
  if (!tbody) return;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  const clientes = Data.getClientes();

  if (clientes.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'fila-vacia';
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'No hay clientes registrados.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  clientes.forEach(cliente => {
    const tr = document.createElement('tr');

    [cliente.id, cliente.nombreCompleto, cliente.email].forEach(valor => {
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
 * DEC-13, DEC-14, RN-CLI-05
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
 * Vincula el formulario de alta de cliente (#form-cliente).
 * RN-CLI-01..05, RN-UX-01, RN-UX-02
 */
export function bindFormCliente() {
  const form = document.getElementById('form-cliente');
  const contenedorErrores = document.getElementById('errores-cliente');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const resultado = Data.crearCliente({
      nombreCompleto: form.elements['nombreCompleto']?.value,
      email: form.elements['email']?.value
    });

    if (!resultado.ok) {
      _mostrarErrores(contenedorErrores, resultado.errors);
      return;
    }

    if (contenedorErrores) contenedorErrores.hidden = true;
    form.reset();

    renderListadoClientes();

    // RN-CLI-05: refrescar selector de venta sin recargar
    poblarSelectCliente(document.getElementById('venta-cliente'));
  });
}
