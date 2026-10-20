// ========================================
// NAV.JS — Navegación entre Vistas (SPA)
// ========================================

/**
 * Muestra la vista indicada y oculta las demás.
 * Actualiza aria-current en la navegación principal.
 * @param {string} vistaId - ID de la vista a mostrar (ej: 'catalogo', 'libros', 'clientes', 'ventas', 'historial')
 */
export function mostrarVista(vistaId) {
  // Quita .activa de todas las vistas
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));

  // Agrega .activa a la vista solicitada
  const vista = document.getElementById(`vista-${vistaId}`);
  if (vista) {
    vista.classList.add('activa');
  }

  // Actualiza aria-current en nav-links
  document.querySelectorAll('.nav-link').forEach(link => {
    const esActiva = link.dataset.vista === vistaId;
    link.setAttribute('aria-current', esActiva ? 'page' : 'false');
  });
}