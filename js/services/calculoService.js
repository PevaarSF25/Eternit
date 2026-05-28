/**
 * @fileoverview Servicio de cálculo de indicadores HSE para Eternit.
 * 
 * Todas las funciones son **puras** (sin efectos secundarios) y manejan
 * divisiones por cero retornando 0.00.  Resultados redondeados a 2 decimales.
 * 
 * Constantes utilizadas:
 *   - CONSTANTE_ELEMENTIA = 200 000 (factor de normalización Elementia)
 *   - CONSTANTE_NORMATIVIDAD_CO = 100 (factor normatividad Colombia)
 * 
 * @module services/calculoService
 */

// ─────────────────────────────────────────────────────────
//  Constantes (hardcoded según requerimiento)
// ─────────────────────────────────────────────────────────

/** Factor de normalización Elementia */
export const CONSTANTE_ELEMENTIA = 200_000;

/** Factor de normatividad colombiana */
export const CONSTANTE_NORMATIVIDAD_CO = 100;

// ─────────────────────────────────────────────────────────
//  Utilidad interna
// ─────────────────────────────────────────────────────────

/**
 * Redondea un valor numérico a la cantidad de decimales indicada.
 * @param {number} value
 * @param {number} [decimals=2]
 * @returns {number}
 */
function round(value, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Realiza una división segura: retorna 0 si el denominador es 0.
 * @param {number} numerator
 * @param {number} denominator
 * @returns {number}
 */
function safeDivide(numerator, denominator) {
    if (denominator === 0 || !Number.isFinite(denominator)) return 0;
    return numerator / denominator;
}

// ─────────────────────────────────────────────────────────
//  Funciones de cálculo individuales
// ─────────────────────────────────────────────────────────

/**
 * Calcula el número de incidentes con lesiones.
 * 
 * Fórmula: FAI + MTI + MWD + LTI
 * 
 * @param {number} fai — First Aid Incidents (lesión con primeros auxilios)
 * @param {number} mti — Medical Treatment Incidents (lesión con tratamiento médico)
 * @param {number} mwd — Modified Work Days (restricciones médicas)
 * @param {number} lti — Lost Time Incidents (lesión con tiempo perdido)
 * @returns {number} Total de incidentes con lesiones
 */
export function calcularIncidentesLesiones(fai, mti, mwd, lti) {
    return round(fai + mti + mwd + lti);
}

/**
 * Calcula el número total de incidentes (incluye DP y NM).
 * 
 * Fórmula: DP + NM + FAI + MTI + MWD + LTI
 * 
 * @param {number} dp  — Daños a la Propiedad
 * @param {number} nm  — Near Miss (casi accidente)
 * @param {number} fai — First Aid Incidents
 * @param {number} mti — Medical Treatment Incidents
 * @param {number} mwd — Modified Work Days
 * @param {number} lti — Lost Time Incidents
 * @returns {number} Total de incidentes
 */
export function calcularTotalIncidentes(dp, nm, fai, mti, mwd, lti) {
    return round(dp + nm + fai + mti + mwd + lti);
}

/**
 * Calcula el Lost Time Injury Frequency (LTIF).
 * 
 * Fórmula: (LTI × 200 000) / HHT
 * 
 * @param {number} lti — Lost Time Incidents
 * @param {number} hht — Horas Hombre Trabajadas
 * @returns {number} LTIF redondeado a 2 decimales; 0 si HHT es 0
 */
export function calcularLTIF(lti, hht) {
    return round(safeDivide(lti * CONSTANTE_ELEMENTIA, hht));
}

/**
 * Calcula la sumatoria de incidentes TIRF.
 * 
 * Fórmula: MTI + MWD + LTI
 * 
 * @param {number} mti — Medical Treatment Incidents
 * @param {number} mwd — Modified Work Days
 * @param {number} lti — Lost Time Incidents
 * @returns {number} Total de Incidentes TIRF
 */
export function calcularIncidenteTIRF(mti, mwd, lti) {
    return round(mti + mwd + lti);
}

/**
 * Calcula el Total Incident Rate Frequency (TIRF).
 * 
 * Fórmula: ((MTI + MWD + LTI) × 200 000) / HHT
 * 
 * @param {number} mti — Medical Treatment Incidents
 * @param {number} mwd — Modified Work Days
 * @param {number} lti — Lost Time Incidents
 * @param {number} hht — Horas Hombre Trabajadas
 * @returns {number} TIRF redondeado a 2 decimales; 0 si HHT es 0
 */
export function calcularTIRF(mti, mwd, lti, hht) {
    return round(safeDivide((mti + mwd + lti) * CONSTANTE_ELEMENTIA, hht));
}

/**
 * Calcula el Severity Rate (SR).
 * 
 * Fórmula: ((días_incapacidad_AT + días_cargados) × 200 000) / HHT
 * 
 * @param {number} diasIncapacidadAT — Días incapacitados por Accidente de Trabajo
 * @param {number} diasCargados      — Días cargados
 * @param {number} hht               — Horas Hombre Trabajadas
 * @returns {number} SR redondeado a 2 decimales; 0 si HHT es 0
 */
export function calcularSR(diasIncapacidadAT, diasCargados, hht) {
    return round(safeDivide((diasIncapacidadAT + diasCargados) * CONSTANTE_ELEMENTIA, hht));
}

/**
 * Calcula la Frecuencia de Accidentalidad (normatividad colombiana).
 * 
 * Fórmula: (LTI / N° Trabajadores) × 100
 * 
 * @param {number} lti             — Lost Time Incidents
 * @param {number} numTrabajadores — Número de trabajadores
 * @returns {number} Frecuencia redondeada a 2 decimales; 0 si numTrabajadores es 0
 */
export function calcularFrecuenciaAccidentalidad(lti, numTrabajadores) {
    return round(safeDivide(lti, numTrabajadores) * CONSTANTE_NORMATIVIDAD_CO);
}

/**
 * Calcula la Severidad de Accidentalidad (normatividad colombiana).
 * 
 * Fórmula: ((días_incapacidad_AT + días_cargados) / N° Trabajadores) × 100
 * 
 * @param {number} diasIncapacidadAT — Días incapacitados por AT
 * @param {number} diasCargados      — Días cargados
 * @param {number} numTrabajadores   — Número de trabajadores
 * @returns {number} Severidad redondeada a 2 decimales; 0 si numTrabajadores es 0
 */
export function calcularSeveridadAccidentalidad(diasIncapacidadAT, diasCargados, numTrabajadores) {
    return round(safeDivide(diasIncapacidadAT + diasCargados, numTrabajadores) * CONSTANTE_NORMATIVIDAD_CO);
}

/**
 * Calcula el porcentaje de Proporción de Mortalidad.
 * 
 * Fórmula: (Fatalidad / Total de incidentes) * 100
 * 
 * @param {number} fatalidad       — Número de fatalidades
 * @param {number} totalIncidentes — Total de incidentes
 * @returns {number} Porcentaje redondeado a 2 decimales; 0 si totalIncidentes es 0
 */
export function calcularProporcionMortalidad(fatalidad, totalIncidentes) {
    return round(safeDivide(fatalidad, totalIncidentes) * CONSTANTE_NORMATIVIDAD_CO);
}

// ─────────────────────────────────────────────────────────
//  Función agregadora
// ─────────────────────────────────────────────────────────

/**
 * Calcula **todos** los indicadores a partir de un objeto de datos de registro.
 * 
 * Recibe un objeto con los campos de entrada (dp, nm, fai, mti, mwd, lti,
 * hht, num_trabajadores, fatalidad, dias_incapacidad_at, dias_cargados) y
 * devuelve un objeto con todos los campos calculados.
 * 
 * @param {Object} data — Objeto con los campos de entrada del registro
 * @param {number} data.fai
 * @param {number} data.mti
 * @param {number} data.mwd
 * @param {number} data.lti
 * @param {number} data.dp
 * @param {number} data.nm
 * @param {number} data.hht
 * @param {number} data.num_trabajadores
 * @param {number} data.fatalidad
 * @param {number} data.dias_incapacidad_at_elementia
 * @param {number} data.dias_incapacidad_at_ley
 * @param {number} data.dias_cargados
 * @returns {Object} Objeto con los campos calculados:
 *   incidentes_lesiones, total_incidentes, ltif, tirf, sr,
 *   frecuencia_accidentalidad, severidad_accidentalidad, proporcion_mortalidad
 * 
 * @example
 * import { calcularTodosLosIndicadores } from './services/calculoService.js';
 * const indicadores = calcularTodosLosIndicadores(registro);
 * console.log(indicadores.ltif); // e.g. 1.25
 */
export function calcularTodosLosIndicadores(data) {
    const fai = Number(data.fai) || 0;
    const mti = Number(data.mti) || 0;
    const mwd = Number(data.mwd) || 0;
    const lti = Number(data.lti) || 0;
    const dp  = Number(data.dp)  || 0;
    const nm  = Number(data.nm)  || 0;
    const hht = Number(data.hht) || 0;
    const numTrabajadores    = Number(data.num_trabajadores)    || 0;
    const fatalidad          = Number(data.fatalidad)           || 0;
    const diasIncapacidadAT  = (Number(data.dias_incapacidad_at_elementia) || 0) + (Number(data.dias_incapacidad_at_ley) || 0);
    const diasCargados       = Number(data.dias_cargados)       || 0;

    const total_incidentes = calcularTotalIncidentes(dp, nm, fai, mti, mwd, lti);

    return {
        incidentes_lesiones:       calcularIncidentesLesiones(fai, mti, mwd, lti),
        incidente_tirf:            calcularIncidenteTIRF(mti, mwd, lti),
        total_incidentes:          total_incidentes,
        ltif:                      calcularLTIF(lti, hht),
        tirf:                      calcularTIRF(mti, mwd, lti, hht),
        sr:                        calcularSR(diasIncapacidadAT, diasCargados, hht),
        frecuencia_accidentalidad: calcularFrecuenciaAccidentalidad(lti, numTrabajadores),
        severidad_accidentalidad:  calcularSeveridadAccidentalidad(diasIncapacidadAT, diasCargados, numTrabajadores),
        proporcion_mortalidad:     calcularProporcionMortalidad(fatalidad, total_incidentes),
    };
}
