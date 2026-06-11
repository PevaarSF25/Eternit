import { getAllRegistros, getAniosDisponibles } from '../services/registroService.js';
import { createBarChart, createDoughnutChart, createLineChart, destroyChart } from '../components/chartBuilder.js';
import { formatNumber, formatInteger } from '../utils/formatter.js';
import { MESES, TIPOS_TRABAJADOR } from '../models/incidente.js';

let charts = {}; // Store chart instances

export async function renderDashboard(container) {
  container.innerHTML = `
    <div class="dashboard-container">
      
      <!-- Filters -->
      <div class="dashboard-filters card">
        <div style="margin-bottom:var(--space-3);">
          <h2 style="margin:0; font-size:var(--text-lg); font-weight:700; color:var(--text-primary); line-height:1.3;">Dashboard HSE — Eternit Barranquilla</h2>
          <p style="margin:2px 0 0; font-size:var(--text-xs); color:var(--text-secondary);">Incidentes y métricas de seguridad · Directo y Contratista · 2017 – 2026</p>
        </div>
        <div style="display:flex; align-items:flex-end; gap:var(--space-5); flex-wrap:wrap; width: 100%;">
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
          <button class="btn btn-secondary" id="btn-limpiar-filtros" style="height:38px;">
            <i data-lucide="filter-x"></i> Limpiar
          </button>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid" id="kpi-container">
        <!-- Rendered dynamically -->
      </div>

      <!-- Charts Area -->
      <div class="charts-grid">
        
        <!-- Chart 1: Incidentes por Año -->
        <div class="chart-card col-span-4">
          <div class="chart-header">
            <span>Incidentes totales por año</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-incidentes-anio"></canvas>
          </div>
        </div>

        <!-- Chart 2: Directo vs Contratista -->
        <div class="chart-card col-span-2">
          <div class="chart-header">
            <span>Directo vs Contratista</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-doughnut"></canvas>
          </div>
        </div>

        <!-- Chart 3: Evolución Mensual -->
        <div class="chart-card col-span-6">
          <div class="chart-header">
            <span>Evolución mensual — LTI, MTI, FAI</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-mensual"></canvas>
          </div>
        </div>

        <!-- Chart 4: Tasas anuales LTIF y TIRF -->
        <div class="chart-card col-span-3">
          <div class="chart-header">
            <span>Tasas anuales — LTIF y TIRF</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-tasas"></canvas>
          </div>
        </div>

        <!-- Chart 5: Dias incapacidad por año -->
        <div class="chart-card col-span-3">
          <div class="chart-header">
            <span>Dias incapacidad por año</span>
          </div>
          <div class="chart-container">
            <canvas id="chart-dias"></canvas>
          </div>
        </div>

        <!-- Table 1: Heatmap -->
        <div class="chart-card col-span-6">
          <div class="chart-header">
            <span>Mapa de calor: Total Incidentes año × mes</span>
          </div>
          <div class="heatmap-container" id="heatmap-container">
            <!-- Dynamic -->
          </div>
        </div>

        <!-- Table 2: Detalle mensual -->
        <div class="chart-card col-span-6">
          <div class="chart-header">
            <span id="detail-count">Detalle mensual</span>
          </div>
          <div class="detail-table-wrapper">
            <table class="detail-table" id="table-detalle">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Año-Mes</th>
                  <th>Trab.</th>
                  <th>HHT</th>
                  <th>FAI</th>
                  <th>MTI</th>
                  <th>LTI</th>
                  <th>Fatal.</th>
                  <th>Total</th>
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
  
  const [aniosRes] = await Promise.all([
    getAniosDisponibles()
  ]);

  if (!aniosRes.error && aniosRes.data) {
    aniosRes.data.forEach(a => {
      if (a) selectAnio.innerHTML += `<option value="${a}">${a}</option>`;
    });
  }

  // Populate Tipo dropdown with TIPOS_TRABAJADOR
  selectTipo.innerHTML = '<option value="Todos">Todos</option>';
  TIPOS_TRABAJADOR.forEach(t => {
    selectTipo.innerHTML += `<option value="${t}">${t}</option>`;
  });

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
  const res = await getAllRegistros(filters);
  
  if (res.error) {
    console.error(res.error);
    return;
  }
  
  const data = res.data || [];
  
  renderKPIs(container, data);
  renderCharts(container, data);
  renderHeatmap(container, data);
  renderDetailTable(container, data);
}

function renderKPIs(container, data) {
  let totInc = 0, lti = 0, mti = 0, fai = 0, fatal = 0, hht = 0, sumLtif = 0, diasIncLey = 0;
  
  data.forEach(r => {
    totInc += (r.total_incidentes || 0);
    lti += (r.lti || 0);
    mti += (r.mti || 0);
    fai += (r.fai || 0);
    fatal += (r.fatalidad || 0);
    hht += (r.hht || 0);
    sumLtif += (r.ltif || 0);
    diasIncLey += (r.dias_incapacidad_at_ley || 0);
  });
  
  const avgLtif = data.length > 0 ? (sumLtif / data.length) : 0;

  const kpis = [
    { label: 'TOTAL INCIDENTES', value: formatInteger(totInc) },
    { label: 'LTI<br/><small style="font-weight:400; font-size:10px; color:#aaa; text-transform:none">Lost Time Inj.</small>', value: formatInteger(lti) },
    { label: 'MTI<br/><small style="font-weight:400; font-size:10px; color:#aaa; text-transform:none">Medical Treat.</small>', value: formatInteger(mti) },
    { label: 'FAI<br/><small style="font-weight:400; font-size:10px; color:#aaa; text-transform:none">First Aid</small>', value: formatInteger(fai) },
    { label: 'FATALIDADES', value: formatInteger(fatal) },
    { label: 'HHT<br/><small style="font-weight:400; font-size:10px; color:#aaa; text-transform:none">Horas Trab.</small>', value: formatInteger(hht) },
    { label: 'LTIF PROMEDIO<br/><small style="font-weight:400; font-size:10px; color:#aaa; text-transform:none">LTI × 10⁶ / HHT</small>', value: formatNumber(avgLtif) },
    { label: 'DÍAS INCAP LEY', value: formatInteger(diasIncLey) }
  ];

  const kpiHtml = kpis.map(k => `
    <div class="kpi-card">
      <span class="kpi-label">${k.label}</span>
      <span class="kpi-value">${k.value}</span>
    </div>
  `).join('');

  container.querySelector('#kpi-container').innerHTML = kpiHtml;
}

function renderCharts(container, data) {
  const colFAI = '#06d6a0'; // green
  const colMTI = '#ffd166'; // yellow
  const colLTI = '#ef476f'; // red
  const colTotal = '#1e293b'; // dark slate for total line
  const colDir = '#3a86ff'; // blue
  const colCont = '#ffbe0b'; // yellow-orange
  
  const dataPorAnio = groupByAnio(data);
  const labelsAnio = Object.keys(dataPorAnio).sort();
  
  // 1. Incidentes por Año
  const dsAnioFAI = labelsAnio.map(y => dataPorAnio[y].fai);
  const dsAnioMTI = labelsAnio.map(y => dataPorAnio[y].mti);
  const dsAnioLTI = labelsAnio.map(y => dataPorAnio[y].lti);
  const dsAnioTot = labelsAnio.map(y => dataPorAnio[y].fai + dataPorAnio[y].mti + dataPorAnio[y].lti);

  if (charts.incidentesAnio) destroyChart(charts.incidentesAnio);
  const ctxAnio = container.querySelector('#chart-incidentes-anio').getContext('2d');
  charts.incidentesAnio = createBarChart(ctxAnio, {
    labels: labelsAnio,
    datasets: [
      { label: 'Total', data: dsAnioTot, type: 'line', borderColor: colTotal, backgroundColor: colTotal, borderWidth: 2, fill: false, tension: 0.4 },
      { label: 'LTI', data: dsAnioLTI, backgroundColor: colLTI, stack: 'Stack 0' },
      { label: 'MTI', data: dsAnioMTI, backgroundColor: colMTI, stack: 'Stack 0' },
      { label: 'FAI', data: dsAnioFAI, backgroundColor: colFAI, stack: 'Stack 0' }
    ],
    stacked: true
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
  const aniosSorted = [...new Set(data.map(r => r.anio))].sort((a,b) => a - b);
  const labelsMes = [];
  const dsMesLTI = [];
  const dsMesMTI = [];
  const dsMesFAI = [];

  aniosSorted.forEach(y => {
    MESES.forEach((m, idx) => {
      const mesNum = String(idx + 1).padStart(2, '0');
      const label = `${y}-${mesNum}`;
      const regs = data.filter(r => r.anio === y && r.mes === m);
      
      labelsMes.push(label);
      dsMesLTI.push(regs.reduce((acc, curr) => acc + (curr.lti || 0), 0));
      dsMesMTI.push(regs.reduce((acc, curr) => acc + (curr.mti || 0), 0));
      dsMesFAI.push(regs.reduce((acc, curr) => acc + (curr.fai || 0), 0));
    });
  });

  if (charts.mensual) destroyChart(charts.mensual);
  const ctxMensual = container.querySelector('#chart-mensual').getContext('2d');
  charts.mensual = createLineChart(ctxMensual, {
    labels: labelsMes,
    datasets: [
      { label: 'LTI', data: dsMesLTI, borderColor: colLTI, tension: 0 },
      { label: 'MTI', data: dsMesMTI, borderColor: colMTI, tension: 0 },
      { label: 'FAI', data: dsMesFAI, borderColor: colFAI, tension: 0 }
    ],
    fill: false
  });

  // 4. Tasas anuales LTIF y TIRF
  const dsAnioLTIF = labelsAnio.map(y => {
    const regs = data.filter(r => r.anio.toString() === y);
    const sum = regs.reduce((acc, curr) => acc + (curr.ltif || 0), 0);
    return regs.length ? sum / regs.length : 0;
  });
  const dsAnioTIRF = labelsAnio.map(y => {
    const regs = data.filter(r => r.anio.toString() === y);
    const sum = regs.reduce((acc, curr) => acc + (curr.tirf || 0), 0);
    return regs.length ? sum / regs.length : 0;
  });

  if (charts.tasas) destroyChart(charts.tasas);
  const ctxTasas = container.querySelector('#chart-tasas').getContext('2d');
  charts.tasas = createBarChart(ctxTasas, {
    labels: labelsAnio,
    datasets: [
      { label: 'LTIF', data: dsAnioLTIF, backgroundColor: '#8a2be2' },
      { label: 'TIRF', data: dsAnioTIRF, backgroundColor: '#f72585' }
    ],
    stacked: false
  });

  // 5. Dias incapacidad por año
  const dsAnioATEfe = labelsAnio.map(y => {
      return data.filter(r => r.anio.toString() === y).reduce((acc, curr) => acc + (curr.dias_incapacidad_at_elementia || 0), 0);
  });
  const dsAnioATLey = labelsAnio.map(y => {
      return data.filter(r => r.anio.toString() === y).reduce((acc, curr) => acc + (curr.dias_incapacidad_at_ley || 0), 0);
  });
  const dsAnioEG = labelsAnio.map(y => {
      return data.filter(r => r.anio.toString() === y).reduce((acc, curr) => acc + (curr.incapacidad_eg || 0), 0);
  });

  if (charts.dias) destroyChart(charts.dias);
  const ctxDias = container.querySelector('#chart-dias').getContext('2d');
  charts.dias = createBarChart(ctxDias, {
    labels: labelsAnio,
    datasets: [
      { label: 'AT Efe.', data: dsAnioATEfe, backgroundColor: '#4ea8de' },
      { label: 'AT Ley', data: dsAnioATLey, backgroundColor: '#f77f00' },
      { label: 'EG', data: dsAnioEG, backgroundColor: '#06d6a0' }
    ],
    stacked: true
  });
}

function renderHeatmap(container, data) {
  const anios = [...new Set(data.map(r => r.anio))].sort((a,b) => a - b);
  const heatmapContainer = container.querySelector('#heatmap-container');
  
  if (anios.length === 0) {
    heatmapContainer.innerHTML = '<p style="text-align:center; padding: 20px;">No hay datos para mostrar el mapa de calor</p>';
    return;
  }

  const matrix = {};
  let maxVal = 0;
  anios.forEach(y => {
    matrix[y] = {};
    MESES.forEach(m => {
      const sum = data.filter(r => r.anio === y && r.mes === m).reduce((acc, curr) => acc + (curr.total_incidentes || 0), 0);
      matrix[y][m] = sum;
      if (sum > maxVal) maxVal = sum;
    });
  });

  let html = '<table class="heatmap-table"><thead><tr><th></th>';
  MESES.forEach(m => html += `<th>${m.substring(0,3)}</th>`);
  html += '</tr></thead><tbody>';

  anios.forEach(y => {
    html += `<tr><td><strong>${y}</strong></td>`;
    MESES.forEach(m => {
      const val = matrix[y][m];
      const intensity = val === 0 ? 0 : Math.max(0.1, val / maxVal);
      // Degradado a color rojizo (#962828 aprox)
      const bgColor = val === 0 ? 'transparent' : `rgba(175, 75, 75, ${intensity})`;
      const textColor = val > (maxVal * 0.4) ? '#fff' : 'var(--text-primary)';
      html += `<td class="heatmap-cell" style="background-color: ${bgColor}; color: ${textColor}">${val}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  heatmapContainer.innerHTML = html;
}

