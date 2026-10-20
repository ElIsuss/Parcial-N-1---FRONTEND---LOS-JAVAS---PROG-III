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

  // 4. Render catálogo inicial
  renderCatalogo(Data.getLibros());

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