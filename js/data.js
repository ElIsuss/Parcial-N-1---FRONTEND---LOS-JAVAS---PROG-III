// ========================================
// DATA.JS — Repository Pattern + localStorage + Semilla
// ========================================

import { normalizeISBN } from './utils.js';

// ========================================
// ESTADO PRIVADO (no exportado directamente)
// ========================================
const _state = {
  libros: [],
  editoriales: [],
  generos: [],
  autores: [],
  clientes: [],
  ventas: [],
  _inicializado: false
};

// ========================================
// DATOS SEMILLA (IDs estables pregenerados)
// ========================================
const SEED = {
  editoriales: [
    { id: 'ed1', nombre: 'Editorial Sudamericana' },
    { id: 'ed2', nombre: 'Penguin Random House' }
  ],
  generos: [
    { id: 'gen1', nombre: 'Ficción' },
    { id: 'gen2', nombre: 'No Ficción' }
  ],
  autores: [
    { id: 'aut1', nombre: 'Jorge Luis Borges' },
    { id: 'aut2', nombre: 'Julio Cortázar' },
    { id: 'aut3', nombre: 'Adolfo Bioy Casares' }
  ],
  libros: [
    {
      id: 'lib1',
      titulo: 'Ficciones',
      isbn: '978-987-1234-56-7',
      precio: 1500.00,
      editorialId: 'ed1',
      generoId: 'gen1',
      autorIds: ['aut1', 'aut2']
    },
    {
      id: 'lib2',
      titulo: 'Rayuela',
      isbn: '978-950-07-1234-5',
      precio: 2200.00,
      editorialId: 'ed2',
      generoId: 'gen1',
      autorIds: ['aut2']
    },
    {
      id: 'lib3',
      titulo: 'El Aleph',
      isbn: '978-987-6543-21-0',
      precio: 1800.00,
      editorialId: 'ed1',
      generoId: 'gen1',
      autorIds: ['aut1']
    },
    {
      id: 'lib4',
      titulo: 'Sapiens: De animales a dioses',
      isbn: '978-84-397-3456-7',
      precio: 3500.00,
      editorialId: 'ed2',
      generoId: 'gen2',
      autorIds: ['aut3']
    },
    {
      id: 'lib5',
      titulo: 'Historia de la lectura',
      isbn: '978-950-12-3456-7',
      precio: 2800.00,
      editorialId: 'ed1',
      generoId: 'gen2',
      autorIds: ['aut1', 'aut3']
    },
    {
      id: 'lib6',
      titulo: 'Cuentos completos',
      isbn: '978-987-1111-22-2',
      precio: 1900.00,
      editorialId: 'ed2',
      generoId: null,
      autorIds: ['aut2', 'aut3']
    }
  ],
  clientes: [
    { id: 'cli1', nombreCompleto: 'Juan Pérez', email: 'juan@email.com' },
    { id: 'cli2', nombreCompleto: 'María García', email: 'maria@email.com' },
    { id: 'cli3', nombreCompleto: 'Carlos López', email: 'carlos@email.com' }
  ],
  ventas: []
};

// ========================================
// HELPERS INTERNOS (prefijo _)
// ========================================
function _deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function _findById(array, id) {
  return array.find(item => item.id === id);
}

function _findLibroById(id) {
  return _findById(_state.libros, id);
}

function _findClienteById(id) {
  return _findById(_state.clientes, id);
}

function _findEditorialById(id) {
  return _findById(_state.editoriales, id);
}

function _findGeneroById(id) {
  return _findById(_state.generos, id);
}

function _findAutorById(id) {
  return _findById(_state.autores, id);
}

function _isbnExists(normalizedIsbn, excludeId = null) {
  return _state.libros.some(libro => 
    libro.id !== excludeId && normalizeISBN(libro.isbn) === normalizedIsbn
  );
}

function _emailExists(normalizedEmail, excludeId = null) {
  return _state.clientes.some(cliente => 
    cliente.id !== excludeId && cliente.email.trim().toLowerCase() === normalizedEmail
  );
}

