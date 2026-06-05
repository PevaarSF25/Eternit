/**
 * Script de verificación: consulta los registros Directo recién importados
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ';
const supabase          = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { data, error } = await supabase
    .from('registros')
    .select('tipo, planta, anio, mes, num_trabajadores, hht, fai, mti, mwd, lti, ltif, tirf, sr, frecuencia_accidentalidad, severidad_accidentalidad')
    .eq('tipo', 'Directo')
    .eq('planta', 'Bquilla')
    .order('anio', { ascending: false })
    .limit(5);

if (error) {
    console.error('Error:', error);
} else {
    console.log(`Total registros encontrados (últimos 5 por anio DESC):`);
    data.forEach(r => {
        console.log(`  ${r.anio} ${r.mes.padEnd(12)} | Trab: ${r.num_trabajadores} | HHT: ${r.hht} | FAI:${r.fai} MTI:${r.mti} LTI:${r.lti} | LTIF:${r.ltif} TIRF:${r.tirf} SR:${r.sr}`);
    });
}

// Contar total
const { count } = await supabase
    .from('registros')
    .select('*', { count: 'exact', head: true })
    .eq('tipo', 'Directo')
    .eq('planta', 'Bquilla');

console.log(`\nTotal registros Directo/Bquilla: ${count}`);
