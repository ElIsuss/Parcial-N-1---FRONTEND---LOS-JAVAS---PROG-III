// ========================================
// HISTORIAL.JS — Listado y Detalle de Ventas
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';

// ========================================
// FORMATEO DE FECHA
// ========================================
function _formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function _obtenerNombreCliente(clienteId) {
  const cliente = Data.getClientes().find(c => c.id === clienteId);
  return cliente ? cliente.nombreCompleto : 'Cliente desconocido';
}

// ========================================
// RENDERIZADO DEL HISTORIAL
// ========================================
export function renderHistorial() {
  const tbody = document.querySelector('#tabla-historial tbody');
  if (!tbody) return;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  const ventas = Data.getVentas();

  if (ventas.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'fila-vacia';
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = 'No hay ventas registradas.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  // Ordenar por fecha descendente (más recientes primero)
  const ventasOrdenadas = [...ventas].sort((a, b) =>
    new Date(b.fecha) - new Date(a.fecha)
  );

  ventasOrdenadas.forEach(venta => {
    const tr = document.createElement('tr');
    tr.dataset.ventaId = venta.id;

    const celdas = [
      venta.id,
      _formatearFecha(venta.fecha),
      _obtenerNombreCliente(venta.clienteId),
      formatPriceARS(venta.total),
      '' // Acciones
    ];

    celdas.forEach((valor, i) => {
      const td = document.createElement('td');
      if (i === 4) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-detalle';
        btn.textContent = 'Ver detalle';
        btn.addEventListener('click', () => _abrirModalDetalle(venta));
        td.appendChild(btn);
      } else {
        td.textContent = valor;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

// ========================================
// MODAL DETALLE
// ========================================
function _abrirModalDetalle(venta) {
  const modal = document.getElementById('modal-detalle');
  if (!modal) return;

  // Meta
  document.getElementById('detalle-id').textContent = venta.id;
  document.getElementById('detalle-fecha').textContent = _formatearFecha(venta.fecha);
  document.getElementById('detalle-cliente').textContent = _obtenerNombreCliente(venta.clienteId);
  document.getElementById('detalle-total').textContent = formatPriceARS(venta.total);

  // Renglones
  const tbody = document.getElementById('tbody-detalle-renglones');
  if (!tbody) return;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  venta.renglones.forEach(renglon => {
    const tr = document.createElement('tr');

    const celdas = [
      renglon.titulo,
      renglon.isbn,
      String(renglon.cantidad),
      formatPriceARS(renglon.precioUnitarioSnapshot),
      formatPriceARS(renglon.subtotal)
    ];

    celdas.forEach(valor => {
      const td = document.createElement('td');
      td.textContent = valor;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  modal.showModal();
}

// Cerrar modal
export function bindModalDetalle() {
  const modal = document.getElementById('modal-detalle');
  if (!modal) return;

  modal.querySelectorAll('.btn-cerrar-modal').forEach(btn => {
    btn.addEventListener('click', () => modal.close());
  });

  // Cerrar con Escape
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.close();
  });

  // Cerrar click fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
}