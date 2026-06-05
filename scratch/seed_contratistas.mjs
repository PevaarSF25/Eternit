/**
 * seed_contratistas.mjs
 *
 * Reads contratistas_data.csv, computes calculated indicator fields,
 * and inserts data into Supabase tables `parametros` and `registros`
 * using the REST API with native fetch (Node 18+).
 *
 * Usage:  node seed_contratistas.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Supabase config ──────────────────────────────────────────────────
const SUPABASE_URL = 'https://zpnkomiwxnuchxmpmlwo.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbmtvbWl3eG51Y2h4bXBtbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzI4NTQsImV4cCI6MjA5NTQ0ODg1NH0.4m8Jit7qxncziBoA-wFaRJn7EujKk1AyYF09O8LoJnQ';

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

const BATCH_SIZE = 50;

// ── Month number → Spanish name ──────────────────────────────────────
const MONTH_NAMES = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre',
};

// ── Helpers ──────────────────────────────────────────────────────────
function round2(v) {
  return Math.round(v * 100) / 100;
}

function safeDivide(numerator, denominator) {
  return denominator === 0 ? 0 : numerator / denominator;
}

/** Strip a leading "Total " prefix from a company name. */
function cleanEmpresa(raw) {
  return raw.startsWith('Total ') ? raw.slice(6) : raw;
}

// ── CSV parsing ──────────────────────────────────────────────────────
/**
 * Parses a simple CSV string (no quoted commas expected in the numeric
 * columns). The first column (Empresa) may contain commas inside quotes
 * but in this dataset it does not, so a simple split is safe.
 */
function parseCSV(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows.');
  }

  const header = lines[0].split(',');
  console.log(`CSV header (${header.length} cols): ${header.join(' | ')}`);

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    // Split from the RIGHT for the 17 numeric fields, so that commas
    // inside the company name would be preserved. We know there are 18
    // columns total.
    const parts = lines[i].split(',');
    if (parts.length < 18) {
      // If fewer columns, the company name has no commas — just skip bad rows
      console.warn(`  ⚠  Skipping malformed row ${i}: ${lines[i]}`);
      continue;
    }

    // If the line has MORE than 18 commas, the company name itself
    // contains commas. Rejoin the leading parts.
    const extra = parts.length - 18;
    const empresa = parts.slice(0, 1 + extra).join(',');
    const rest = parts.slice(1 + extra); // 17 elements

    rows.push({
      empresa: cleanEmpresa(empresa.trim()),
      tipo: rest[0].trim(),
      anio: parseInt(rest[1], 10),
      mes: parseInt(rest[2], 10),
      num_trabajadores: parseInt(rest[3], 10),
      hht: parseFloat(rest[4]),
      dp: parseInt(rest[5], 10),
      nm: parseInt(rest[6], 10),
      fai: parseInt(rest[7], 10),
      mti: parseInt(rest[8], 10),
      mwd: parseInt(rest[9], 10),
      lti: parseInt(rest[10], 10),
      fatalidad: parseInt(rest[11], 10),
      dias_incapacidad_at: parseInt(rest[12], 10),
      dias_cargados: parseInt(rest[13], 10),
      casos_eg: parseInt(rest[14], 10),
      incapacidad_eg: parseInt(rest[15], 10),
      casos_el: parseInt(rest[16], 10),
    });
  }

  console.log(`Parsed ${rows.length} data rows from CSV.\n`);
  return rows;
}

// ── Supabase REST helpers ────────────────────────────────────────────
async function supabaseGet(table, queryParams = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${queryParams ? '?' + queryParams : ''}`;
  const res = await fetch(url, { method: 'GET', headers: HEADERS });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${table} failed (${res.status}): ${body}`);
  }
  return res.json();
}

