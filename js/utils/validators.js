/**
 * @fileoverview Funciones de validación para la aplicación Eternit HSE.
 * 
 * Proporciona validaciones para registros de incidentes y parámetros,
 * retornando objetos con `{ valid, errors }` para fácil integración con la UI.
 * 
 * @module utils/validators
 */

import { MESES, TIPOS_TRABAJADOR } from '../models/incidente.js';

// ─────────────────────────────────────────────────────────
//  Validadores primitivos
// ─────────────────────────────────────────────────────────

/**
 * Verifica si un valor es un número no negativo (≥ 0) y finito.
 * 
 * @param {*} val — Valor a verificar
 * @returns {boolean} `true` si es un número ≥ 0
 * 
 * @example
 * isPositiveNumber(5);     // true
 * isPositiveNumber(0);     // true
 * isPositiveNumber(-1);    // false
 * isPositiveNumber('abc'); // false
 */
export function isPositiveNumber(val) {
    const num = Number(val);
    return Number.isFinite(num) && num >= 0;
}

/**
 * Verifica si un valor tipo string no está vacío después de hacer trim.
 * 
 * @param {*} val — Valor a verificar
 * @returns {boolean} `true` si es un string no vacío
 * 
 * @example
 * isNotEmpty('Hola');  // true
 * isNotEmpty('');      // false
 * isNotEmpty('  ');    // false
 * isNotEmpty(null);    // false
 */
export function isNotEmpty(val) {
    return typeof val === 'string' && val.trim().length > 0;
}

// ─────────────────────────────────────────────────────────
//  Validación de registros
// ─────────────────────────────────────────────────────────

/**
 * Valida un objeto de datos de registro antes de crear o actualizar.
 * 
 * Verifica:
 * - `tipo` es 'Directo' o 'Contratista'
 * - `anio` es un entero positivo razonable (>= 2000)
 * - `mes` es un mes válido en español
 * - Campos numéricos obligatorios son números no negativos
 * 
 * @param {Object} data — Datos del registro a validar
 * @returns {{ valid: boolean, errors: string[] }} Resultado de validación
 * 
 * @example
 * const result = validateRegistro({ tipo: 'Directo', anio: 2025, mes: 'Enero', ... });
 * if (!result.valid) {
 *     console.log(result.errors); // ['El campo "HHT" debe ser un número no negativo.']
 * }
 */
export function validateRegistro(data) {
    /** @type {string[]} */
    const errors = [];

    // ── Tipo ──
    if (!data.tipo || !TIPOS_TRABAJADOR.includes(data.tipo)) {
        errors.push(`El campo "Tipo" debe ser uno de: ${TIPOS_TRABAJADOR.join(', ')}.`);
    }

    // ── Año ──
    const anio = Number(data.anio);
    if (!Number.isInteger(anio) || anio < 2000 || anio > 2100) {
        errors.push('El campo "Año" debe ser un año válido (2000-2100).');
    }

    // ── Mes ──
    if (!data.mes || !MESES.includes(data.mes)) {
        errors.push(`El campo "Mes" debe ser un mes válido: ${MESES.join(', ')}.`);
    }

    // ── Campos numéricos obligatorios ──
    const camposNumericos = [
        { key: 'num_trabajadores',     label: 'N° Trabajadores' },
        { key: 'hht',                  label: 'HHT' },
        { key: 'dp',                   label: 'N° DP' },
        { key: 'nm',                   label: 'N° NM' },
        { key: 'fai',                  label: 'N° FAI' },
        { key: 'mti',                  label: 'N° MTI' },
        { key: 'mwd',                  label: 'N° MWD' },
        { key: 'lti',                  label: 'N° LTI' },
        { key: 'fatalidad',            label: 'N° Fatalidad' },
        { key: 'dias_incapacidad_at',  label: 'N° Días Incapacitados x AT' },
        { key: 'dias_cargados',        label: 'N° Cargados' },
        { key: 'casos_eg',             label: 'N° Casos EG' },
        { key: 'incapacidad_eg',       label: 'N° Incapacidad EG' },
        { key: 'casos_el',             label: 'N° Casos EL' },
    ];

    for (const campo of camposNumericos) {
        if (!isPositiveNumber(data[campo.key])) {
            errors.push(`El campo "${campo.label}" debe ser un número no negativo.`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ─────────────────────────────────────────────────────────
//  Validación de parámetros
// ─────────────────────────────────────────────────────────

/**
 * Valida el valor de un parámetro (ciudad o contratista).
 * 
 * Verifica que no esté vacío. Opcionalmente comprueba que no sea duplicado
 * comparando contra una lista de valores existentes.
 * 
 * @param {string}   valor          — Valor del parámetro a validar
 * @param {string[]} [existentes=[]] — Lista de valores existentes para chequeo de duplicados
 * @returns {{ valid: boolean, errors: string[] }} Resultado de validación
 * 
 * @example
 * validateParametro('');                          // { valid: false, errors: ['...'] }
 * validateParametro('Bogotá', ['Bogotá']);         // { valid: false, errors: ['...'] }
 * validateParametro('Medellín', ['Bogotá']);       // { valid: true, errors: [] }
 */
export function validateParametro(valor, existentes = []) {
    /** @type {string[]} */
    const errors = [];

    if (!isNotEmpty(valor)) {
        errors.push('El valor del parámetro no puede estar vacío.');
    } else {
        // Chequeo de duplicado (case-insensitive)
        const valorNorm = valor.trim().toLowerCase();
        const duplicado = existentes.some(e =>
            typeof e === 'string' && e.trim().toLowerCase() === valorNorm
        );
        if (duplicado) {
            errors.push(`El valor "${valor.trim()}" ya existe. No se permiten duplicados.`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
