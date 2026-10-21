// ========================================
// HISTORIAL.JS — Listado + Modal Detalle
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';

// ========================================
// HELPERS
// ========================================

function obtenerElementosHistorial() {
  return {
    tbody: document.querySelector('#tabla-historial tbody'),
    filaVacia: document.querySelector('#tabla-historial .fila-vacia'),
    modal: document.getElementById('modal-detalle'),
    detalleId: document.getElementById('detalle-id'),
    detalleFecha: document.getElementById('detalle-fecha'),
    detalleCliente: document.getElementById('detalle-cliente'),
    detalleTotal: document.getElementById('detalle-total'),
    tbodyDetalle: document.getElementById('tbody-detalle-renglones'),
  };
}

function formatearFechaLegible(isoString) {
  const fecha = new Date(isoString);
  return fecha.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function crearCelda(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

// ========================================
// RENDER LISTADO HISTORIAL
// ========================================

export function renderHistorial() {
  const els = obtenerElementosHistorial();
  const ventas = Data.getVentas();

  els.tbody.replaceChildren();
  els.tbody.appendChild(els.filaVacia);
  els.filaVacia.hidden = ventas.length > 0;

  const ventasOrdenadas = [...ventas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  ventasOrdenadas.forEach(venta => {
    const cliente = Data._findClienteById(venta.clienteId);
    const tr = document.createElement('tr');

    tr.appendChild(crearCelda(`${venta.id.slice(0, 8)}…`));
    tr.appendChild(crearCelda(formatearFechaLegible(venta.fecha)));
    tr.appendChild(crearCelda(cliente?.nombreCompleto ?? 'Desconocido'));
    tr.appendChild(crearCelda(formatPriceARS(venta.total)));

    const tdAcciones = document.createElement('td');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-ver-detalle';
    btn.dataset.ventaId = venta.id;
    btn.textContent = 'Ver detalle';
    btn.setAttribute('aria-label', 'Ver detalle de venta');
    tdAcciones.appendChild(btn);
    tr.appendChild(tdAcciones);

    els.tbody.appendChild(tr);
  });
}

// ========================================
// MODAL DETALLE
// ========================================

function abrirDetalle(ventaId) {
  const els = obtenerElementosHistorial();
  const venta = Data.getVentas().find(v => v.id === ventaId);
  if (!venta) return;

  const cliente = Data._findClienteById(venta.clienteId);

  els.detalleId.textContent = venta.id;
  els.detalleFecha.textContent = formatearFechaLegible(venta.fecha);
  els.detalleCliente.textContent = cliente?.nombreCompleto ?? 'Desconocido';
  els.detalleTotal.textContent = formatPriceARS(venta.total);

  els.tbodyDetalle.replaceChildren();
  venta.renglones.forEach(r => {
    const tr = document.createElement('tr');
    tr.appendChild(crearCelda(r.titulo));
    tr.appendChild(crearCelda(r.isbn));
    tr.appendChild(crearCelda(String(r.cantidad)));
    tr.appendChild(crearCelda(formatPriceARS(r.precioUnitarioSnapshot)));
    tr.appendChild(crearCelda(formatPriceARS(r.subtotal)));
    els.tbodyDetalle.appendChild(tr);
  });

  els.modal.showModal();
}

// ========================================
// BINDINGS (una sola vez)
// ========================================

export function bindHistorial() {
  const els = obtenerElementosHistorial();

  els.tbody.addEventListener('click', e => {
    const btn = e.target.closest('.btn-ver-detalle');
    if (btn) abrirDetalle(btn.dataset.ventaId);
  });

  els.modal.addEventListener('click', e => {
    if (e.target.closest('.btn-cerrar-modal')) els.modal.close();
  });
}
