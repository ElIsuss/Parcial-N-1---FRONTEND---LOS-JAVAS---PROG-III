// ========================================
// DATA.JS — Cliente HTTP + Capa de Datos API (FastAPI)
// ========================================

import { normalizeISBN, isValidEmail } from './utils.js';

// ========================================
// CONFIGURACIÓN DE URL BASE
// ========================================
/**
 * Determina la URL base de la API:
 * - Si window.API_BASE_URL está definida, la usa.
 * - Si se sirve desde archivo local (file:) o un puerto de dev distinto (5500, 5173, 3000),
 *   usa http://localhost:8000 por defecto (salvo que /api responda detrás de Nginx).
 * - En contenedores detrás de Nginx, usa '/api'.
 */
function _resolveBaseUrl() {
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return String(window.API_BASE_URL).replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname, port } = window.location;
    if (protocol === 'file:') {
      return 'http://localhost:8000';
    }
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port && port !== '80' && port !== '8080') {
      return 'http://localhost:8000';
    }
  }
  return '/api';
}

const API_BASE_URL = _resolveBaseUrl();

// ========================================
// CACHÉ EN MEMORIA DE SESIÓN
// ========================================
const _state = {
  libros: [],
  editoriales: [],
  generos: [],
  autoresCache: new Map(), // id (number) -> AutorRead
  clientes: [],            // clientes dados de alta o buscados por ID en la sesión
  ventas: [],
  _inicializado: false,
  _ultimoErrorRed: null
};

// ========================================
// CLIENTE HTTP CENTRALIZADO
// ========================================

/**
 * Extrae una lista de mensajes legibles desde la respuesta de error de FastAPI.
 * @param {number} status
 * @param {any} body
 * @returns {string[]}
 */
function _parsearErroresFastAPI(status, body) {
  if (body && typeof body === 'object') {
    if (typeof body.detail === 'string') {
      return [body.detail];
    }
    if (Array.isArray(body.detail)) {
      return body.detail.map(err => {
        const campo = Array.isArray(err.loc) ? err.loc.slice(1).join('.') : '';
        const msg = err.msg || 'Valor inválido';
        return campo ? `Campo "${campo}": ${msg}` : msg;
      });
    }
  }
  if (status === 404) return ['El recurso solicitado no fue encontrado (404).'];
  if (status === 409) return ['Conflicto de negocio con el estado actual (409).'];
  if (status === 422) return ['Los datos enviados no superaron la validación (422).'];
  return [`Error del servidor (HTTP ${status}).`];
}

/**
 * Ejecuta una petición HTTP hacia LIBRERIA-API.
 * @param {string} path - Ruta relativa (ej. '/libros/' o '/clientes/1')
 * @param {RequestInit} options
 * @returns {Promise<{ok: boolean, status: number, data?: any, errors: string[]}>}
 */
async function _request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    let payload = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = text ? { detail: text } : null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        errors: _parsearErroresFastAPI(response.status, payload)
      };
    }

    _state._ultimoErrorRed = null;
    return {
      ok: true,
      status: response.status,
      data: payload,
      errors: []
    };
  } catch (err) {
    const msg = 'No se pudo conectar con la API del backend. Verifique que el servidor esté en ejecución.';
    _state._ultimoErrorRed = msg;
    return {
      ok: false,
      status: 0,
      errors: [msg]
    };
  }
}

/**
 * Registra o actualiza un cliente en la memoria de sesión (evita duplicados por id).
 * @param {Object} clienteApi - { id, nombre, email, perfil? }
 * @returns {Object}
 */
function _registrarClienteEnSesion(clienteApi) {
  if (!clienteApi || clienteApi.id == null) return null;
  const normalizado = {
    id: Number(clienteApi.id),
    nombre: clienteApi.nombre,
    nombreCompleto: clienteApi.nombre, // alias compatible con vistas previas
    email: clienteApi.email,
    perfil: clienteApi.perfil || null
  };
  const idx = _state.clientes.findIndex(c => Number(c.id) === normalizado.id);
  if (idx >= 0) {
    _state.clientes[idx] = normalizado;
  } else {
    _state.clientes.push(normalizado);
  }
  return normalizado;
}

/**
 * Normaliza un libro recibido desde la API (LibroLista o LibroDetalle).
 * @param {Object} libroApi
 * @returns {Object}
 */
function _normalizarLibro(libroApi) {
  return {
    id: Number(libroApi.id),
    isbn: libroApi.isbn,
    titulo: libroApi.titulo,
    precio: Number(libroApi.precio),
    stock: Number(libroApi.stock ?? 0),
    editorial: libroApi.editorial || null,
    genero: libroApi.genero || null,
    editorialId: libroApi.editorial ? Number(libroApi.editorial.id) : null,
    generoId: libroApi.genero ? Number(libroApi.genero.id) : null,
    autores: Array.isArray(libroApi.autores) ? libroApi.autores : null
  };
}

