/**
 * Script para recalcular y actualizar los indicadores de los registros
 * Directo/Bquilla recién importados con las fórmulas correctas del Excel.
 * 
 * Fórmulas corregidas:
 *   SR = (Dias_Inc_AT_Elementia × 200000) / HHT   [solo Elementia]
 *   Frec. = (Incidentes_lesion / N°Trab) × 100    [usa Inc. Lesion, no solo LTI]
 *   Sev.  = (Dias_Inc_AT_Elementia / N°Trab) × 100 [solo Elementia]
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ';
const supabase          = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CONSTANTE_ELEMENTIA       = 200_000;
const CONSTANTE_NORMATIVIDAD_CO = 100;

function round(value, decimals = 2) {
    const f = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * f) / f;
}
function safeDivide(n, d) {
    if (d === 0 || !Number.isFinite(d)) return 0;
    return n / d;
}
function recalcular(data) {
    const fai  = Number(data.fai)  || 0;
    const mti  = Number(data.mti)  || 0;
    const mwd  = Number(data.mwd)  || 0;
    const lti  = Number(data.lti)  || 0;
    const dp   = Number(data.dp)   || 0;
    const nm   = Number(data.nm)   || 0;
    const hht  = Number(data.hht)  || 0;
    const trab = Number(data.num_trabajadores) || 0;
    const fat  = Number(data.fatalidad)        || 0;
    const diasAT = Number(data.dias_incapacidad_at_elementia) || 0;

    const inc_lesion = round(fai + mti + mwd + lti);
    const inc_tirf   = round(mti + mwd + lti);
    const total_inc  = round(dp + nm + fai + mti + mwd + lti);

    return {
        incidentes_lesiones:       inc_lesion,
        incidente_tirf:            inc_tirf,
        total_incidentes:          total_inc,
        ltif:                      round(safeDivide(lti  * CONSTANTE_ELEMENTIA, hht)),
        tirf:                      round(safeDivide(inc_tirf * CONSTANTE_ELEMENTIA, hht)),
        sr:                        round(safeDivide(diasAT * CONSTANTE_ELEMENTIA, hht)),
        frecuencia_accidentalidad: round(safeDivide(inc_lesion, trab) * CONSTANTE_NORMATIVIDAD_CO),
        severidad_accidentalidad:  round(safeDivide(diasAT, trab) * CONSTANTE_NORMATIVIDAD_CO),
        proporcion_mortalidad:     round(safeDivide(fat, total_inc) * CONSTANTE_NORMATIVIDAD_CO),
    };
}

async function main() {
    console.log('🔄 Recalculando indicadores con fórmulas corregidas...\n');

    // Obtener TODOS los registros (no solo Bquilla)
    const { data: registros, error } = await supabase
        .from('registros')
        .select('*');

    if (error) { console.error('❌ Error:', error.message); return; }
    console.log(`📋 Total registros en BD: ${registros.length}`);

    let updated = 0, skipped = 0, errors = 0;

    for (const r of registros) {
        const nuevos = recalcular(r);

        // Verificar si ya están correctos (para no hacer UPDATE innecesario)
        const cambiaron = 
            r.sr                        !== nuevos.sr ||
            r.frecuencia_accidentalidad !== nuevos.frecuencia_accidentalidad ||
            r.severidad_accidentalidad  !== nuevos.severidad_accidentalidad;

        if (!cambiaron) { skipped++; continue; }

        const { error: errUpd } = await supabase
            .from('registros')
            .update(nuevos)
            .eq('id', r.id);

        if (errUpd) {
            console.error(`  ❌ Error actualizando ${r.anio}/${r.mes} (${r.tipo}):`, errUpd.message);
            errors++;
        } else {
            updated++;
            if (updated <= 10 || updated % 20 === 0) {
                console.log(`  ✅ ${r.anio} ${r.mes.padEnd(12)} (${r.tipo}/${r.planta || r.empresa}) → SR: ${r.sr}→${nuevos.sr} | Frec: ${r.frecuencia_accidentalidad}→${nuevos.frecuencia_accidentalidad}`);
            }
        }
    }

    console.log(`\n══════════════════════════════════════`);
    console.log(`✅ Actualizados: ${updated}`);
    console.log(`⏭️  Sin cambios:  ${skipped}`);
    console.log(`❌ Con error:    ${errors}`);
}

main().catch(console.error);
