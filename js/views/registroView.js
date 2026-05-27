import { getAllRegistros, createRegistro, updateRegistro, deleteRegistro } from '../services/registroService.js';
import { calcularTodosLosIndicadores } from '../services/calculoService.js';
import { getParametros } from '../services/parametricaService.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal } from '../components/modal.js';
import { createDataTable } from '../components/dataTable.js';
import { MESES, INPUT_FIELDS, CALCULATED_FIELDS, crearRegistroVacio, getFieldDefinition } from '../models/incidente.js';
import { formatNumber, formatPercent } from '../utils/formatter.js';

let currentRecordId = null;
let dataTableInstance = null;

export async function renderRegistro(container) {
  // Build HTML
  container.innerHTML = `
    <div class="registro-container">
      <div class="registro-header">
        <h2>Registro de Datos SST</h2>
        <div class="tipo-selector">
          <label class="form-label" style="margin:0">Tipo de Registro:</label>
          <select id="tipo-select" class="form-select" style="width:200px">
            <option value="Directo">Directo</option>
            <option value="Contratista">Contratista</option>
          </select>
        </div>
      </div>

      <div class="registro-form">
        <!-- Columna Izquierda: Formulario de entrada -->
        <div class="form-inputs-column">
          <form id="registro-form">
            
            <div class="card form-section" style="margin-bottom:var(--space-6)">
              <h3 class="form-section-title">1. Información General</h3>
              <div class="form-grid">
                ${renderInput('anio')}
                ${renderSelect('mes', MESES)}
                ${renderInput('num_trabajadores')}
                ${renderInput('hht')}
              </div>
            </div>

            <div class="card form-section" style="margin-bottom:var(--space-6)">
              <h3 class="form-section-title">2. Incidentes y Lesiones</h3>
              <div class="form-grid">
                ${renderInput('dp')}
                ${renderInput('nm')}
                ${renderInput('fai')}
                ${renderInput('mti')}
                ${renderInput('mwd')}
                ${renderInput('lti')}
                ${renderInput('fatalidad')}
              </div>
            </div>

            <div class="card form-section">
              <h3 class="form-section-title">3. Incapacidades y Ausentismo</h3>
              <div class="form-grid">
                ${renderInput('dias_incapacidad_at')}
                ${renderInput('dias_cargados')}
                ${renderInput('casos_eg')}
                ${renderInput('incapacidad_eg')}
                ${renderInput('casos_el')}
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="btn-limpiar">
                <i data-lucide="refresh-cw"></i> Limpiar
              </button>
              <button type="submit" class="btn btn-primary" id="btn-guardar">
                <i data-lucide="save"></i> Guardar Registro
              </button>
            </div>
          </form>
        </div>

        <!-- Columna Derecha: Indicadores calculados -->
        <div class="indicadores-column">
          <div class="card indicadores-section">
            <h3 class="form-section-title" style="margin-bottom:0">Indicadores Calculados</h3>
            <p style="color:var(--color-text-secondary);font-size:var(--text-xs);margin-bottom:var(--space-4)">Se actualizan en tiempo real.</p>
            
            <div class="indicadores-grid">
              ${CALCULATED_FIELDS.map(f => `
                <div class="indicador-item">
                  <span class="indicador-label">${f.label}</span>
                  <span class="indicador-value" id="calc-${f.key}">0.00</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Registros -->
      <div class="registros-table-section card">
        <div class="table-header">
          <h3 class="card-title"><i data-lucide="list"></i> Registros Guardados</h3>
        </div>
        <div id="table-container"></div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Load types from parametricas
  await loadTiposContratista(container);

  // Bind events
  bindEvents(container);

  // Initial table load
  await refreshTable(container);
  
  // Set default values (e.g. current year)
  resetForm(container);
}

function renderInput(key) {
  const def = getFieldDefinition(key);
  return `
    <div class="form-group">
      <label for="input-${key}" class="form-label">${def.label}</label>
      <input type="number" class="form-input" id="input-${key}" name="${key}" min="0" step="any" required>
    </div>
  `;
}

function renderSelect(key, options) {
  const def = getFieldDefinition(key);
  return `
    <div class="form-group">
      <label for="input-${key}" class="form-label">${def.label}</label>
      <select class="form-select" id="input-${key}" name="${key}" required>
        <option value="" disabled selected>Seleccione...</option>
        ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>
    </div>
  `;
}

async function loadTiposContratista(container) {
  const select = container.querySelector('#tipo-select');
  const res = await getParametros('contratista');
  if (!res.error && res.data && res.data.length > 0) {
    select.innerHTML = res.data.map(p => `<option value="${p.valor}">${p.valor}</option>`).join('');
  }
}

function bindEvents(container) {
  const form = container.querySelector('#registro-form');
  const tipoSelect = container.querySelector('#tipo-select');
  const btnLimpiar = container.querySelector('#btn-limpiar');
  
  // Recalculate indicators on input change
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => updateCalculatedFields(container));
  });
  
  tipoSelect.addEventListener('change', () => {
    // Optionally adapt form fields if Tipo is Contratista vs Directo
  });

  btnLimpiar.addEventListener('click', () => {
    resetForm(container);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveRecord(container);
  });
}