/**
 * Normaliza una venta recibida desde la API (VentaRead).
 * @param {Object} ventaApi
 * @returns {Object}
 */
function _normalizarVenta(ventaApi) {
  if (ventaApi?.cliente) {
    _registrarClienteEnSesion(ventaApi.cliente);
  }
  return {
    id: Number(ventaApi.id),
    fecha: ventaApi.fecha,
    total: Number(ventaApi.total),
    cliente: ventaApi.cliente
      ? {
          id: Number(ventaApi.cliente.id),
          nombre: ventaApi.cliente.nombre,
          email: ventaApi.cliente.email
        }
      : null,
    clienteId: ventaApi.cliente ? Number(ventaApi.cliente.id) : null,
    renglones: Array.isArray(ventaApi.renglones)
      ? ventaApi.renglones.map(r => ({
          libro_id: Number(r.libro_id),
          libroId: Number(r.libro_id),
          titulo: r.titulo,
          cantidad: Number(r.cantidad),
          precio_unitario: Number(r.precio_unitario),
          precioUnitarioSnapshot: Number(r.precio_unitario),
          subtotal: Number(r.subtotal)
        }))
      : []
  };
}

// ========================================
// API PÚBLICA EXPORTADA
// ========================================
export const Data = {
  getBaseUrl() {
    return API_BASE_URL;
  },

  getUltimoErrorRed() {
    return _state._ultimoErrorRed;
  },

  /**
   * Inicializa la aplicación consultando editoriales, géneros, catálogo inicial y ventas.
   * @returns {Promise<{ok: boolean, errors: string[]}>}
   */
  async inicializar() {
    const [resEd, resGen, resLib, resVen] = await Promise.all([
      _request('/editoriales/?limit=100&offset=0'),
      _request('/generos/?limit=100&offset=0'),
      _request('/libros/?limit=100&offset=0'),
      _request('/ventas/?limit=100&offset=0')
    ]);

    if (resEd.ok && Array.isArray(resEd.data)) {
      _state.editoriales = resEd.data.map(e => ({ id: Number(e.id), nombre: e.nombre, pais: e.pais }));
    }
    if (resGen.ok && Array.isArray(resGen.data)) {
      _state.generos = resGen.data.map(g => ({ id: Number(g.id), nombre: g.nombre }));
    }
    if (resLib.ok && Array.isArray(resLib.data)) {
      _state.libros = resLib.data.map(_normalizarLibro);
    }
    if (resVen.ok && Array.isArray(resVen.data)) {
      _state.ventas = resVen.data.map(_normalizarVenta);
    }

    _state._inicializado = true;

    const errores = [
      ...(resEd.ok ? [] : resEd.errors),
      ...(resGen.ok ? [] : resGen.errors),
      ...(resLib.ok ? [] : resLib.errors)
    ];

    return {
      ok: resEd.ok && resGen.ok && resLib.ok,
      errors: [...new Set(errores)]
    };
  },

  // ========================================
  // GETTERS SINCRÓNICOS DEL CACHÉ ACTUAL
  // ========================================
  getLibros() { return [..._state.libros]; },
  getEditoriales() { return [..._state.editoriales]; },
  getGeneros() { return [..._state.generos]; },
  getClientes() { return [..._state.clientes]; },
  getVentas() { return [..._state.ventas]; },

  _findEditorialById(id) {
    return _state.editoriales.find(e => Number(e.id) === Number(id)) || null;
  },
  _findGeneroById(id) {
    return _state.generos.find(g => Number(g.id) === Number(id)) || null;
  },
  _findLibroById(id) {
    return _state.libros.find(l => Number(l.id) === Number(id)) || null;
  },
  _findClienteById(id) {
    return _state.clientes.find(c => Number(c.id) === Number(id)) || null;
  },

  // ========================================
  // OPERACIONES REMOTAS — CATÁLOGO Y LIBROS
  // ========================================

  /**
   * Consulta GET /libros/ con filtros opcionales de título y género.
   * @param {{titulo?: string, generoId?: number|string, limit?: number, offset?: number}} filtros
   * @returns {Promise<{ok: boolean, libros: Array, errors: string[]}>}
   */
  async fetchLibros(filtros = {}) {
    const params = new URLSearchParams();
    params.set('limit', String(filtros.limit ?? 100));
    params.set('offset', String(filtros.offset ?? 0));

    const titulo = String(filtros.titulo ?? '').trim();
    if (titulo) {
      params.set('titulo', titulo);
    }
    if (filtros.generoId !== undefined && filtros.generoId !== null && String(filtros.generoId) !== '') {
      params.set('genero_id', String(filtros.generoId));
    }

    const res = await _request(`/libros/?${params.toString()}`);
    if (!res.ok) {
      return { ok: false, libros: [], errors: res.errors };
    }

    const lista = Array.isArray(res.data) ? res.data.map(_normalizarLibro) : [];
    // Si se consultó sin filtros, actualizar caché general de libros
    if (!titulo && !filtros.generoId) {
      _state.libros = lista;
    }
    return { ok: true, libros: lista, errors: [] };
  },

  /**
   * Consulta GET /libros/{id} para obtener el detalle completo incluyendo autores.
   * @param {number|string} id
   * @returns {Promise<{ok: boolean, libro?: Object, errors: string[]}>}
   */
  async fetchLibroDetalle(id) {
    const libroId = Number(id);
    if (!Number.isInteger(libroId) || libroId <= 0) {
      return { ok: false, errors: ['ID de libro inválido.'] };
    }
    const res = await _request(`/libros/${libroId}`);
    if (!res.ok) {
      return { ok: false, errors: res.errors };
    }
    const detalle = _normalizarLibro(res.data);
    const idx = _state.libros.findIndex(l => l.id === detalle.id);
    if (idx >= 0) {
      _state.libros[idx] = { ..._state.libros[idx], ...detalle };
    }
    return { ok: true, libro: detalle, errors: [] };
  },

  /**
   * Consulta GET /autores/{id} para verificar la existencia de un autor antes de agregarlo a un libro.
   * @param {number|string} id
   * @returns {Promise<{ok: boolean, autor?: {id: number, nombre: string, nacionalidad: string}, errors: string[]}>}
   */
  async fetchAutorPorId(id) {
    const autorId = Number(id);
    if (!Number.isInteger(autorId) || autorId <= 0) {
      return { ok: false, errors: ['Ingrese un ID de autor numérico mayor a 0.'] };
    }
    const res = await _request(`/autores/${autorId}`);
    if (!res.ok) {
      return { ok: false, errors: res.errors };
    }
    const autor = {
      id: Number(res.data.id),
      nombre: res.data.nombre,
      nacionalidad: res.data.nacionalidad
    };
    _state.autoresCache.set(autor.id, autor);
    return { ok: true, autor, errors: [] };
  },

  /**
   * Crea un libro enviando POST /libros/ a FastAPI.
   * @param {Object} datos
   * @returns {Promise<{ok: boolean, libro?: Object, errors: string[]}>}
   */
  async crearLibro(datos) {
    const errors = [];
    const titulo = String(datos?.titulo ?? '').trim();
    const isbn = String(datos?.isbn ?? '').trim();
    const precio = Number(datos?.precio);
    const stock = datos?.stock !== undefined && datos?.stock !== '' ? Number(datos.stock) : 0;
    const editorialId = Number(datos?.editorialId ?? datos?.editorial_id);
    const rawGenero = datos?.generoId ?? datos?.genero_id;
    const generoId = rawGenero !== undefined && rawGenero !== null && String(rawGenero) !== ''
      ? Number(rawGenero)
      : null;
    const autores = Array.isArray(datos?.autores) ? datos.autores : [];

    if (!titulo) errors.push('El título es obligatorio.');
    if (!normalizeISBN(isbn)) errors.push('El ISBN es obligatorio.');
    if (!Number.isFinite(precio) || precio <= 0) errors.push('El precio debe ser un número mayor a 0.');
    if (!Number.isInteger(stock) || stock < 0) errors.push('El stock debe ser un entero mayor o igual a 0.');
    if (!Number.isInteger(editorialId) || editorialId <= 0) errors.push('Debe seleccionar una editorial válida.');
    if (autores.length < 1) errors.push('Debe agregar al menos un autor verificado al libro.');

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    const payload = {
      isbn,
      titulo,
      precio,
      stock,
      editorial_id: editorialId,
      genero_id: generoId,
      autores: autores.map((a, idx) => ({
        autor_id: Number(a.autor_id ?? a.id),
        rol: a.rol || 'autor',
        orden: Number(a.orden ?? idx + 1)
      }))
    };

    const res = await _request('/libros/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { ok: false, errors: res.errors };
    }

    const creado = _normalizarLibro(res.data);
    _state.libros.push(creado);
    return { ok: true, libro: creado, errors: [] };
  },

  // ========================================
  // OPERACIONES REMOTAS — CLIENTES
  // ========================================

  /**
   * Consulta GET /clientes/{id} y registra el cliente en la sesión actual.
   * @param {number|string} id
   * @returns {Promise<{ok: boolean, cliente?: Object, errors: string[]}>}
   */
  async fetchClientePorId(id) {
    const clienteId = Number(id);
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      return { ok: false, errors: ['Ingrese un ID de cliente numérico mayor a 0.'] };
    }
    const res = await _request(`/clientes/${clienteId}`);
    if (!res.ok) {
      return { ok: false, errors: res.errors };
    }
    const cliente = _registrarClienteEnSesion(res.data);
    return { ok: true, cliente, errors: [] };
  },

  /**
   * Crea un cliente enviando POST /clientes/ a FastAPI.
   * @param {{nombre?: string, nombreCompleto?: string, email: string}} datos
   * @returns {Promise<{ok: boolean, cliente?: Object, errors: string[]}>}
   */
  async crearCliente(datos) {
    const errors = [];
    const nombre = String(datos?.nombre ?? datos?.nombreCompleto ?? '').trim();
    const email = String(datos?.email ?? '').trim();

    if (!nombre) errors.push('El nombre completo es obligatorio.');
    if (!email) {
      errors.push('El email es obligatorio.');
    } else if (!isValidEmail(email)) {
      errors.push('El formato del email no es válido.');
    }

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    const res = await _request('/clientes/', {
      method: 'POST',
      body: JSON.stringify({ nombre, email })
    });

    if (!res.ok) {
      return { ok: false, errors: res.errors };
    }

    const cliente = _registrarClienteEnSesion(res.data);
    return { ok: true, cliente, errors: [] };
  },

  // ========================================
  // OPERACIONES REMOTAS — VENTAS E HISTORIAL
  // ========================================

  /**
   * Consulta GET /ventas/ para poblar el historial.
   * @returns {Promise<{ok: boolean, ventas: Array, errors: string[]}>}
   */
  async fetchVentas() {
    const res = await _request('/ventas/?limit=100&offset=0');
    if (!res.ok) {
      return { ok: false, ventas: [], errors: res.errors };
    }
    _state.ventas = Array.isArray(res.data) ? res.data.map(_normalizarVenta) : [];
    return { ok: true, ventas: [..._state.ventas], errors: [] };
  },

  /**
   * Consulta GET /ventas/{id} para obtener el detalle actualizado de una venta.
   * @param {number|string} id
   * @returns {Promise<{ok: boolean, venta?: Object, errors: string[]}>}
   */
  async fetchVentaPorId(id) {
    const ventaId = Number(id);
    if (!Number.isInteger(ventaId) || ventaId <= 0) {
      return { ok: false, errors: ['ID de venta inválido.'] };
    }
    const res = await _request(`/ventas/${ventaId}`);
    if (!res.ok) {
      return { ok: false, errors: res.errors };
    }
    const venta = _normalizarVenta(res.data);
    const idx = _state.ventas.findIndex(v => v.id === venta.id);
    if (idx >= 0) {
      _state.ventas[idx] = venta;
    } else {
      _state.ventas.unshift(venta);
    }
    return { ok: true, venta, errors: [] };
  },

  /**
   * Envía POST /ventas/ al backend y refresca el stock del catálogo.
   * @param {{clienteId: number|string, renglones: Array<{libroId: number|string, cantidad: number}>}} datos
   * @returns {Promise<{ok: boolean, venta?: Object, errors: string[]}>}
   */
  async crearVenta(datos) {
    const errors = [];
    const clienteId = Number(datos?.clienteId ?? datos?.cliente_id);
    const renglonesEntrada = Array.isArray(datos?.renglones) ? datos.renglones : [];

    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      errors.push('Debe seleccionar o verificar un cliente válido.');
    }
    if (renglonesEntrada.length === 0) {
      errors.push('La venta debe tener al menos un renglón.');
    }

    const renglonesPayload = [];
    for (const [idx, r] of renglonesEntrada.entries()) {
      const libroId = Number(r.libroId ?? r.libro_id);
      const cantidad = Number(r.cantidad);
      if (!Number.isInteger(libroId) || libroId <= 0) {
        errors.push(`Renglón ${idx + 1}: libro inválido.`);
        continue;
      }
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        errors.push(`Renglón ${idx + 1}: la cantidad debe ser un entero mayor a 0.`);
        continue;
      }
      renglonesPayload.push({ libro_id: libroId, cantidad });
    }

    if (errors.length > 0) {
      return { ok: false, errors };
    }

    const res = await _request('/ventas/', {
      method: 'POST',
      body: JSON.stringify({
        cliente_id: clienteId,
        renglones: renglonesPayload
      })
    });

    if (!res.ok) {
      return { ok: false, errors: res.errors };
    }

    const ventaCreada = _normalizarVenta(res.data);
    _state.ventas.unshift(ventaCreada);

    // Refrescar libros desde la API para reflejar el descuento de stock
    await this.fetchLibros();

    return { ok: true, venta: ventaCreada, errors: [] };
  }
};
