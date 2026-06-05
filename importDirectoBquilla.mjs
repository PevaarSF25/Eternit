/**
 * @fileoverview Script de importación masiva para datos Directo Bquilla (2017-2026).
 * 
 * Importa los datos de "Data Directa" desde el archivo CSV y los inserta
 * en la tabla `registros` de Supabase, recalculando los indicadores con
 * las fórmulas exactas del sistema.
 * 
 * Uso: node importDirectoBquilla.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// ─── Configuración Supabase ───────────────────────────────
const SUPABASE_URL      = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ';
const supabase          = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Constantes de cálculo ───────────────────────────────
const CONSTANTE_ELEMENTIA       = 200_000;
const CONSTANTE_NORMATIVIDAD_CO = 100;

// ─── Meses en español (completos) → abreviatura del CSV ──
const MES_MAP = {
  'Ene': 'Enero',
  'Feb': 'Febrero',
  'Mar': 'Marzo',
  'Abr': 'Abril',
  'May': 'Mayo',
  'Jun': 'Junio',
  'Jul': 'Julio',
  'Ago': 'Agosto',
  'Sep': 'Septiembre',
  'Oct': 'Octubre',
  'Nov': 'Noviembre',
  'Dic': 'Diciembre',
};

// ─── Utilidades de cálculo ───────────────────────────────
function round(value, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
}

function safeDivide(numerator, denominator) {
    if (denominator === 0 || !Number.isFinite(denominator)) return 0;
    return numerator / denominator;
}

/**
 * Recalcula todos los indicadores HSE con las fórmulas exactas del sistema.
 * 
 * Fórmulas:
 *   Incidentes lesión     = FAI + MTI + MWD + LTI
 *   Incidente TIRF        = MTI + MWD + LTI
 *   Total Incidentes      = DP + NM + FAI + MTI + MWD + LTI
 *   LTIF                  = (LTI × 200000) / HHT
 *   TIRF                  = ((MTI + MWD + LTI) × 200000) / HHT
 *   SR                    = (Dias_Inc_AT_Elementia × 200000) / HHT
 *   Frec. Accidentalidad  = (Incidentes_lesión / N° Trabajadores) × 100
 *   Sev. Accidentalidad   = (Dias_Inc_AT_Elementia / N° Trabajadores) × 100
 *   % Proporción Mort.    = (Fatalidad / Total_Incidentes) × 100
 */
function calcularTodosLosIndicadores(data) {
    const fai               = Number(data.fai)  || 0;
    const mti               = Number(data.mti)  || 0;
    const mwd               = Number(data.mwd)  || 0;
    const lti               = Number(data.lti)  || 0;
    const dp                = Number(data.dp)   || 0;
    const nm                = Number(data.nm)   || 0;
    const hht               = Number(data.hht)  || 0;
    const numTrab           = Number(data.num_trabajadores)          || 0;
    const fatalidad         = Number(data.fatalidad)                 || 0;
    const diasIncAT         = Number(data.dias_incapacidad_at_elementia) || 0;
    const diasCargados      = Number(data.dias_cargados)             || 0;

    const incidentes_lesiones = round(fai + mti + mwd + lti);
    const incidente_tirf      = round(mti + mwd + lti);
    const total_incidentes    = round(dp + nm + fai + mti + mwd + lti);

    // LTIF = (LTI × 200000) / HHT
    const ltif = round(safeDivide(lti * CONSTANTE_ELEMENTIA, hht));

    // TIRF = ((MTI + MWD + LTI) × 200000) / HHT
    const tirf = round(safeDivide((mti + mwd + lti) * CONSTANTE_ELEMENTIA, hht));

    // SR = (Dias_Inc_AT_Elementia × 200000) / HHT  [Solo Elementia, según fórmula del Excel]
    const sr = round(safeDivide(diasIncAT * CONSTANTE_ELEMENTIA, hht));

    // Frecuencia = (Incidentes_lesión / N° Trabajadores) × 100
    const frecuencia_accidentalidad = round(
        safeDivide(incidentes_lesiones, numTrab) * CONSTANTE_NORMATIVIDAD_CO
    );

    // Severidad = (Dias_Inc_AT_Elementia / N° Trabajadores) × 100
    const severidad_accidentalidad = round(
        safeDivide(diasIncAT, numTrab) * CONSTANTE_NORMATIVIDAD_CO
    );

    // % Proporción Mortalidad = (Fatalidad / Total_Incidentes) × 100
    const proporcion_mortalidad = round(
        safeDivide(fatalidad, total_incidentes) * CONSTANTE_NORMATIVIDAD_CO
    );

    return {
        incidentes_lesiones,
        incidente_tirf,
        total_incidentes,
        ltif,
        tirf,
        sr,
        frecuencia_accidentalidad,
        severidad_accidentalidad,
        proporcion_mortalidad,
    };
}