// ========================================
// API PÚBLICA EXPORTADA
// ========================================
export const Data = {
  /**
   * Inicializa el repository: carga semilla si es primer inicio, o recupera de localStorage.
   * RN-PER-02, RN-PER-03, DEC-12 — Sync, sin Promises
   */
  inicializar() {
    if (_state._inicializado) return;

    const yaInicializado = localStorage.getItem('libreria_inicializado');

    if (!yaInicializado) {
      // Primer inicio: cargar semilla y persistir
      this.cargarSemilla();
      this.guardarTodos();
      localStorage.setItem('libreria_inicializado', 'true');
    } else {
      // Recuperar de localStorage
      try {
        const libros = JSON.parse(localStorage.getItem('libreria_libros')) || [];
        const clientes = JSON.parse(localStorage.getItem('libreria_clientes')) || [];
        const ventas = JSON.parse(localStorage.getItem('libreria_ventas')) || [];
        const editoriales = JSON.parse(localStorage.getItem('libreria_editoriales')) || [];
        const generos = JSON.parse(localStorage.getItem('libreria_generos')) || [];
        const autores = JSON.parse(localStorage.getItem('libreria_autores')) || [];

        _state.libros = libros.length ? libros : _deepClone(SEED.libros);
        _state.clientes = clientes.length ? clientes : _deepClone(SEED.clientes);
        _state.ventas = ventas.length ? ventas : _deepClone(SEED.ventas);
        _state.editoriales = editoriales.length ? editoriales : _deepClone(SEED.editoriales);
        _state.generos = generos.length ? generos : _deepClone(SEED.generos);
        _state.autores = autores.length ? autores : _deepClone(SEED.autores);

        // Fallback: si localStorage está corrupto/vacío, usar semilla
        if (!_state.libros.length) this.cargarSemilla();
      } catch (e) {
        console.warn('Error leyendo localStorage, usando semilla:', e);
        this.cargarSemilla();
      }
    }

    _state._inicializado = true;
  },

  /**
   * Carga los datos semilla en memoria (copia profunda).
   */
  cargarSemilla() {
    _state.libros = _deepClone(SEED.libros);
    _state.editoriales = _deepClone(SEED.editoriales);
    _state.generos = _deepClone(SEED.generos);
    _state.autores = _deepClone(SEED.autores);
    _state.clientes = _deepClone(SEED.clientes);
    _state.ventas = _deepClone(SEED.ventas);
  },

  /**
   * Persiste todo el estado en localStorage.
   * RN-PER-01, RN-PER-04
   */
  guardarTodos() {
    try {
      localStorage.setItem('libreria_libros', JSON.stringify(_state.libros));
      localStorage.setItem('libreria_clientes', JSON.stringify(_state.clientes));
      localStorage.setItem('libreria_ventas', JSON.stringify(_state.ventas));
      localStorage.setItem('libreria_editoriales', JSON.stringify(_state.editoriales));
      localStorage.setItem('libreria_generos', JSON.stringify(_state.generos));
      localStorage.setItem('libreria_autores', JSON.stringify(_state.autores));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  },

  // ========================================
  // GETTERS READ-ONLY (retornan copias shallow)
  // ========================================
  getLibros() { return [..._state.libros]; },
  getEditoriales() { return [..._state.editoriales]; },
  getGeneros() { return [..._state.generos]; },
  getAutores() { return [..._state.autores]; },
  getClientes() { return [..._state.clientes]; },
  getVentas() { return [..._state.ventas]; },

  // ========================================
  // HELPERS INTERNOS EXPUESTOS (para C-04+)
  // ========================================
  _findLibroById,
  _findClienteById,
  _findEditorialById,
  _findGeneroById,
  _findAutorById,
  _isbnExists,
  _emailExists,

  // ========================================
  // MUTACIONES — STUBS (implementación en C-04/C-05)
  // ========================================
  /**
   * Crea un libro con validaciones RN-LIB-01..06.
   * @param {Object} libro - Datos del libro
   * @returns {{ok: boolean, errors: string[], libro?: Object}}
   */
  crearLibro(libro) {
    // TODO: Implementar en C-04
    return { ok: false, errors: ['No implementado (C-04)'] };
  },

  /**
   * Crea un cliente con validaciones RN-CLI-01..03.
   * @param {Object} cliente - Datos del cliente
   * @returns {{ok: boolean, errors: string[], cliente?: Object}}
   */
  crearCliente(cliente) {
    // TODO: Implementar en C-04
    return { ok: false, errors: ['No implementado (C-04)'] };
  },

  /**
   * Crea una venta con validaciones RN-VTA-01..10.
   * @param {Object} venta - Datos de la venta
   * @returns {{ok: boolean, errors: string[], venta?: Object}}
   */
  crearVenta(venta) {
    // TODO: Implementar en C-05
    return { ok: false, errors: ['No implementado (C-05)'] };
  }
};