/**
 * @fileoverview Servicio CRUD para la tabla `registros` en Supabase.
 * 
 * Antes de cada INSERT/UPDATE, se ejecutan los cálculos de indicadores
 * para garantizar que los campos derivados siempre estén actualizados.
 * 
 * Todas las funciones retornan `{ data, error }` siguiendo el patrón
 * convencional de Supabase.
 * 
 * @module services/registroService
 */

import { getSupabase } from '../db/supabaseClient.js';
import { calcularTodosLosIndicadores } from './calculoService.js';
import { MESES } from '../models/incidente.js';

/** Nombre de la tabla en Supabase */
const TABLA = 'registros';

// ─────────────────────────────────────────────────────────
//  Utilidades internas
// ─────────────────────────────────────────────────────────

/**
 * Construye un índice numérico por nombre de mes para ordenar resultados.
 * @type {Record<string, number>}
 */
const MES_ORDEN = Object.fromEntries(MESES.map((m, i) => [m, i]));

/**
 * Ordena un arreglo de registros por año (DESC) y luego por mes (ASC).
 * @param {Object[]} registros
 * @returns {Object[]} Registros ordenados
 */
function ordenarRegistros(registros) {
    return [...registros].sort((a, b) => {
        if (b.anio !== a.anio) return b.anio - a.anio;
        return (MES_ORDEN[a.mes] ?? 99) - (MES_ORDEN[b.mes] ?? 99);
    });
}

/**
 * Aplica filtros opcionales a una consulta de Supabase.
 * @param {Object} query  — Consulta Supabase en construcción
 * @param {Object} filters
 * @param {string} [filters.tipo]
 * @param {number} [filters.anio]
 * @param {string} [filters.mes]
 * @returns {Object} Consulta con filtros aplicados
 */
function applyFilters(query, filters = {}) {
    if (filters.tipo) {
        query = query.eq('tipo', filters.tipo);
    }
    if (filters.anio) {
        query = query.eq('anio', filters.anio);
    }
    if (filters.mes) {
        query = query.eq('mes', filters.mes);
    }
    return query;
}

// ─────────────────────────────────────────────────────────
//  CRUD
// ─────────────────────────────────────────────────────────

/**
 * Obtiene todos los registros, opcionalmente filtrados.
 * 
 * @param {Object}  [filters={}]
 * @param {string}  [filters.tipo]  — 'Directo' | 'Contratista'
 * @param {number}  [filters.anio]  — Año a filtrar
 * @param {string}  [filters.mes]   — Nombre del mes en español
 * @returns {Promise<{data: Object[]|null, error: Error|null}>}
 * 
 * @example
 * const { data, error } = await getAllRegistros({ anio: 2025, tipo: 'Directo' });
 */
export async function getAllRegistros(filters = {}) {
    try {
        const sb = getSupabase();
        let query = sb.from(TABLA).select('*');
        query = applyFilters(query, filters);

        const { data, error } = await query;

        if (error) {
            console.error('[registroService] getAllRegistros error:', error);
            return { data: null, error };
        }

        return { data: ordenarRegistros(data), error: null };
    } catch (err) {
        console.error('[registroService] getAllRegistros excepción:', err);
        return { data: null, error: err };
    }
}

/**
 * Obtiene un registro individual por su UUID.
 * 
 * @param {string} id — UUID del registro
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getRegistroById(id) {
    try {
        const sb = getSupabase();
        const { data, error } = await sb
            .from(TABLA)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[registroService] getRegistroById error:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error('[registroService] getRegistroById excepción:', err);
        return { data: null, error: err };
    }
}

/**
 * Crea un nuevo registro. Calcula los indicadores antes de insertar.
 * 
 * @param {Object} data — Datos de entrada (campos manuales)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 * 
 * @example
 * const { data, error } = await createRegistro({
 *     tipo: 'Directo', anio: 2025, mes: 'Enero',
 *     num_trabajadores: 100, hht: 16000,
 *     dp: 1, nm: 2, fai: 0, mti: 0, mwd: 0, lti: 1,
 *     fatalidad: 0, dias_incapacidad_at: 5, dias_cargados: 0,
 *     casos_eg: 0, incapacidad_eg: 0, casos_el: 0
 * });
 */
