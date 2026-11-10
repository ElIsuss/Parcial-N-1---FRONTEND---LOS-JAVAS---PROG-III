// ========================================
// HISTORIAL.JS — Listado y Detalle de Ventas (Conectado a LIBRERIA-API)
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';

// ========================================
// FORMATEO DE FECHA Y CLIENTE
// ========================================
function _formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return String(fechaISO ?? '');
  return fecha.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function _obtenerNombreCliente(venta) {
  if (venta?.cliente?.nombre) {
    return `${venta.cliente.nombre} (#${venta.cliente.id})`;
  }
  const clienteId = venta?.clienteId ?? venta?.cliente_id;
  const cliente = Data._findClienteById(clienteId);
  if (cliente) {
    return `${cliente.nombre || cliente.nombreCompleto} (#${cliente.id})`;
  }
  return clienteId ? `Cliente #${clienteId}` : 'Cliente desconocido';
}

// ========================================
// RENDERIZADO DEL HISTORIAL
// ========================================
export async function renderHistorial() {
  const tbody = document.querySelector('#tabla-historial tbody');
  if (!tbody) return;

  // Consultar ventas actualizadas al backend
  await Data.fetchVentas();

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
    tr.dataset.ventaId = String(venta.id);

    const celdas = [
      String(venta.id),
      _formatearFecha(venta.fecha),
      _obtenerNombreCliente(venta),
      formatPriceARS(venta.total),
      ''
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
async function _abrirModalDetalle(ventaInicial) {
  const modal = document.getElementById('modal-detalle');
  if (!modal) return;

  // Consultar detalle fresco por GET /ventas/{id}
  let venta = ventaInicial;
  const res = await Data.fetchVentaPorId(ventaInicial.id);
  if (res.ok && res.venta) {
    venta = res.venta;
  }

  document.getElementById('detalle-id').textContent = String(venta.id);
  document.getElementById('detalle-fecha').textContent = _formatearFecha(venta.fecha);
  document.getElementById('detalle-cliente').textContent = _obtenerNombreCliente(venta);
  document.getElementById('detalle-total').textContent = formatPriceARS(venta.total);

  const tbody = document.getElementById('tbody-detalle-renglones');
  if (!tbody) return;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  (venta.renglones || []).forEach(renglon => {
    const tr = document.createElement('tr');
    const libroId = renglon.libro_id ?? renglon.libroId ?? '—';
    const precioUnitario = renglon.precio_unitario ?? renglon.precioUnitarioSnapshot ?? 0;

    const celdas = [
      renglon.titulo,
      `#${libroId}`,
      String(renglon.cantidad),
      formatPriceARS(precioUnitario),
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

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.close();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
}
