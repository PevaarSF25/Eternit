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
let currentComments = {};

export async function renderRegistro(container) {
  // Build HTML
  container.innerHTML = `
    <div class="registro-container">
      <div class="registro-header">
        <h2>Registro de Datos SST</h2>
        <div class="tipo-selector-container">
          <div class="segmented-control" id="tipo-registro-toggle">
            <button type="button" class="control-btn active" data-value="Directo">Data Directo</button>
            <button type="button" class="control-btn" data-value="Contratista">Data Contratista</button>
          </div>
          <input type="hidden" id="tipo-select" value="Directo">
        </div>
      </div>

      <div class="registro-form">
        <!-- Columna Izquierda: Formulario de entrada -->
        <div class="form-inputs-column">
          <form id="registro-form">
            
            <div class="card form-section" style="margin-bottom:var(--space-6)">
              <h3 class="form-section-title">1. Información General</h3>
              <div class="form-grid">
                ${renderSelect('planta', [])}
                ${renderSelect('empresa', [])}
                ${renderSelect('tipo', [])}
                ${renderSelect('anio', [])}
                ${renderSelect('mes', [])}
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
                ${renderInput('dias_incapacidad_at_elementia')}
                ${renderInput('dias_incapacidad_at_ley')}
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
  await loadParametricas(container);

  // Bind events
  bindEvents(container);

  // Initial table load
  await refreshTable(container);
  
  // Set default values (e.g. current year)
  resetForm(container);
}

function renderInput(key) {
  const def = getFieldDefinition(key);
  if (!def) return '';
  return `
    <div class="form-group" style="position:relative;">
      <label for="input-${key}" class="form-label">${def.label}</label>
      <div style="display:flex; align-items:center; gap:8px;">
        <input type="number" class="form-input" id="input-${key}" name="${key}" min="0" step="any" style="flex:1;">
        <button type="button" class="btn-comment" data-key="${key}" title="Añadir comentario" style="background:none; border:none; cursor:pointer; color:var(--color-text-secondary); padding:4px;">
          <i data-lucide="message-square" style="width:18px;height:18px;"></i>
        </button>
      </div>
    </div>
  `;
}

function renderSelect(key, options) {
  const def = getFieldDefinition(key);
  if (!def) return '';
  return `
    <div class="form-group">
      <label for="input-${key}" class="form-label">${def.label}</label>
      <select class="form-select" id="input-${key}" name="${key}">
        <option value="" disabled selected>Seleccione...</option>
        ${options.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>
    </div>
  `;
}

async function loadParametricas(container) {
  const [ciudades, contratistas, meses, anios, empresas] = await Promise.all([
    getParametros('ciudad'),
    getParametros('contratista'),
    getParametros('mes'),
    getParametros('anio'),
    getParametros('empresa')
  ]);

  const populateSelect = (selector, dataArray) => {
    const select = container.querySelector(selector);
    if (select && dataArray && dataArray.length > 0) {
      select.innerHTML = '<option value="" disabled selected>Seleccione...</option>' + 
                         dataArray.map(p => `<option value="${p.valor}">${p.valor}</option>`).join('');
    }
  };

  populateSelect('#input-planta', ciudades.data);
  populateSelect('#input-empresa', empresas.data);
  populateSelect('#input-tipo', contratistas.data);
  populateSelect('#input-mes', meses.data);
  populateSelect('#input-anio', anios.data);
}

function handleTabChange(container, tabValue) {
  const tipoFormGroup = container.querySelector('#input-tipo').closest('.form-group');
  const inputTipo = container.querySelector('#input-tipo');
  const plantaFormGroup = container.querySelector('#input-planta').closest('.form-group');
  const empresaFormGroup = container.querySelector('#input-empresa').closest('.form-group');
  
  if (tabValue === 'Directo') {
    // Tipo: auto-set to Directo and hide
    if (!inputTipo.querySelector('option[value="Directo"]')) {
      const opt = document.createElement('option');
      opt.value = 'Directo';
      opt.text = 'Directo';
      inputTipo.appendChild(opt);
    }
    inputTipo.value = 'Directo';
    if (tipoFormGroup) tipoFormGroup.style.display = 'none';
    
    // Planta: show, Empresa: hide
    if (plantaFormGroup) plantaFormGroup.style.display = 'flex';
    if (empresaFormGroup) empresaFormGroup.style.display = 'none';
    
    // Clear empresa value
    container.querySelector('#input-empresa').value = '';
  } else {
    // Tipo: show for contratista selection
    if (inputTipo.value === 'Directo') {
      inputTipo.value = '';
    }
    if (tipoFormGroup) tipoFormGroup.style.display = 'flex';
    
    // Planta: hide, Empresa: show
    if (plantaFormGroup) plantaFormGroup.style.display = 'none';
    if (empresaFormGroup) empresaFormGroup.style.display = 'flex';
    
    // Clear planta value
    container.querySelector('#input-planta').value = '';
  }
  
  updateCalculatedFields(container);
}

function bindEvents(container) {
  const form = container.querySelector('#registro-form');
  const hiddenTipoInput = container.querySelector('#tipo-select');
  const toggleContainer = container.querySelector('#tipo-registro-toggle');
  const btnLimpiar = container.querySelector('#btn-limpiar');
  
  // Sincronizar control de pestañas segmentadas
  if (toggleContainer) {
    const controlButtons = toggleContainer.querySelectorAll('.control-btn');
    controlButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        
        // Visual active state switch
        controlButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update hidden input
        hiddenTipoInput.value = val;
        
        // Hide/show Tipo form group and set default value
        handleTabChange(container, val);
        
        // Filter table dynamically based on active tab
        refreshTable(container);
      });
    });
  }
  
  // Recalculate indicators on input change
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => updateCalculatedFields(container));
  });
  
  // Sincronizar campo tipo en Información General con el hidden input
  const inputTipo = container.querySelector('#input-tipo');
  if (inputTipo) {
    inputTipo.addEventListener('change', () => {
      const activeTabBtn = container.querySelector('#tipo-registro-toggle .control-btn.active');
      const activeTabVal = activeTabBtn ? activeTabBtn.dataset.value : 'Directo';
      if (activeTabVal === 'Contratista') {
        hiddenTipoInput.value = inputTipo.value;
      }
    });
  }

  // Comentarios
  const btnComments = container.querySelectorAll('.btn-comment');
  btnComments.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const currentText = currentComments[key] || '';
      const text = window.prompt(`Comentario para ${getFieldDefinition(key).label}:`, currentText);
      if (text !== null) {
        if (text.trim() === '') {
          delete currentComments[key];
          btn.style.color = 'var(--color-text-secondary)';
        } else {
          currentComments[key] = text.trim();
          btn.style.color = 'var(--color-danger)';
        }
      }
    });
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
  
  const activeTabBtn = container.querySelector('#tipo-registro-toggle .control-btn.active');
  const activeTabVal = activeTabBtn ? activeTabBtn.dataset.value : 'Directo';
  
  if (activeTabVal === 'Contratista') {
    data.tipo = container.querySelector('#input-tipo').value || '';
    data.empresa = container.querySelector('#input-empresa').value || '';
    data.planta = ''; // No aplica en Contratista
  } else {
    data.tipo = 'Directo';
    data.planta = container.querySelector('#input-planta').value || '';
    data.empresa = ''; // No aplica en Directo
  }
  
  data.comentarios = currentComments;
  
  INPUT_FIELDS.forEach(f => {
    if (f.key !== 'tipo' && f.key !== 'comentarios' && f.key !== 'planta' && f.key !== 'empresa') {
      const el = container.querySelector(`#input-${f.key}`);
      if (el) {
        if (el.value === '') {
          data[f.key] = null;
        } else {
          let val = el.value;
          if (f.type === 'integer') val = parseInt(val, 10);
          if (f.type === 'numeric') val = parseFloat(val);
          data[f.key] = isNaN(val) ? (f.type === 'select' ? el.value : null) : val;
        }
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
  currentComments = {};
  const form = container.querySelector('#registro-form');
  form.reset();
  
  // Set all numeric to empty
  INPUT_FIELDS.forEach(f => {
    if (f.key !== 'tipo' && f.key !== 'comentarios') {
      const el = container.querySelector(`#input-${f.key}`);
      if (el) el.value = '';
    }
  });
  
  // Reset comment buttons color
  container.querySelectorAll('.btn-comment').forEach(btn => {
    btn.style.color = 'var(--color-text-secondary)';
  });
  
  // Sincronizar el formulario con el estado de la pestaña activa en la cabecera
  const activeTabBtn = container.querySelector('#tipo-registro-toggle .control-btn.active');
  const activeTabVal = activeTabBtn ? activeTabBtn.dataset.value : 'Directo';
  
  container.querySelector('#tipo-select').value = activeTabVal;
  handleTabChange(container, activeTabVal);
  
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

  // Filtrar los datos en base a la pestaña activa en la cabecera
  const activeTabBtn = container.querySelector('#tipo-registro-toggle .control-btn.active');
  const activeTabVal = activeTabBtn ? activeTabBtn.dataset.value : 'Directo';
  
  const records = res.data || [];
  const filteredRecords = records.filter(r => {
    if (activeTabVal === 'Directo') {
      return r.tipo === 'Directo';
    } else {
      return r.tipo !== 'Directo';
    }
  });

  // Calculate Acumulado row
  const sumData = {
    fai: 0, mti: 0, mwd: 0, lti: 0, dp: 0, nm: 0, hht: 0,
    num_trabajadores: 0, fatalidad: 0,
    dias_incapacidad_at_elementia: 0, dias_incapacidad_at_ley: 0,
    dias_cargados: 0, casos_eg: 0, incapacidad_eg: 0, casos_el: 0
  };

  filteredRecords.forEach(r => {
    Object.keys(sumData).forEach(key => {
      sumData[key] += (Number(r[key]) || 0);
    });
  });

  const sumIndicators = calcularTodosLosIndicadores(sumData);
  const footerRow = {
    anio: 'Acumulado',
    mes: '-',
    tipo: '-',
    planta: '-',
    empresa: '-',
    num_trabajadores: sumData.num_trabajadores,
    hht: sumData.hht,
    total_incidentes: sumIndicators.total_incidentes,
    ltif: sumIndicators.ltif
  };

  // Columnas dinámicas según la pestaña activa
  const columns = [
    { key: 'anio', label: 'Año' },
    { key: 'mes', label: 'Mes' },
    { key: 'tipo', label: 'Tipo' },
    ...(activeTabVal === 'Directo'
      ? [{ key: 'planta', label: 'Planta' }]
      : [{ key: 'empresa', label: 'Empresa' }]
    ),
    { key: 'num_trabajadores', label: 'Trabajadores' },
    { key: 'hht', label: 'HHT', format: (v) => formatNumber(v, 0) },
    { key: 'total_incidentes', label: 'Total Inc.' },
    { key: 'ltif', label: 'LTIF', format: (v) => formatNumber(v) }
  ];

  // Always recreate the table when switching tabs (columns change)
  if (dataTableInstance) {
      dataTableInstance.destroy();
  }
  
  dataTableInstance = createDataTable({
    containerId: 'table-container',
    columns,
    data: filteredRecords,
    footerRow,
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
}

function loadRecordIntoForm(container, record) {
  currentRecordId = record.id;
  currentComments = record.comentarios || {};
  
  const isDirecto = (record.tipo === 'Directo');
  const controlButtons = container.querySelectorAll('#tipo-registro-toggle .control-btn');
  
  // Sincronizar visualmente el toggle
  controlButtons.forEach(btn => {
    const val = btn.dataset.value;
    if ((isDirecto && val === 'Directo') || (!isDirecto && val === 'Contratista')) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Sincronizar el hidden input
  container.querySelector('#tipo-select').value = record.tipo;
  
  // Sincronizar campos de Planta/Empresa
  handleTabChange(container, isDirecto ? 'Directo' : 'Contratista');
  
  if (!isDirecto) {
    container.querySelector('#input-tipo').value = record.tipo;
    if (record.empresa) {
      container.querySelector('#input-empresa').value = record.empresa;
    }
  } else {
    if (record.planta) {
      container.querySelector('#input-planta').value = record.planta;
    }
  }
  
  INPUT_FIELDS.forEach(f => {
    if (f.key !== 'tipo' && f.key !== 'comentarios' && f.key !== 'planta' && f.key !== 'empresa') {
      const el = container.querySelector(`#input-${f.key}`);
      if (el && record[f.key] !== undefined && record[f.key] !== null) {
        el.value = record[f.key];
      } else if (el) {
        el.value = '';
      }
    }
  });
  
  // Update comment buttons visual state
  container.querySelectorAll('.btn-comment').forEach(btn => {
    const key = btn.dataset.key;
    if (currentComments[key]) {
      btn.style.color = 'var(--color-danger)';
    } else {
      btn.style.color = 'var(--color-text-secondary)';
    }
  });
  
  updateCalculatedFields(container);
  
  container.querySelector('#btn-guardar').innerHTML = '<i data-lucide="edit"></i> Actualizar Registro';
  if (window.lucide) window.lucide.createIcons();
  
  // Scroll up
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