export async function createRegistro(data) {
    try {
        // Calcular indicadores derivados
        const indicadores = calcularTodosLosIndicadores(data);
        const registro = { ...data, ...indicadores };

        // No enviar 'id' — Supabase lo genera
        delete registro.id;
        delete registro.created_at;

        const sb = getSupabase();
        const { data: inserted, error } = await sb
            .from(TABLA)
            .insert(registro)
            .select()
            .single();

        if (error) {
            console.error('[registroService] createRegistro error:', error);
            return { data: null, error };
        }

        return { data: inserted, error: null };
    } catch (err) {
        console.error('[registroService] createRegistro excepción:', err);
        return { data: null, error: err };
    }
}

/**
 * Actualiza un registro existente. Recalcula los indicadores antes de actualizar.
 * 
 * @param {string} id   — UUID del registro a actualizar
 * @param {Object} data — Campos actualizados (entrada manual)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateRegistro(id, data) {
    try {
        // Recalcular indicadores con los datos actualizados
        const indicadores = calcularTodosLosIndicadores(data);
        const registro = { ...data, ...indicadores };

        // No sobrescribir metadatos
        delete registro.id;
        delete registro.created_at;

        const sb = getSupabase();
        const { data: updated, error } = await sb
            .from(TABLA)
            .update(registro)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[registroService] updateRegistro error:', error);
            return { data: null, error };
        }

        return { data: updated, error: null };
    } catch (err) {
        console.error('[registroService] updateRegistro excepción:', err);
        return { data: null, error: err };
    }
}

/**
 * Elimina un registro por su UUID.
 * 
 * @param {string} id — UUID del registro a eliminar
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function deleteRegistro(id) {
    try {
        const sb = getSupabase();
        const { data, error } = await sb
            .from(TABLA)
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[registroService] deleteRegistro error:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error('[registroService] deleteRegistro excepción:', err);
        return { data: null, error: err };
    }
}

/**
 * Obtiene registros optimizados para el dashboard.
 * Idéntica funcionalidad a getAllRegistros pero con intención semántica
 * separada para facilitar futuras optimizaciones (paginación, campos reducidos, etc.).
 * 
 * @param {Object}  [filters={}]
 * @param {string}  [filters.tipo]
 * @param {number}  [filters.anio]
 * @param {string}  [filters.mes]
 * @returns {Promise<{data: Object[]|null, error: Error|null}>}
 */
export async function getRegistrosParaDashboard(filters = {}) {
    try {
        const sb = getSupabase();
        let query = sb.from(TABLA).select('*');
        query = applyFilters(query, filters);

        const { data, error } = await query;

        if (error) {
            console.error('[registroService] getRegistrosParaDashboard error:', error);
            return { data: null, error };
        }

        return { data: ordenarRegistros(data), error: null };
    } catch (err) {
        console.error('[registroService] getRegistrosParaDashboard excepción:', err);
        return { data: null, error: err };
    }
}

/**
 * Obtiene la lista de años distintos disponibles en la tabla de registros.
 * Útil para poblar filtros / selects de año.
 * 
 * @returns {Promise<{data: number[]|null, error: Error|null}>}
 * 
 * @example
 * const { data: anios } = await getAniosDisponibles();
 * // [2026, 2025, 2024]
 */
export async function getAniosDisponibles() {
    try {
        const sb = getSupabase();
        const { data, error } = await sb
            .from(TABLA)
            .select('anio');

        if (error) {
            console.error('[registroService] getAniosDisponibles error:', error);
            return { data: null, error };
        }

        // Extraer valores únicos y ordenar descendente
        const aniosUnicos = [...new Set(data.map(r => r.anio))].sort((a, b) => b - a);
        return { data: aniosUnicos, error: null };
    } catch (err) {
        console.error('[registroService] getAniosDisponibles excepción:', err);
        return { data: null, error: err };
    }
}
