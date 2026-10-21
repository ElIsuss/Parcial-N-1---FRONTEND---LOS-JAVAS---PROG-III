// ========================================
// VENTAS.JS — Composición y Confirmación de Venta
// ========================================

import { Data } from './data.js';
import { formatPriceARS } from './utils.js';
import { poblarSelectLibro, poblarSelectCliente } from './catalogo.js';
import { mostrarVista } from './nav.js';

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
  const filaVacia = tbody.querySelector('.fila-vacia');
  if (!tbody) return;

  // Limpiar filas de datos (mantener fila vacía)
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
    tr.dataset.index = index;

    const celdas = [
      renglon.titulo,
      String(renglon.cantidad),
      formatPriceARS(renglon.precioUnitarioSnapshot),
      formatPriceARS(renglon.subtotal),
      '' // Acciones
    ];

    celdas.forEach((valor, i) => {
      const td = document.createElement('td');
      if (i === 4) {
        // Botón eliminar
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-eliminar';
        btn.textContent = 'Quitar';
        btn.addEventListener('click', () => _quitarRenglon(index));
        td.appendChild(btn);
      } else {
        td.textContent = valor;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function _actualizarTotal() {
  const totalEl = document.getElementById('venta-total');
  if (!totalEl) return;
  const total = _composerState.renglones.reduce((sum, r) => sum + r.subtotal, 0);
  totalEl.textContent = formatPriceARS(total);
}

function _toggleBotonConfirmar() {
  const btn = document.getElementById('btn-confirmar-venta');
  if (!btn) return;
  const hayCliente = document.getElementById('venta-cliente')?.value;
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

// ========================================
// FORMULARIO DE VENTA
// ========================================
export function bindFormVenta() {
  const form = document.getElementById('form-venta');
  const selectLibro = document.getElementById('venta-libro');
  const inputCantidad = document.getElementById('venta-cantidad');
  const btnAgregar = document.getElementById('btn-agregar-renglon');
  const btnConfirmar = document.getElementById('btn-confirmar-venta');
  const selectCliente = document.getElementById('venta-cliente');

  if (!form || !selectLibro || !inputCantidad || !btnAgregar || !btnConfirmar || !selectCliente) return;

  // Actualizar botón confirmar cuando cambia cliente
  selectCliente.addEventListener('change', _toggleBotonConfirmar);

  // Agregar renglón
  btnAgregar.addEventListener('click', () => {
    const libroId = selectLibro.value;
    const cantidad = Number(inputCantidad.value);

    if (!libroId) {
      _mostrarErroresVenta(['Debe seleccionar un libro.']);
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      _mostrarErroresVenta(['La cantidad debe ser un entero mayor a 0.']);
      return;
    }

    const libro = Data.getLibros().find(l => l.id === libroId);
    if (!libro) {
      _mostrarErroresVenta(['El libro seleccionado no existe.']);
      return;
    }

    // RN-VTA-05: Verificar duplicado - si existe, modificar cantidad
    const existente = _composerState.renglones.find(r => r.libroId === libroId);
    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = Number((existente.cantidad * existente.precioUnitarioSnapshot).toFixed(2));
    } else {
      _composerState.renglones.push({
        libroId,
        titulo: libro.titulo,
        isbn: libro.isbn,
        cantidad,
        precioUnitarioSnapshot: libro.precio,
        subtotal: Number((cantidad * libro.precio).toFixed(2))
      });
    }

    const contenedorErrores = document.getElementById('errores-venta');
    if (contenedorErrores) contenedorErrores.hidden = true;

    _renderTablaRenglones();
    _actualizarTotal();
    _toggleBotonConfirmar();

    // Reset cantidad a 1
    inputCantidad.value = 1;
    selectLibro.focus();
  });

  // Confirmar venta
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const clienteId = selectCliente.value;
    const contenedorErrores = document.getElementById('errores-venta');

    if (!clienteId) {
      _mostrarErroresVenta(['Debe seleccionar un cliente.']);
      return;
    }

    if (_composerState.renglones.length === 0) {
      _mostrarErroresVenta(['La venta debe tener al menos un renglón.']);
      return;
    }

    const resultado = Data.crearVenta({
      clienteId,
      renglones: _composerState.renglones.map(r => ({
        libroId: r.libroId,
        cantidad: r.cantidad
      }))
    });

    if (!resultado.ok) {
      _mostrarErroresVenta(resultado.errors);
      return;
    }

    if (contenedorErrores) contenedorErrores.hidden = true;

    // Éxito: limpiar formulario y composer
    form.reset();
    _limpiarRenglonesComposer();

    // Actualizar selectores por si se agregaron libros/clientes en esta sesión
    poblarSelectLibro(document.getElementById('venta-libro'));
    poblarSelectCliente(document.getElementById('venta-cliente'));

    // Mostrar mensaje de éxito (RN-VTA-12)
    alert('Venta confirmada correctamente.');

    // Opcional: navegar a historial
    // mostrarVista('historial');
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
  poblarSelectLibro(document.getElementById('venta-libro'));
  poblarSelectCliente(document.getElementById('venta-cliente'));
}