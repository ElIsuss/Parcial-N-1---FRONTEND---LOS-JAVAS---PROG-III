// ========================================
// DATA.JS — Repository Pattern + localStorage + Semilla
// ========================================

import { normalizeISBN, generateId, isValidEmail } from './utils.js';

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
      return true;
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
      return false;
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
    const errors = [];

    const titulo = String(libro?.titulo ?? '').trim();
    const isbn = String(libro?.isbn ?? '').trim();
    const precio = Number(libro?.precio);
    const editorialId = libro?.editorialId ?? '';
    const generoId = libro?.generoId ?? '';
    const autorIds = Array.isArray(libro?.autorIds)
      ? libro.autorIds
      : (libro?.autorIds ? [libro.autorIds] : []);

    // RN-LIB-01: título requerido
    if (titulo === '') errors.push('El título es obligatorio.');

    // RN-LIB-02, RN-LIB-08: ISBN requerido y único (normalizado)
    const isbnNormalizado = normalizeISBN(isbn);
    if (isbnNormalizado === '') {
      errors.push('El ISBN es obligatorio.');
    } else if (_isbnExists(isbnNormalizado)) {
      errors.push('El ISBN ya está registrado.');
    }

    // RN-LIB-03: precio numérico > 0
    if (!Number.isFinite(precio) || precio <= 0) {
      errors.push('El precio debe ser un número mayor a 0.');
    }

    // RN-LIB-04: editorial obligatoria y existente
    if (!editorialId || !_findEditorialById(editorialId)) {
      errors.push('Debe seleccionar una editorial existente.');
    }

    // RN-LIB-05: género opcional; si se elige, debe existir
    let generoFinal = null;
    if (generoId) {
      if (!_findGeneroById(generoId)) {
        errors.push('El género seleccionado no existe.');
      } else {
        generoFinal = generoId;
      }
    }

    // RN-LIB-06: al menos un autor existente
    const autores = autorIds.filter(id => id);
    if (autores.length < 1) {
      errors.push('Debe seleccionar al menos un autor.');
    } else if (autores.some(id => !_findAutorById(id))) {
      errors.push('Uno o más autores seleccionados no existen.');
    }

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    // DEC-08: ID estable con re-generación si colisiona
    let id = generateId();
    while (_findLibroById(id)) {
      id = generateId();
    }

    const libroCreado = {
      id,
      titulo,
      isbn,
      precio,
      editorialId,
      generoId: generoFinal,
      autorIds: autores
    };

    _state.libros.push(libroCreado);
    this.guardarTodos();
    return { ok: true, errors: [], libro: libroCreado };
  },

  /**
   * Crea un cliente con validaciones RN-CLI-01..03.
   * @param {Object} cliente - Datos del cliente
   * @returns {{ok: boolean, errors: string[], cliente?: Object}}
   */
  crearCliente(cliente) {
    const errors = [];

    const nombreCompleto = String(cliente?.nombreCompleto ?? '').trim();
    const email = String(cliente?.email ?? '').trim();

    // RN-CLI-01: nombre completo requerido
    if (nombreCompleto === '') errors.push('El nombre completo es obligatorio.');

    // RN-CLI-02: email requerido y formato válido
    if (email === '') {
      errors.push('El email es obligatorio.');
    } else if (!isValidEmail(email)) {
      errors.push('El formato del email no es válido.');
    } else if (_emailExists(email.toLowerCase())) {
      // RN-CLI-03: email único case-insensitive (ya viene con trim)
      errors.push('El email ya está registrado.');
    }

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    // DEC-08: ID estable con re-generación si colisiona
    let id = generateId();
    while (_findClienteById(id)) {
      id = generateId();
    }

    const clienteCreado = { id, nombreCompleto, email };

    _state.clientes.push(clienteCreado);
    this.guardarTodos();
    return { ok: true, errors: [], cliente: clienteCreado };
  },

  /**
   * Crea una venta con validaciones RN-VTA-01..10.
   * @param {Object} venta - Datos de la venta { clienteId, renglones[] }
   * @returns {{ok: boolean, errors: string[], venta?: Object}}
   */
  crearVenta(venta) {
    const errors = [];

    // RN-VTA-01: Cliente obligatorio
    const clienteId = venta?.clienteId ?? '';
    if (!clienteId || !this._findClienteById(clienteId)) {
      errors.push('Seleccione un cliente válido');
    }

    // RN-VTA-02: Mínimo un renglón
    const renglonesEntrada = Array.isArray(venta?.renglones) ? venta.renglones : [];
    if (renglonesEntrada.length === 0) {
      errors.push('Agregue al menos un renglón');
    }

    // Validar cada renglón
    const renglonesConSnapshot = [];
    renglonesEntrada.forEach((r, idx) => {
      // RN-VTA-03: Cantidad entera > 0
      if (!Number.isInteger(r.cantidad) || r.cantidad <= 0) {
        errors.push(`Renglón ${idx + 1}: cantidad debe ser entero mayor a 0`);
      }
      // RN-VTA-04: Libro existente
      const libro = this._findLibroById(r.libroId);
      if (!libro) {
        errors.push(`Renglón ${idx + 1}: libro no encontrado`);
      } else if (!Number.isFinite(libro.precio) || libro.precio <= 0) {
        errors.push(`Renglón ${idx + 1}: precio de libro inválido`);
      } else {
        // Snapshot de precio (RN-VTA-08) + datos descriptivos (RN-VTA-09)
        const precioSnapshot = Number(libro.precio.toFixed(2));
        const subtotal = Number((r.cantidad * precioSnapshot).toFixed(2));
        renglonesConSnapshot.push({
          libroId: r.libroId,
          cantidad: r.cantidad,
          precioUnitarioSnapshot: precioSnapshot,
          subtotal,
          titulo: libro.titulo,
          isbn: libro.isbn,
        });
      }
    });

    // RN-VTA-05: Sin libros duplicados en la misma venta (por libroId)
    const idsVistos = new Set();
    renglonesEntrada.forEach((r, idx) => {
      if (idsVistos.has(r.libroId)) {
        errors.push(`Renglón ${idx + 1}: libro duplicado (debe sumarse cantidad)`);
      } else {
        idsVistos.add(r.libroId);
      }
    });

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    // RN-VTA-06/07: Total = suma subtotales (2 decimales)
    const total = Number(renglonesConSnapshot.reduce((acc, r) => acc + r.subtotal, 0).toFixed(2));

    // Construir objeto Venta completo
    let id = generateId();
    while (_state.ventas.some(v => v.id === id)) {
      id = generateId();
    }

    const ventaCreada = {
      id,
      fecha: new Date().toISOString(),
      clienteId,
      renglones: renglonesConSnapshot,
      total,
    };

    _state.ventas.push(ventaCreada);
    if (!this.guardarTodos()) {
      _state.ventas.pop();
      return { ok: false, errors: ['No se pudo guardar la venta en el almacenamiento local'] };
    }
    return { ok: true, errors: [], venta: ventaCreada };
  }
};