function getFormData(container) {
  const data = crearRegistroVacio();
  data.tipo = container.querySelector('#tipo-select').value;
  
  INPUT_FIELDS.forEach(f => {
    if (f.key !== 'tipo') {
      const el = container.querySelector(`#input-${f.key}`);
      if (el) {
        let val = el.value;
        if (f.type === 'integer') val = parseInt(val, 10);
        if (f.type === 'numeric') val = parseFloat(val);
        data[f.key] = isNaN(val) ? (f.type === 'select' ? el.value : 0) : val;
      }
    }
  });
  return data;
}

function updateCalculatedFields(container) {
  const data = getFormData(container);
  const calculated = calcularTodosLosIndicadores(data);
  
  CALCULATED_FIELDS.forEach(f => {
    const el = container.querySelector(`#calc-${f.key}`);
    if (el) {
      let valStr = '';
      if (f.key === 'proporcion_mortalidad') {
        valStr = formatPercent(calculated[f.key]);
      } else if (f.key === 'incidentes_lesiones' || f.key === 'total_incidentes') {
        valStr = Math.round(calculated[f.key]).toString();
      } else {
        valStr = formatNumber(calculated[f.key]);
      }
      
      // Animate if changed
      if (el.innerText !== valStr) {
        el.innerText = valStr;
        el.classList.add('changed');
        setTimeout(() => el.classList.remove('changed'), 500);
      }
    }
  });
}

function resetForm(container) {
  currentRecordId = null;
  const form = container.querySelector('#registro-form');
  form.reset();
  
  const anioDef = getFieldDefinition('anio');
  container.querySelector('#input-anio').value = anioDef.default;
  
  // Set all numeric to 0
  INPUT_FIELDS.forEach(f => {
    if (f.type !== 'select' && f.key !== 'anio') {
      const el = container.querySelector(`#input-${f.key}`);
      if (el) el.value = 0;
    }
  });
  
  container.querySelector('#tipo-select').value = 'Directo';
  
  container.querySelector('#btn-guardar').innerHTML = '<i data-lucide="save"></i> Guardar Registro';
  if (window.lucide) window.lucide.createIcons();
  
  updateCalculatedFields(container);
}

async function saveRecord(container) {
  const btn = container.querySelector('#btn-guardar');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px"></div> Guardando...';
  btn.disabled = true;

  try {
    const data = getFormData(container);
    // Calculated fields are added by the service
    
    let res;
    if (currentRecordId) {
      res = await updateRegistro(currentRecordId, data);
    } else {
      res = await createRegistro(data);
    }

    if (res.error) throw res.error;

    showToast(currentRecordId ? 'Registro actualizado' : 'Registro guardado', 'success');
    resetForm(container);
    await refreshTable(container);
    
  } catch (err) {
    showToast(err.message || 'Error al guardar', 'error');
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
    if (window.lucide) window.lucide.createIcons();
  }
}

async function refreshTable(container) {
  const tableContainer = container.querySelector('#table-container');
  
  // Show loading
  if (!dataTableInstance) {
    tableContainer.innerHTML = '<div class="spinner" style="margin:20px auto"></div>';
  }

  const res = await getAllRegistros();
  
  if (res.error) {
    tableContainer.innerHTML = `<p style="color:var(--color-danger)">Error: ${res.error.message}</p>`;
    return;
  }

  const columns = [
    { key: 'anio', label: 'Año' },
    { key: 'mes', label: 'Mes' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'num_trabajadores', label: 'Trabajadores' },
    { key: 'hht', label: 'HHT', format: (v) => formatNumber(v, 0) },
    { key: 'total_incidentes', label: 'Total Inc.' },
    { key: 'ltif', label: 'LTIF', format: (v) => formatNumber(v) }
  ];

  if (!dataTableInstance) {
    dataTableInstance = createDataTable({
      containerId: 'table-container',
      columns,
      data: res.data || [],
      onEdit: (record) => loadRecordIntoForm(container, record),
      onDelete: async (record) => {
        const confirmed = await showConfirmModal('Eliminar', `¿Seguro que desea eliminar el registro de ${record.mes} ${record.anio}?`);
        if (confirmed) {
          const delRes = await deleteRegistro(record.id);
          if (delRes.error) showToast('Error al eliminar', 'error');
          else {
            showToast('Registro eliminado', 'success');
            refreshTable(container);
          }
        }
      },
      emptyMessage: 'No hay registros guardados.'
    });
  } else {
    dataTableInstance.update(res.data || []);
  }
}

function loadRecordIntoForm(container, record) {
  currentRecordId = record.id;
  
  container.querySelector('#tipo-select').value = record.tipo || 'Directo';
  
  INPUT_FIELDS.forEach(f => {
    if (f.key !== 'tipo') {
      const el = container.querySelector(`#input-${f.key}`);
      if (el && record[f.key] !== undefined) {
        el.value = record[f.key];
      }
    }
  });
  
  updateCalculatedFields(container);
  
  container.querySelector('#btn-guardar').innerHTML = '<i data-lucide="edit"></i> Actualizar Registro';
  if (window.lucide) window.lucide.createIcons();
  
  // Scroll up
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
