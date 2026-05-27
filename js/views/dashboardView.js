import { getAllRegistros, getAniosDisponibles } from '../services/registroService.js';
import { getParametros } from '../services/parametricaService.js';
import { createBarChart, createDoughnutChart, createLineChart, destroyChart } from '../components/chartBuilder.js';
import { formatNumber, formatInteger } from '../utils/formatter.js';
import { MESES } from '../models/incidente.js';

let charts = {}; // Store chart instances

export async function renderDashboard(container) {
  container.innerHTML = `
    <div class="dashboard-container">
      
      <!-- Filters -->
      <div class="dashboard-filters card" style="padding:var(--space-3) var(--space-4); margin-bottom:var(--space-2)">
        <div class="filter-group">
          <label class="filter-label">Tipo</label>
          <select class="form-select" id="filter-tipo">
            <option value="Todos">Todos</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Año</label>
          <select class="form-select" id="filter-anio">
            <option value="Todos">Todos</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Mes</label>
          <select class="form-select" id="filter-mes">
            <option value="Todos">Todos</option>
            ${MESES.map(m => `<option value="${m}">${m}</option>`).join('')}
          </select>
        </div>
        <div style="flex-grow: 1;"></div>
        <button class="btn btn-secondary" id="btn-limpiar-filtros">
          <i data-lucide="filter-x"></i> Limpiar Filtros
        </button>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid" id="kpi-container">
        <!-- Rendered dynamically -->
      </div>

      <!-- Charts Area -->
      <div class="charts-grid">
        <!-- Chart 1: Incidentes por Año -->
        <div class="chart-card">
          <div class="chart-header">
            <span>Incidentes por Año</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-incidentes-anio"></canvas>
          </div>
        </div>

        <!-- Chart 2: Directo vs Contratista -->
        <div class="chart-card">
          <div class="chart-header">
            <span>Directo vs Contratista (Incidentes Totales)</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-doughnut"></canvas>
          </div>
        </div>

        <!-- Chart 3: Evolución Mensual -->
        <div class="chart-card col-span-3">
          <div class="chart-header">
            <span>Evolución Mensual (LTI, MTI, FAI)</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-mensual"></canvas>
          </div>
        </div>

        <!-- Chart 4: Tendencia LTIF -->
        <div class="chart-card">
          <div class="chart-header">
            <span>Tendencia LTIF</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-ltif"></canvas>
          </div>
        </div>

        <!-- Chart 5: Tendencia TIRF -->
        <div class="chart-card">
          <div class="chart-header">
            <span>Tendencia TIRF</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-tirf"></canvas>
          </div>
        </div>

        <!-- Table: Resumen -->
        <div class="chart-card">
          <div class="chart-header">
            <span>Resumen Anual (Promedios)</span>
          </div>
          <div class="summary-table-wrapper" style="flex-grow:1; overflow-y:auto; max-height:300px">
            <table class="summary-table" id="table-resumen">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>LTIF</th>
                  <th>TIRF</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                <!-- Dynamic -->
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  await setupFilters(container);
  
  // Initial load
  await loadAndRenderData(container);

  // Return cleanup function to destroy charts when leaving view
  return () => {
    Object.values(charts).forEach(destroyChart);
    charts = {};
  };
}

async function setupFilters(container) {
  const selectAnio = container.querySelector('#filter-anio');
  const selectTipo = container.querySelector('#filter-tipo');
  
  const [aniosRes, tiposRes] = await Promise.all([
    getAniosDisponibles(),
    getParametros('contratista')
  ]);

  if (!aniosRes.error && aniosRes.data) {
    aniosRes.data.forEach(a => {
      if (a.anio) selectAnio.innerHTML += `<option value="${a.anio}">${a.anio}</option>`;
    });
  }

  if (!tiposRes.error && tiposRes.data) {
    tiposRes.data.forEach(t => {
      selectTipo.innerHTML += `<option value="${t.valor}">${t.valor}</option>`;
    });
  }

  const selects = container.querySelectorAll('.dashboard-filters select');
  selects.forEach(s => s.addEventListener('change', () => loadAndRenderData(container)));

  container.querySelector('#btn-limpiar-filtros').addEventListener('click', () => {
    selects.forEach(s => s.value = 'Todos');
    loadAndRenderData(container);
  });
}

function getFilterValues(container) {
  const tipo = container.querySelector('#filter-tipo').value;
  const anio = container.querySelector('#filter-anio').value;
  const mes = container.querySelector('#filter-mes').value;
  
  const filters = {};
  if (tipo !== 'Todos') filters.tipo = tipo;
  if (anio !== 'Todos') filters.anio = parseInt(anio, 10);
  if (mes !== 'Todos') filters.mes = mes;
  
  return filters;
}

async function loadAndRenderData(container) {
  const filters = getFilterValues(container);
  const res = await getAllRegistros(filters); // Can be optimized later using getRegistrosParaDashboard
  
  if (res.error) {
    console.error(res.error);
    return;
  }
  
  const data = res.data || [];
  
  renderKPIs(container, data);
  renderCharts(container, data, filters);
  renderSummaryTable(container, data);
}

function renderKPIs(container, data) {
  // Aggregate data
  let totInc = 0, lti = 0, mti = 0, fai = 0, fatal = 0, hht = 0, sumLtif = 0, diasInc = 0;
  
  data.forEach(r => {
    totInc += (r.total_incidentes || 0);
    lti += (r.lti || 0);
    mti += (r.mti || 0);
    fai += (r.fai || 0);
    fatal += (r.fatalidad || 0);
    hht += (r.hht || 0);
    sumLtif += (r.ltif || 0);
    diasInc += (r.dias_incapacidad_at || 0) + (r.dias_cargados || 0);
  });
  
  const avgLtif = data.length > 0 ? (sumLtif / data.length) : 0;

  const kpis = [
    { label: 'TOTAL INCIDENTES', value: formatInteger(totInc) },
    { label: 'LTI (Lost Time)', value: formatInteger(lti) },
    { label: 'MTI (Med Treat)', value: formatInteger(mti) },
    { label: 'FAI (First Aid)', value: formatInteger(fai) },
    { label: 'FATALIDADES', value: formatInteger(fatal) },
    { label: 'HHT TOTAL', value: formatInteger(hht) },
    { label: 'LTIF PROM.', value: formatNumber(avgLtif) },
    { label: 'DÍAS INCAP.', value: formatInteger(diasInc) }
  ];

  const kpiHtml = kpis.map(k => `
    <div class="kpi-card">
      <span class="kpi-label">${k.label}</span>
      <span class="kpi-value">${k.value}</span>
    </div>
  `).join('');

  container.querySelector('#kpi-container').innerHTML = kpiHtml;
}

function renderCharts(container, data, filters) {
  // Common Colors
  const colFAI = '#06d6a0'; // green
  const colMTI = '#ffd166'; // yellow
  const colLTI = '#ef476f'; // red
  const colTotal = '#e8edf2'; // white/gray
  const colDir = '#00b4d8';
  const colCont = '#ffd166';
  
  // 1. Incidentes por Año
  const dataPorAnio = groupByAnio(data);
  const labelsAnio = Object.keys(dataPorAnio).sort();
  
  const dsAnioFAI = labelsAnio.map(y => dataPorAnio[y].fai);
  const dsAnioMTI = labelsAnio.map(y => dataPorAnio[y].mti);
  const dsAnioLTI = labelsAnio.map(y => dataPorAnio[y].lti);
  const dsAnioTot = labelsAnio.map(y => dataPorAnio[y].fai + dataPorAnio[y].mti + dataPorAnio[y].lti);

  if (charts.incidentesAnio) destroyChart(charts.incidentesAnio);
  const ctxAnio = container.querySelector('#chart-incidentes-anio').getContext('2d');
  charts.incidentesAnio = createBarChart(ctxAnio, {
    labels: labelsAnio,
    datasets: [
      { label: 'Total', data: dsAnioTot, type: 'line', borderColor: colTotal, backgroundColor: colTotal, borderWidth: 2, fill: false },
      { label: 'LTI', data: dsAnioLTI, backgroundColor: colLTI, stack: 'Stack 0' },
      { label: 'MTI', data: dsAnioMTI, backgroundColor: colMTI, stack: 'Stack 0' },
      { label: 'FAI', data: dsAnioFAI, backgroundColor: colFAI, stack: 'Stack 0' }
    ],
    stacked: true,
    showLine: true
  });

  // 2. Directo vs Contratista
  let sumDir = 0, sumCont = 0;
  data.forEach(r => {
    if ((r.tipo || '').toLowerCase() === 'directo') sumDir += (r.total_incidentes || 0);
    else sumCont += (r.total_incidentes || 0);
  });
  
  if (charts.doughnut) destroyChart(charts.doughnut);
  const ctxDoughnut = container.querySelector('#chart-doughnut').getContext('2d');
  charts.doughnut = createDoughnutChart(ctxDoughnut, {
    labels: ['Directo', 'Contratista'],
    data: [sumDir, sumCont],
    colors: [colDir, colCont]
  });

  // 3. Evolución Mensual
  // If year is selected, show months of that year. If all years, we could show year-month, but let's aggregate by month
  const dataPorMes = groupByMes(data);
  
  const dsMesFAI = MESES.map(m => dataPorMes[m] ? dataPorMes[m].fai : 0);
  const dsMesMTI = MESES.map(m => dataPorMes[m] ? dataPorMes[m].mti : 0);
  const dsMesLTI = MESES.map(m => dataPorMes[m] ? dataPorMes[m].lti : 0);

  if (charts.mensual) destroyChart(charts.mensual);
  const ctxMensual = container.querySelector('#chart-mensual').getContext('2d');
  charts.mensual = createLineChart(ctxMensual, {
    labels: MESES.map(m => m.substring(0,3)),
    datasets: [
      { label: 'LTI', data: dsMesLTI, borderColor: colLTI, tension: 0.3 },
      { label: 'MTI', data: dsMesMTI, borderColor: colMTI, tension: 0.3 },
      { label: 'FAI', data: dsMesFAI, borderColor: colFAI, tension: 0.3 }
    ],
    fill: false
  });

  // 4. Tendencia LTIF
  const dsAnioLTIF = labelsAnio.map(y => {
    // Average LTIF for the year
    const regs = data.filter(r => r.anio.toString() === y);
    const sum = regs.reduce((acc, curr) => acc + (curr.ltif || 0), 0);
    return regs.length ? sum / regs.length : 0;
  });

  if (charts.ltif) destroyChart(charts.ltif);
  const ctxLtif = container.querySelector('#chart-ltif').getContext('2d');
  charts.ltif = createLineChart(ctxLtif, {
    labels: labelsAnio,
    datasets: [{ label: 'LTIF Promedio', data: dsAnioLTIF, borderColor: '#48cae4', backgroundColor: 'rgba(72, 202, 228, 0.2)' }],
    fill: true
  });

  // 5. Tendencia TIRF
  const dsAnioTIRF = labelsAnio.map(y => {
    const regs = data.filter(r => r.anio.toString() === y);
    const sum = regs.reduce((acc, curr) => acc + (curr.tirf || 0), 0);
    return regs.length ? sum / regs.length : 0;
  });

  if (charts.tirf) destroyChart(charts.tirf);
  const ctxTirf = container.querySelector('#chart-tirf').getContext('2d');
  charts.tirf = createLineChart(ctxTirf, {
    labels: labelsAnio,
    datasets: [{ label: 'TIRF Promedio', data: dsAnioTIRF, borderColor: '#9b5de5', backgroundColor: 'rgba(155, 93, 229, 0.2)' }],
    fill: true
  });
}

function renderSummaryTable(container, data) {
  const dataPorAnio = groupByAnio(data);
  const anios = Object.keys(dataPorAnio).sort().reverse();
  const tbody = container.querySelector('#table-resumen tbody');
  
  if (anios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No hay datos</td></tr>';
    return;
  }

  tbody.innerHTML = anios.map(y => {
    const obj = dataPorAnio[y];
    const avgLtif = obj.count > 0 ? obj.ltifSum / obj.count : 0;
    const avgTirf = obj.count > 0 ? obj.tirfSum / obj.count : 0;
    const avgSr = obj.count > 0 ? obj.srSum / obj.count : 0;
    
    return `
      <tr>
        <td><strong>${y}</strong></td>
        <td>${formatNumber(avgLtif)}</td>
        <td>${formatNumber(avgTirf)}</td>
        <td>${formatNumber(avgSr)}</td>
      </tr>
    `;
  }).join('');
}

// Helpers
function groupByAnio(data) {
  return data.reduce((acc, r) => {
    const y = r.anio || 'N/A';
    if (!acc[y]) {
      acc[y] = { fai: 0, mti: 0, lti: 0, ltifSum: 0, tirfSum: 0, srSum: 0, count: 0 };
    }
    acc[y].fai += (r.fai || 0);
    acc[y].mti += (r.mti || 0);
    acc[y].lti += (r.lti || 0);
    acc[y].ltifSum += (r.ltif || 0);
    acc[y].tirfSum += (r.tirf || 0);
    acc[y].srSum += (r.sr || 0);
    acc[y].count += 1;
    return acc;
  }, {});
}

function groupByMes(data) {
  return data.reduce((acc, r) => {
    const m = r.mes;
    if (!acc[m]) {
      acc[m] = { fai: 0, mti: 0, lti: 0 };
    }
    acc[m].fai += (r.fai || 0);
    acc[m].mti += (r.mti || 0);
    acc[m].lti += (r.lti || 0);
    return acc;
  }, {});
}