// ─── Función principal ───────────────────────────────────
async function main() {
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║  Importación Datos Directo Bquilla 2017-2026  ║');
    console.log('╚══════════════════════════════════════════════╝');

    // 1. Leer CSV
    const csvPath = 'datosDirectoBquilla.csv';
    if (!fs.existsSync(csvPath)) {
        console.error(`❌ Archivo no encontrado: ${csvPath}`);
        process.exit(1);
    }

    const csvStr = fs.readFileSync(csvPath, 'utf-8');
    const lines  = csvStr.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Quitar encabezado
    lines.shift();
    console.log(`📄 Líneas de datos encontradas: ${lines.length}`);

    // 2. Parsear cada línea
    // Columnas: Tipo,Planta,Año,Mes,No. Trabajadores,HHT,No. DP,No. NM,No. FAI,No. MTI,No. MWD,No. LTI,No. Fatalidad,
    //           No. Dias IncapacidadxAT (Elementia),No. Dias IncapacidadxAT (Ley),No. Cargados,No. Caso EG,No. dias Incapacidad EG,No. Casos EL
    const records = [];
    const skipped = [];

    for (let i = 0; i < lines.length; i++) {
        const line  = lines[i];
        const parts = line.split(',');

        if (parts.length < 19) {
            skipped.push({ line: i + 2, reason: `Columnas insuficientes (${parts.length})`, data: line });
            continue;
        }

        const tipo  = parts[0].trim();
        const planta = parts[1].trim();
        const anio  = parseInt(parts[2].trim(), 10);
        const mesAbr = parts[3].trim();

        // Mapear abreviatura → nombre completo
        const mes = MES_MAP[mesAbr];
        if (!mes) {
            skipped.push({ line: i + 2, reason: `Mes no reconocido: "${mesAbr}"`, data: line });
            continue;
        }

        // Validar año
        if (isNaN(anio) || anio < 2000 || anio > 2100) {
            skipped.push({ line: i + 2, reason: `Año inválido: "${parts[2].trim()}"`, data: line });
            continue;
        }

        const rawData = {
            tipo,
            planta:                         planta === '0' ? 'Bquilla' : planta,
            empresa:                        '',
            anio,
            mes,
            num_trabajadores:               parseFloat(parts[4].trim()) || 0,
            hht:                            parseFloat(parts[5].trim()) || 0,
            dp:                             parseInt(parts[6].trim(), 10)  || 0,
            nm:                             parseInt(parts[7].trim(), 10)  || 0,
            fai:                            parseInt(parts[8].trim(), 10)  || 0,
            mti:                            parseInt(parts[9].trim(), 10)  || 0,
            mwd:                            parseInt(parts[10].trim(), 10) || 0,
            lti:                            parseInt(parts[11].trim(), 10) || 0,
            fatalidad:                      parseInt(parts[12].trim(), 10) || 0,
            dias_incapacidad_at_elementia:  parseInt(parts[13].trim(), 10) || 0,
            dias_incapacidad_at_ley:        parseInt(parts[14].trim(), 10) || 0,
            dias_cargados:                  parseInt(parts[15].trim(), 10) || 0,
            casos_eg:                       parseInt(parts[16].trim(), 10) || 0,
            incapacidad_eg:                 parseInt(parts[17].trim(), 10) || 0,
            casos_el:                       parseInt(parts[18].trim(), 10) || 0,
            comentarios:                    {},
        };

        const calcs = calcularTodosLosIndicadores(rawData);
        records.push({ ...rawData, ...calcs });
    }

    console.log(`✅ Registros válidos a importar: ${records.length}`);
    if (skipped.length > 0) {
        console.log(`⚠️  Registros omitidos: ${skipped.length}`);
        skipped.forEach(s => console.log(`   Línea ${s.line}: ${s.reason}`));
    }

    if (records.length === 0) {
        console.log('⛔ Nada que importar.');
        return;
    }

    // 3. Verificar duplicados antes de insertar
    console.log('\n🔍 Verificando duplicados en Supabase...');
    const { data: existing, error: errCheck } = await supabase
        .from('registros')
        .select('tipo, planta, anio, mes')
        .eq('tipo', 'Directo')
        .in('anio', [...new Set(records.map(r => r.anio))]);

    if (errCheck) {
        console.error('❌ Error verificando duplicados:', errCheck.message);
        process.exit(1);
    }

    // Construir set de claves existentes
    const existingKeys = new Set(
        (existing || []).map(r => `${r.tipo}|${r.planta}|${r.anio}|${r.mes}`)
    );

    const newRecords = records.filter(r => {
        const key = `${r.tipo}|${r.planta}|${r.anio}|${r.mes}`;
        return !existingKeys.has(key);
    });

    const duplicates = records.length - newRecords.length;
    if (duplicates > 0) {
        console.log(`⚠️  Registros duplicados omitidos: ${duplicates}`);
    }
    console.log(`📥 Registros nuevos a insertar: ${newRecords.length}`);

    if (newRecords.length === 0) {
        console.log('✅ Todos los registros ya existen. Nada nuevo que importar.');
        return;
    }

    // 4. Insertar en lotes de 50
    const BATCH_SIZE = 50;
    let inserted = 0;
    let errors   = 0;

    for (let i = 0; i < newRecords.length; i += BATCH_SIZE) {
        const batch = newRecords.slice(i, i + BATCH_SIZE);
        const { error: errIns } = await supabase.from('registros').insert(batch);

        if (errIns) {
            console.error(`❌ Error en lote ${Math.floor(i / BATCH_SIZE) + 1}:`, errIns.message);
            errors += batch.length;
        } else {
            inserted += batch.length;
            console.log(`   Lote ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} registros insertados ✅`);
        }
    }

    // 5. Resumen final
    console.log('\n══════════════════════════════════════════════');
    console.log(`✅ Importación completada:`);
    console.log(`   - Insertados exitosamente: ${inserted}`);
    console.log(`   - Duplicados omitidos:     ${duplicates}`);
    console.log(`   - Con error:               ${errors}`);
    console.log('══════════════════════════════════════════════');

    // 6. Verificar "Bquilla" en parametros/ciudad
    console.log('\n🏙️  Verificando "Bquilla" en tabla de parámetros...');
    const { data: ciudades, error: errCiudades } = await supabase
        .from('parametros')
        .select('*')
        .eq('categoria', 'ciudad');

    if (!errCiudades && ciudades) {
        const exists = ciudades.some(c => c.valor === 'Bquilla');
        if (!exists) {
            const maxOrden = ciudades.length > 0 ? Math.max(...ciudades.map(c => c.orden || 0)) : 0;
            const { error: errInsCity } = await supabase.from('parametros').insert({
                categoria: 'ciudad',
                valor: 'Bquilla',
                activo: true,
                orden: maxOrden + 1,
            });
            if (errInsCity) {
                console.error('⚠️  No se pudo insertar "Bquilla" en parametros:', errInsCity.message);
            } else {
                console.log('✅ "Bquilla" agregada a tabla de parámetros (ciudad).');
            }
        } else {
            console.log('✅ "Bquilla" ya existe en parámetros. Sin cambios.');
        }
    }
}

main().catch(err => {
    console.error('💥 Error inesperado:', err);
    process.exit(1);
});
