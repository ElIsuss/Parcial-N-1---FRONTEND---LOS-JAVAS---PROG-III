// ========================================
// APP.JS — Bootstrap Principal (Asíncrono con LIBRERIA-API)
// ========================================

import { mostrarVista } from './nav.js';
import { Data } from './data.js';
import {
  renderCatalogo,
  bindBusqueda,
  poblarSelectEditorial,
  poblarSelectGenero,
  poblarContenedorAutores,
  poblarSelectCliente,
  poblarSelectLibro
} from './catalogo.js';
import { bindFormLibro, renderListadoLibros } from './libros.js';
import { bindFormCliente, renderListadoClientes } from './clientes.js';
import { bindFormVenta, inicializarVenta } from './ventas.js';
import { renderHistorial, bindModalDetalle } from './historial.js';

function _actualizarBannerConexion(resultadoInit) {
  const banner = document.getElementById('estado-conexion');
  if (!banner) return;

  if (!resultadoInit.ok) {
    banner.textContent = resultadoInit.errors.join(' ');
    banner.hidden = false;
  } else {
    banner.textContent = '';
    banner.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Vincular eventos de búsqueda, formularios y navegación inmediatamente
  bindBusqueda();
  bindFormLibro();
  bindFormCliente();
  bindFormVenta();
  bindModalDetalle();

  // Delegación de navegación en nav-links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const vistaId = link.dataset.vista;
      if (vistaId) {
        mostrarVista(vistaId);
        if (vistaId === 'historial') {
          await renderHistorial();
        }
        if (vistaId === 'ventas') {
          inicializarVenta();
        }
      }
    });
  });

  // 2. Mostrar vista inicial (Catálogo) con indicador de carga
  mostrarVista('catalogo');
  const estadoCatalogo = document.getElementById('estado-catalogo');
  if (estadoCatalogo) {
    estadoCatalogo.textContent = 'Conectando con la API y cargando catálogo…';
    estadoCatalogo.hidden = false;
  }

  // 3. Inicializar datos desde LIBRERIA-API
  const initRes = await Data.inicializar();
  _actualizarBannerConexion(initRes);

  // 4. Poblar selects desde los datos recibidos
  poblarSelectEditorial(document.getElementById('libro-editorial'));
  poblarSelectGenero(document.getElementById('libro-genero'));
  poblarSelectGenero(document.getElementById('filtro-genero'));
  poblarContenedorAutores(document.getElementById('contenedor-autores'));
  poblarSelectCliente(document.getElementById('venta-cliente'));
  poblarSelectLibro(document.getElementById('venta-libro'));

  // 5. Render catálogo inicial y tablas
  if (initRes.ok) {
    renderCatalogo(Data.getLibros());
  } else if (estadoCatalogo) {
    estadoCatalogo.textContent = initRes.errors.join(' ');
    estadoCatalogo.hidden = false;
  }

  renderListadoLibros();
  renderListadoClientes();
});