async function supabasePost(table, rows, extraHeaders = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...HEADERS, ...extraHeaders },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST ${table} failed (${res.status}): ${body}`);
  }
  return res;
}

// ── 1. Seed `parametros` table ───────────────────────────────────────
async function seedParametros(empresas) {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  STEP 1 — Seeding `parametros` (empresa entries)');
  console.log('═══════════════════════════════════════════════════════');

  // Fetch existing empresa entries
  const existing = await supabaseGet(
    'parametros',
    'categoria=eq.empresa&select=valor'
  );
  const existingSet = new Set(existing.map((r) => r.valor));
  console.log(`  Found ${existingSet.size} existing empresa(s) in parametros.`);

  // Filter to only new ones
  const toInsert = empresas
    .filter((e) => !existingSet.has(e))
    .map((e) => ({ categoria: 'empresa', valor: e, activo: true }));

  if (toInsert.length === 0) {
    console.log('  ✔ No new empresas to insert.\n');
    return;
  }

  console.log(`  Inserting ${toInsert.length} new empresa(s)…`);

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    await supabasePost('parametros', batch, {
      Prefer: 'resolution=merge-duplicates',
    });
    console.log(
      `    batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${batch.length} rows`
    );
  }

  console.log('  ✔ parametros seeding complete.\n');
}

// ── 2. Build registros rows (with calculated fields) ─────────────────
function buildRegistro(row) {
  const {
    empresa, tipo, anio, mes,
    num_trabajadores, hht,
    dp, nm, fai, mti, mwd, lti, fatalidad,
    dias_incapacidad_at, dias_cargados,
    casos_eg, incapacidad_eg, casos_el,
  } = row;

  // Calculated fields
  const incidentes_lesiones = fai + mti + mwd + lti;
  const incidente_tirf = mti + mwd + lti;
  const total_incidentes = dp + nm + fai + mti + mwd + lti;

  const ltif = round2(safeDivide(lti * 200000, hht));
  const tirf = round2(safeDivide((mti + mwd + lti) * 200000, hht));
  const sr = round2(
    safeDivide((dias_incapacidad_at + dias_cargados) * 200000, hht)
  );
  const frecuencia_accidentalidad = round2(
    safeDivide(lti, num_trabajadores) * 100
  );
  const severidad_accidentalidad = round2(
    safeDivide(dias_incapacidad_at + dias_cargados, num_trabajadores) * 100
  );
  const proporcion_mortalidad = round2(
    safeDivide(fatalidad, total_incidentes) * 100
  );

  return {
    tipo,
    planta: null,
    empresa,
    anio,
    mes: MONTH_NAMES[mes] || String(mes),
    num_trabajadores,
    hht,
    dp,
    nm,
    fai,
    mti,
    mwd,
    lti,
    fatalidad,
    dias_incapacidad_at_elementia: dias_incapacidad_at,
    dias_incapacidad_at_ley: 0,
    dias_cargados,
    casos_eg,
    incapacidad_eg,
    casos_el,
    comentarios: {},
    // Calculated
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

// ── 3. Seed `registros` table ────────────────────────────────────────
async function seedRegistros(dataRows) {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  STEP 2 — Seeding `registros`');
  console.log('═══════════════════════════════════════════════════════');

  const registros = dataRows.map(buildRegistro);
  console.log(`  Total registros to insert: ${registros.length}`);

  let inserted = 0;
  const totalBatches = Math.ceil(registros.length / BATCH_SIZE);

  for (let i = 0; i < registros.length; i += BATCH_SIZE) {
    const batch = registros.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    try {
      await supabasePost('registros', batch);
      inserted += batch.length;
      console.log(
        `    batch ${batchNum}/${totalBatches}: inserted ${batch.length} rows  (total: ${inserted}/${registros.length})`
      );
    } catch (err) {
      console.error(
        `    ✖ batch ${batchNum}/${totalBatches} FAILED: ${err.message}`
      );
      // Log first row of failing batch for debugging
      console.error('      First row of failing batch:', JSON.stringify(batch[0], null, 2));
    }
  }

  console.log(`  ✔ registros seeding complete. Inserted ${inserted}/${registros.length} rows.\n`);
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Supabase Seed — Contratistas                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');

  // Resolve CSV path relative to this script
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const csvPath = join(__dirname, 'contratistas_data.csv');
  console.log(`Reading CSV from: ${csvPath}`);

  let csvText;
  try {
    csvText = readFileSync(csvPath, 'utf-8');
  } catch (err) {
    console.error(`Failed to read CSV file: ${err.message}`);
    process.exit(1);
  }

  // Parse
  const dataRows = parseCSV(csvText);
  if (dataRows.length === 0) {
    console.log('No data rows found. Exiting.');
    process.exit(0);
  }

  // Extract unique company names (preserving insertion order)
  const empresaSet = new Set(dataRows.map((r) => r.empresa));
  const empresas = [...empresaSet];
  console.log(`Found ${empresas.length} unique empresa(s) in CSV data.\n`);

  // Seed
  await seedParametros(empresas);
  await seedRegistros(dataRows);

  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   ✔  All done!                                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
