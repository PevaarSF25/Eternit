/**
 * @fileoverview Modelo de datos para registros de incidentes HSE.
 * 
 * Define la estructura, etiquetas, valores por defecto y clasificación
 * de campos (entrada manual vs. calculados) para la tabla `registros`.
 * 
 * @module models/incidente
 */

// ─────────────────────────────────────────────────────────
//  Meses en español
// ─────────────────────────────────────────────────────────

/** Lista ordenada de meses del año en español */
export const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/** Tipos de trabajador válidos */
export const TIPOS_TRABAJADOR = ['Directo', 'Contratista'];

// ─────────────────────────────────────────────────────────
//  Definición de campos
// ─────────────────────────────────────────────────────────

/**
 * @typedef {Object} CampoDefinicion
 * @property {string}  key        — nombre de la columna en la BD (snake_case)
 * @property {string}  label      — etiqueta visible en español
 * @property {string}  type       — 'text' | 'integer' | 'numeric' | 'select'
 * @property {boolean} calculated — true si el valor se calcula automáticamente
 * @property {*}       default    — valor por defecto para registros nuevos
 */

/** @type {CampoDefinicion[]} */
export const FIELD_DEFINITIONS = [
    // ── Campos de contexto ──
    { key: 'tipo',                    label: 'Tipo',                                                type: 'select',  calculated: false, default: 'Directo' },
    { key: 'anio',                    label: 'Año',                                                 type: 'integer', calculated: false, default: new Date().getFullYear() },
    { key: 'mes',                     label: 'Mes',                                                 type: 'select',  calculated: false, default: '' },

    // ── Campos de entrada numérica ──
    { key: 'num_trabajadores',        label: 'N° Trabajadores',                                     type: 'integer', calculated: false, default: 0 },
    { key: 'hht',                     label: 'HHT - Horas hombres de trabajo',                      type: 'numeric', calculated: false, default: 0 },
    { key: 'dp',                      label: 'N° DP - Daños a la propiedad',                        type: 'integer', calculated: false, default: 0 },
    { key: 'nm',                      label: 'N° NM - Near miss (Casi accidente)',                   type: 'integer', calculated: false, default: 0 },
    { key: 'fai',                     label: 'N° FAI - Lesión con primeros auxilios',                type: 'integer', calculated: false, default: 0 },
    { key: 'mti',                     label: 'N° MTI - Lesión con tratamiento médico',               type: 'integer', calculated: false, default: 0 },
    { key: 'mwd',                     label: 'N° MWD - Restricciones médicas',                      type: 'integer', calculated: false, default: 0 },
    { key: 'lti',                     label: 'N° LTI - Lesión con tiempo perdido (incapacitante)',   type: 'integer', calculated: false, default: 0 },
    { key: 'fatalidad',              label: 'N° Fatalidad',                                         type: 'integer', calculated: false, default: 0 },
    { key: 'dias_incapacidad_at',    label: 'N° Días Incapacitados x AT',                           type: 'integer', calculated: false, default: 0 },
    { key: 'dias_cargados',          label: 'N° Cargados',                                          type: 'integer', calculated: false, default: 0 },
    { key: 'casos_eg',               label: 'N° Casos EG',                                          type: 'integer', calculated: false, default: 0 },
    { key: 'incapacidad_eg',         label: 'N° Incapacidad EG',                                    type: 'integer', calculated: false, default: 0 },
    { key: 'casos_el',               label: 'N° Casos EL',                                          type: 'integer', calculated: false, default: 0 },

    // ── Campos calculados ──
    { key: 'incidentes_lesiones',    label: 'N° Incidentes Lesiones (FAI, MTI, MWD, LTI)',           type: 'numeric', calculated: true,  default: 0 },
    { key: 'total_incidentes',       label: 'N° Total Incidentes (Incluye DP, NM)',                  type: 'numeric', calculated: true,  default: 0 },
    { key: 'ltif',                    label: 'LTIF',                                                type: 'numeric', calculated: true,  default: 0 },
    { key: 'tirf',                    label: 'TIRF',                                                type: 'numeric', calculated: true,  default: 0 },
    { key: 'sr',                      label: 'SR',                                                  type: 'numeric', calculated: true,  default: 0 },
    { key: 'frecuencia_accidentalidad', label: 'Frecuencia de Accidentalidad',                      type: 'numeric', calculated: true,  default: 0 },
    { key: 'severidad_accidentalidad',  label: 'Severidad Accidentalidad',                          type: 'numeric', calculated: true,  default: 0 },
    { key: 'proporcion_mortalidad',     label: '% Proporción de Mortalidad',                        type: 'numeric', calculated: true,  default: 0 },
];

// ─────────────────────────────────────────────────────────
//  Listas derivadas (para formularios y tablas)
// ─────────────────────────────────────────────────────────

/** Campos que el usuario llena manualmente */
export const INPUT_FIELDS = FIELD_DEFINITIONS.filter(f => !f.calculated);

/** Campos cuyo valor se calcula automáticamente */
export const CALCULATED_FIELDS = FIELD_DEFINITIONS.filter(f => f.calculated);

// ─────────────────────────────────────────────────────────
//  Fábrica de registros
// ─────────────────────────────────────────────────────────

/**
 * Crea un registro en blanco con todos los valores por defecto.
 * Útil para inicializar formularios de nuevo registro.
 * 
 * @returns {Object} Objeto con todas las claves del modelo y sus valores por defecto
 * 
 * @example
 * import { crearRegistroVacio } from './models/incidente.js';
 * const nuevoRegistro = crearRegistroVacio();
 * // { tipo: 'Directo', anio: 2026, mes: '', num_trabajadores: 0, ... }
 */
export function crearRegistroVacio() {
    /** @type {Record<string, any>} */
    const registro = {};
    for (const field of FIELD_DEFINITIONS) {
        registro[field.key] = field.default;
    }
    return registro;
}

/**
 * Obtiene la definición de un campo por su clave.
 * 
 * @param {string} key — nombre de la columna (snake_case)
 * @returns {CampoDefinicion | undefined}
 */
export function getFieldDefinition(key) {
    return FIELD_DEFINITIONS.find(f => f.key === key);
}

/**
 * Devuelve un mapa clave → etiqueta para uso rápido en la UI.
 * 
 * @returns {Record<string, string>}
 */
export function getLabelsMap() {
    /** @type {Record<string, string>} */
    const map = {};
    for (const field of FIELD_DEFINITIONS) {
        map[field.key] = field.label;
    }
    return map;
}
