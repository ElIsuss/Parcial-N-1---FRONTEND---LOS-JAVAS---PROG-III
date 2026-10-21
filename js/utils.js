// ========================================
// UTILS.JS — Utilidades Compartidas
// ========================================

/**
 * Normaliza un ISBN para comparación: elimina espacios y guiones, convierte a mayúsculas.
 * RN-LIB-08, DEC-05
 * @param {string} isbn - ISBN a normalizar
 * @returns {string} ISBN normalizado
 */
export function normalizeISBN(isbn) {
  return String(isbn).replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Formatea un número como precio en ARS (pesos argentinos) con 2 decimales.
 * SUP-06
 * @param {number} amount - Monto a formatear
 * @returns {string} Precio formateado (ej: "$ 1.500,00")
 */
export function formatPriceARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Valida formato básico de email.
 * RN-CLI-02, DEC-06 — Preparada para C-04
 * @param {string} email - Email a validar
 * @returns {boolean} true si el formato es válido
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

/**
 * Genera un ID único estable (no índice de array).
 * DEC-08, SUP-08 — Preparada para C-04
 * @returns {string} ID único (ej: "k3j2h1f4a7b9c")
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Crea una versión con debounce de una función.
 * PA-12 — Preparada para futuro (filtro con debounce opcional)
 * @param {Function} fn - Función a debouncear
 * @param {number} ms - Milisegundos de espera
 * @returns {Function} Función con debounce
 */
export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}