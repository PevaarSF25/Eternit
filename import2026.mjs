import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SUPABASE_URL = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';           
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CONSTANTE_ELEMENTIA = 200000;
const CONSTANTE_NORMATIVIDAD_CO = 100;

function round(value, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
}
function safeDivide(numerator, denominator) {
    if (denominator === 0 || !Number.isFinite(denominator)) return 0;
    return numerator / denominator;
}

function calcularTodosLosIndicadores(data) {
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

    const total_incidentes = round(dp + nm + fai + mti + mwd + lti);
    const incidentes_lesiones = round(fai + mti + mwd + lti);
    const incidente_tirf = round(mti + mwd + lti);
    
    return {
        incidentes_lesiones,
        incidente_tirf,
        total_incidentes,
        ltif: round(safeDivide(lti * CONSTANTE_ELEMENTIA, hht)),
        tirf: round(safeDivide((mti + mwd + lti) * CONSTANTE_ELEMENTIA, hht)),
        sr: round(safeDivide((diasIncapacidadAT + diasCargados) * CONSTANTE_ELEMENTIA, hht)),
        frecuencia_accidentalidad: round(safeDivide(lti, numTrabajadores) * CONSTANTE_NORMATIVIDAD_CO),
        severidad_accidentalidad: round(safeDivide(diasIncapacidadAT + diasCargados, numTrabajadores) * CONSTANTE_NORMATIVIDAD_CO),
        proporcion_mortalidad: round(safeDivide(fatalidad, total_incidentes) * CONSTANTE_NORMATIVIDAD_CO),
    };
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

async function main() {
    console.log("Iniciando importación 2026...");
    const csvStr = fs.readFileSync('datos2026.csv', 'utf-8');
    const lines = csvStr.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    // Ignore header
    lines.shift();
    
    const records = [];
    const companiesSet = new Set();
    
    for (const line of lines) {
        const parts = line.split(',');
        if (parts.length < 18) continue;
        
        // Empresa,Tipo,Año,Mes,No. Trabajadores,HHT,No. DP,No. NM,No. FAI,No. MTI,No. MWD,No. LTI,No. Fatalidad,No. Dias IncapacidadxAT,No. Cargados,No. Casos EG,No. Incapacidad EG,No. Casos EL
        const empresa = parts[0];
        companiesSet.add(empresa);
        
        const anio = parseInt(parts[2], 10);
        const mesNum = parseInt(parts[3], 10);
        const mesStr = MESES[mesNum - 1];
        
        const rawData = {
            tipo: parts[1],
            empresa: empresa,
            planta: '',
            anio: anio,
            mes: mesStr,
            num_trabajadores: parseInt(parts[4], 10),
            hht: parseInt(parts[5], 10),
            dp: parseInt(parts[6], 10),
            nm: parseInt(parts[7], 10),
            fai: parseInt(parts[8], 10),
            mti: parseInt(parts[9], 10),
            mwd: parseInt(parts[10], 10),
            lti: parseInt(parts[11], 10),
            fatalidad: parseInt(parts[12], 10),
            dias_incapacidad_at_ley: parseInt(parts[13], 10), // Assuming this goes to ley
            dias_incapacidad_at_elementia: 0,
            dias_cargados: parseInt(parts[14], 10),
            casos_eg: parseInt(parts[15], 10),
            incapacidad_eg: parseInt(parts[16], 10),
            casos_el: parseInt(parts[17], 10),
            comentarios: {}
        };
        
        const calcs = calcularTodosLosIndicadores(rawData);
        records.push({ ...rawData, ...calcs });
    }
    
    // Fetch existing companies from parametros
    const { data: parametros, error } = await supabase.from('parametros').select('*').eq('categoria', 'empresas').order('orden', { ascending: true });
    if (error) {
        console.error("Error fetching parametros:", error);
        return;
    }
    
    const existingCompanies = new Set(parametros.map(p => p.valor.toUpperCase()));
    let maxOrder = parametros.length > 0 ? Math.max(...parametros.map(p => p.orden || 0)) : 0;
    
    const newCompanies = [];
    for (const c of companiesSet) {
        if (!existingCompanies.has(c.toUpperCase())) {
            maxOrder++;
            newCompanies.push({
                categoria: 'empresas',
                valor: c,
                activo: true,
                orden: maxOrder
            });
        }
    }
    
    if (newCompanies.length > 0) {
        console.log(`Insertando ${newCompanies.length} nuevas empresas...`);
        const { error: errInsert } = await supabase.from('parametros').insert(newCompanies);
        if (errInsert) {
            console.error("Error insertando nuevas empresas:", errInsert);
            return;
        }
    } else {
        console.log("No hay nuevas empresas para insertar.");
    }
    
    console.log(`Insertando ${records.length} registros...`);
    // Insert in batches of 100
    for (let i = 0; i < records.length; i += 100) {
        const batch = records.slice(i, i + 100);
        const { error: errRec } = await supabase.from('registros').insert(batch);
        if (errRec) {
            console.error("Error inserting batch starting at index", i, errRec);
            return;
        }
    }
    
    console.log("Importación exitosa!");
}

main().catch(console.error);