function renderDetailTable(container, data) {
  const MES_ORDEN = Object.fromEntries(MESES.map((m, i) => [m, i]));
  const sorted = [...data].sort((a, b) => {
    if (b.anio !== a.anio) return b.anio - a.anio;
    return (MES_ORDEN[b.mes] ?? -1) - (MES_ORDEN[a.mes] ?? -1);
  });

  container.querySelector('#detail-count').textContent = `Detalle mensual (${sorted.length} registros)`;

  const tbody = container.querySelector('#table-detalle tbody');
  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align:center">No hay datos</td></tr>';
    return;
  }

  tbody.innerHTML = sorted.map(r => `
    <tr>
      <td>${r.tipo || '-'}</td>
      <td>${r.anio}-${(r.mes || '').substring(0,3)}</td>
      <td>${formatInteger(r.num_trabajadores)}</td>
      <td>${formatInteger(r.hht)}</td>
      <td>${formatInteger(r.fai)}</td>
      <td>${formatInteger(r.mti)}</td>
      <td>${formatInteger(r.lti)}</td>
      <td>${formatInteger(r.fatalidad)}</td>
      <td><strong>${formatInteger(r.total_incidentes)}</strong></td>
      <td>${formatNumber(r.ltif)}</td>
      <td>${formatNumber(r.tirf)}</td>
      <td>${formatNumber(r.sr)}</td>
    </tr>
  `).join('');
}

// Helpers
function groupByAnio(data) {
  return data.reduce((acc, r) => {
    const y = r.anio || 'N/A';
    if (!acc[y]) {
      acc[y] = { fai: 0, mti: 0, lti: 0, count: 0 };
    }
    acc[y].fai += (r.fai || 0);
    acc[y].mti += (r.mti || 0);
    acc[y].lti += (r.lti || 0);
    acc[y].count += 1;
    return acc;
  }, {});
}
