// ========================================
// CLIENTES.JS — Alta, Búsqueda por ID y Listado de Clientes
// ========================================

import { Data } from './data.js';
import { poblarSelectCliente } from './catalogo.js';

// ========================================
// LISTADO DE CLIENTES
// ========================================

/**
 * Renderiza el listado de clientes registrados/consultados en #tabla-clientes.
 * Inserción segura (textContent) — NUNCA innerHTML.
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
    td.textContent = 'No hay clientes cargados en la sesión. Creá uno o buscá por ID.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  clientes.forEach(cliente => {
    const tr = document.createElement('tr');
    const nombre = cliente.nombre || cliente.nombreCompleto;

    [String(cliente.id), nombre, cliente.email].forEach(valor => {
      const td = document.createElement('td');
      td.textContent = valor;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

// ========================================
// FORMULARIO DE ALTA Y BÚSQUEDA POR ID
// ========================================

function _mostrarErrores(contenedor, errors) {
  const exitoEl = document.getElementById('exito-cliente');
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

function _mostrarExitoCliente(cliente) {
  const exitoEl = document.getElementById('exito-cliente');
  const contenedorErrores = document.getElementById('errores-cliente');
  if (contenedorErrores) contenedorErrores.hidden = true;
  if (!exitoEl) return;
  exitoEl.textContent = `Cliente #${cliente.id} "${cliente.nombre}" registrado correctamente (201 Created).`;
  exitoEl.hidden = false;
}

/**
 * Vincula el formulario de alta de cliente (#form-cliente) y el buscador por ID (#form-buscar-cliente).
 */
export function bindFormCliente() {
  const form = document.getElementById('form-cliente');
  const contenedorErrores = document.getElementById('errores-cliente');
  const formBuscar = document.getElementById('form-buscar-cliente');
  const inputBuscarId = document.getElementById('cliente-buscar-id');
  const resultadoBuscar = document.getElementById('resultado-buscar-cliente');

  if (form) {
    form.addEventListener('reset', () => {
      if (contenedorErrores) contenedorErrores.hidden = true;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const resultado = await Data.crearCliente({
        nombre: form.elements['nombreCompleto']?.value,
        email: form.elements['email']?.value
      });

      if (submitBtn) submitBtn.disabled = false;

      if (!resultado.ok) {
        _mostrarErrores(contenedorErrores, resultado.errors);
        return;
      }

      if (contenedorErrores) contenedorErrores.hidden = true;
      form.reset();
      _mostrarExitoCliente(resultado.cliente);

      renderListadoClientes();
      poblarSelectCliente(document.getElementById('venta-cliente'));
    });
  }

  if (formBuscar && inputBuscarId) {
    formBuscar.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idVal = inputBuscarId.value;
      const btn = document.getElementById('btn-buscar-cliente-id');
      if (btn) btn.disabled = true;

      const res = await Data.fetchClientePorId(idVal);
      if (btn) btn.disabled = false;

      if (!res.ok) {
        _mostrarErrores(resultadoBuscar, res.errors);
        return;
      }

      if (resultadoBuscar) resultadoBuscar.hidden = true;
      inputBuscarId.value = '';
      renderListadoClientes();
      poblarSelectCliente(document.getElementById('venta-cliente'));
    });
  }
}
