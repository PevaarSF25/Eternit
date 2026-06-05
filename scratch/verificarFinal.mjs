/**
 * Verificación final: muestra muestra de datos Directo/Bquilla con indicadores
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ';
const supabase          = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { data, error } = await supabase
    .from('registros')
    .select('tipo, planta, anio, mes, num_trabajadores, hht, fai, mti, mwd, lti, fatalidad, dias_incapacidad_at_elementia, incidentes_lesiones, incidente_tirf, total_incidentes, ltif, tirf, sr, frecuencia_accidentalidad, severidad_accidentalidad, proporcion_mortalidad')
    .eq('tipo', 'Directo')
    .eq('planta', 'Bquilla')
    .order('anio', { ascending: true })
    .order('mes', { ascending: true })
    .in('anio', [2017, 2025, 2026]);

if (error) { console.error(error); process.exit(1); }

// Agrupar por año
const byYear = {};
data.forEach(r => {
    if (!byYear[r.anio]) byYear[r.anio] = [];
    byYear[r.anio].push(r);
});

for (const [anio, rows] of Object.entries(byYear)) {
    console.log(`\n━━━ ${anio} (${rows.length} meses) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`${'Mes'.padEnd(14)} | ${'Trab'.padEnd(6)} | ${'HHT'.padEnd(8)} | ${'FAI'.padEnd(4)} | ${'MTI'.padEnd(4)} | ${'LTI'.padEnd(4)} | ${'Inc.Les'.padEnd(8)} | ${'LTIF'.padEnd(7)} | ${'TIRF'.padEnd(7)} | ${'SR'.padEnd(8)} | ${'Frec'.padEnd(7)} | ${'Sev'.padEnd(7)}`);
    rows.forEach(r => {
        console.log(
            `${r.mes.padEnd(14)} | ${String(r.num_trabajadores).padEnd(6)} | ${String(r.hht).padEnd(8)} | ${String(r.fai).padEnd(4)} | ${String(r.mti).padEnd(4)} | ${String(r.lti).padEnd(4)} | ${String(r.incidentes_lesiones).padEnd(8)} | ${String(r.ltif).padEnd(7)} | ${String(r.tirf).padEnd(7)} | ${String(r.sr).padEnd(8)} | ${String(r.frecuencia_accidentalidad).padEnd(7)} | ${String(r.severidad_accidentalidad).padEnd(7)}`
        );
    });
}

// Resumen por año
const { data: anios } = await supabase
    .from('registros')
    .select('anio')
    .eq('tipo', 'Directo')
    .eq('planta', 'Bquilla');

const uniqueAnios = [...new Set(anios.map(r => r.anio))].sort();
console.log(`\n\n📅 Años disponibles para Directo/Bquilla: ${uniqueAnios.join(', ')}`);
console.log(`📊 Total registros: ${anios.length}`);
