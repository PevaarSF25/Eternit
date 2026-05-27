/**
 * @fileoverview Utilidades de formato numérico para la aplicación Eternit HSE.
 * 
 * Todos los formatos siguen la convención colombiana:
 *   - Separador de miles: punto (.)
 *   - Separador decimal: coma (,)
 *   - Ejemplo: 1.234.567,89
 * 
 * @module utils/formatter
 */

import { MESES } from '../models/incidente.js';

// ─────────────────────────────────────────────────────────
//  Formateadores
// ─────────────────────────────────────────────────────────

/**
 * Formatea un número con separador de miles (.) y separador decimal (,).
 * Formato colombiano: 1.234.567,89
 * 
 * @param {number|string} num      — Valor numérico a formatear
 * @param {number}        [decimals=2] — Cantidad de decimales
 * @returns {string} Número formateado; '0,00' si el valor es inválido
 * 
 * @example
 * formatNumber(1234567.89);    // '1.234.567,89'
 * formatNumber(0.5, 1);        // '0,5'
 * formatNumber(null);          // '0,00'
 */
export function formatNumber(num, decimals = 2) {
    const value = Number(num);
    if (!Number.isFinite(value)) {
        return (0).toFixed(decimals).replace('.', ',');
    }

    // Usar toFixed para los decimales, luego reemplazar separadores
    const parts = value.toFixed(decimals).split('.');
    // Agregar separador de miles al entero
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Unir con coma decimal
    return parts.join(',');
}

/**
 * Formatea un entero con separador de miles (.).
 * 
 * @param {number|string} num — Valor entero a formatear
 * @returns {string} Entero formateado; '0' si el valor es inválido
 * 
 * @example
 * formatInteger(1234567);  // '1.234.567'
 * formatInteger(42);       // '42'
 */
export function formatInteger(num) {
    const value = Number(num);
    if (!Number.isFinite(value)) return '0';

    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formatea un número como porcentaje con el signo %.
 * 
 * @param {number|string} num          — Valor numérico
 * @param {number}        [decimals=2] — Cantidad de decimales
 * @returns {string} Porcentaje formateado, e.g. '12,50%'
 * 
 * @example
 * formatPercent(12.5);     // '12,50%'
 * formatPercent(0);        // '0,00%'
 */
export function formatPercent(num, decimals = 2) {
    return `${formatNumber(num, decimals)}%`;
}

/**
 * Retorna el nombre del mes tal cual (ya es un string en español).
 * Provee un punto de extensión si en el futuro se necesita transformar.
 * 
 * @param {string} mes — Nombre del mes en español
 * @returns {string} Nombre del mes
 * 
 * @example
 * formatMonth('Enero'); // 'Enero'
 */
export function formatMonth(mes) {
    return mes || '';
}

/**
 * Convierte el nombre de un mes en español a su número (1-12).
 * 
 * @param {string} mesNombre — Nombre del mes en español (e.g. 'Enero')
 * @returns {number} Número del mes (1-12); 0 si no se encuentra
 * 
 * @example
 * getMesNumero('Marzo');     // 3
 * getMesNumero('Diciembre'); // 12
 * getMesNumero('Invalid');   // 0
 */
export function getMesNumero(mesNombre) {
    const index = MESES.indexOf(mesNombre);
    return index !== -1 ? index + 1 : 0;
}
