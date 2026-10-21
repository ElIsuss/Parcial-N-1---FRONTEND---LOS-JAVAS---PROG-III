// ========================================
// APP.JS — Bootstrap Principal
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
import { bindFormVenta } from './ventas.js';
import { bindHistorial, renderHistorial } from './historial.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar datos (semilla o localStorage)
  Data.inicializar();

  // 2. Poblar selects (orden crítico: antes de mostrarVista)
  poblarSelectEditorial(document.getElementById('libro-editorial'));
  poblarSelectGenero(document.getElementById('libro-genero'));
  poblarContenedorAutores(document.getElementById('contenedor-autores'));
  poblarSelectCliente(document.getElementById('venta-cliente'));
  poblarSelectLibro(document.getElementById('venta-libro'));

  // 3. Vincular eventos de búsqueda
  bindBusqueda();

  // 3.b Vincular formularios de alta (C-04)
  bindFormLibro();
  bindFormCliente();

  // 3.c Inicializar Ventas e Historial (C-05)
  bindHistorial();
  bindFormVenta();
  renderHistorial();

  // 4. Render catálogo inicial
  renderCatalogo(Data.getLibros());

  // 4.b Render inicial de listados (C-04)
  renderListadoLibros();
  renderListadoClientes();

  // 5. Mostrar vista inicial (Catálogo)
  mostrarVista('catalogo');

  // 6. Delegación de navegación en nav-links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const vistaId = link.dataset.vista;
      if (vistaId) {
        mostrarVista(vistaId);
      }
    });
  });
});