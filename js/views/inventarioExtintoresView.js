import { showToast } from '../components/toast.js';
import { showConfirmModal } from '../components/modal.js';
import { createDataTable } from '../components/dataTable.js';
import { getParametros } from '../services/parametricaService.js';
import { initDatePicker } from '../components/datePicker.js';
import {
  getAllInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario
} from '../services/inventarioExtintoresService.js';

let currentRecordId = null;
let dataTableInstance = null;
let cachedInventario = null;

export async function renderInventarioExtintores(container) {
    container.innerHTML = `
    <div class="registro-container">
      <div class="registro-header" style="display:flex; flex-direction:column; align-items:stretch; gap:var(--space-4); margin-bottom:var(--space-6); width:100%;">
        <h2>Inventario de Extintores</h2>
        
        <div style="display:flex; align-items:center; width:100%; gap: 12px; flex-wrap: wrap;">
          <div class="search-wrapper" id="table-search-wrapper" style="position:relative; flex:0 1 400px;">
            <input type="text" class="form-input" id="table-search-input" placeholder="Buscar por serie, tipo, ubicación..." style="width:100%; padding-left:40px; background-color:var(--bg-surface); border:1px solid var(--border-default);">
            <i data-lucide="search" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); width:16px; height:16px; pointer-events:none;"></i>
          </div>
          
          <button class="btn btn-primary btn-glow" id="btn-nuevo-registro" style="display:none; flex-shrink:0; white-space:nowrap; align-items:center; gap:6px; margin-left:auto;">
            <i data-lucide="plus" style="width:16px;height:16px;"></i> Nuevo Extintor
          </button>
        </div>
      </div>

      <!-- Tabla de Registros -->
      <div id="view-table" class="registros-table-section card active-view">
        <div class="table-header" style="margin-bottom:var(--space-4);">
          <h3 class="card-title"><i data-lucide="list"></i> Extintores Registrados</h3>
        </div>
        <div id="table-container"></div>
      </div>

      <!-- Formulario de Registro -->
      <div id="view-form" class="registro-form" style="display: none;">
        <div style="margin-bottom: var(--space-4);">
          <button class="btn-back" id="btn-volver-tabla" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:500;">
            <i data-lucide="arrow-left" style="width:18px;height:18px;"></i> Volver al inventario
          </button>
        </div>

        <form id="registro-form">
            <fieldset id="form-fieldset" style="border:none; padding:0; margin:0;">
                
                <div class="card form-section" style="margin-bottom:var(--space-6)">
                    <h3 class="form-section-title">Información del Extintor</h3>
                    <div class="form-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
                        <div class="form-group">
                            <label for="input-numero_serie" class="form-label">Número de Serie</label>
                            <input type="text" class="form-input" id="input-numero_serie" name="numero_serie" required placeholder="Ej: EXT-01">
                        </div>
                        <div class="form-group">
                            <label for="input-tipo" class="form-label">Tipo de Extintor</label>
                            <select class="form-select" id="input-tipo" name="tipo" required>
                                <option value="" disabled selected>Seleccione...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="input-capacidad" class="form-label">Capacidad</label>
                            <input type="text" class="form-input" id="input-capacidad" name="capacidad" required placeholder="Ej: 10 lbs">
                        </div>
                        <div class="form-group">
                            <label for="input-ubicacion" class="form-label">Ubicación</label>
                            <select class="form-select" id="input-ubicacion" name="ubicacion" required>
                                <option value="" disabled selected>Seleccione...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="input-clase_fuego" class="form-label">Clase de Fuego</label>
                            <select class="form-select" id="input-clase_fuego" name="clase_fuego" required>
                                <option value="" disabled selected>Seleccione...</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="K/F">K / F</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="input-ultima_recarga" class="form-label">Última Fecha de Recarga</label>
                            <input type="text" class="form-input" id="input-ultima_recarga" name="ultima_recarga" required readonly placeholder="Seleccione fecha...">
                        </div>
                    </div>
                </div>

                <div class="form-actions" id="form-actions-container">
                    <button type="button" class="btn btn-secondary" id="btn-limpiar">
                        <i data-lucide="refresh-cw"></i> Limpiar
                    </button>
                    <button type="submit" class="btn btn-primary" id="btn-guardar">
                        <i data-lucide="save"></i> Guardar Extintor
                    </button>
                </div>

            </fieldset>
        </form>
      </div>
    </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    await loadParametricas(container);
    
    // Initialize Date Picker
    const recargaInput = container.querySelector('#input-ultima_recarga');
    initDatePicker(recargaInput, null, 'YYYY-MM-DD');

    bindEvents(container);
    await refreshTable(container);
    resetForm(container);
}

async function loadParametricas(container) {
    const [tipos, ubicaciones] = await Promise.all([
        getParametros('extintor_codigo'),
        getParametros('extintor_ubicacion')
    ]);

    const selectTipo = container.querySelector('#input-tipo');
    if (selectTipo && tipos.data) {
        selectTipo.innerHTML = '<option value="" disabled selected>Seleccione...</option>' + 
            tipos.data.map(p => `<option value="${p.valor}">${p.valor}</option>`).join('');
    }

    const selectUbicacion = container.querySelector('#input-ubicacion');
    if (selectUbicacion && ubicaciones.data) {
        selectUbicacion.innerHTML = '<option value="" disabled selected>Seleccione...</option>' + 
            ubicaciones.data.map(p => `<option value="${p.valor}">${p.valor}</option>`).join('');
    }
}

function bindEvents(container) {
    const form = container.querySelector('#registro-form');
    const btnLimpiar = container.querySelector('#btn-limpiar');
    const btnNuevoRegistro = container.querySelector('#btn-nuevo-registro');
    const btnVolverTabla = container.querySelector('#btn-volver-tabla');
    const viewTable = container.querySelector('#view-table');
    const viewForm = container.querySelector('#view-form');
    const tableSearchInput = container.querySelector('#table-search-input');
    const tableSearchWrapper = container.querySelector('#table-search-wrapper');

    const showForm = () => {
        viewTable.style.display = 'none';
        btnNuevoRegistro.style.display = 'none';
        if (tableSearchWrapper) tableSearchWrapper.style.display = 'none';
        viewForm.style.display = 'block';
    };

    const showTable = () => {
        viewForm.style.display = 'none';
        viewTable.style.display = 'block';
        btnNuevoRegistro.style.display = 'inline-flex';
        if (tableSearchWrapper) tableSearchWrapper.style.display = 'block';
        refreshTable(container);
    };

    container._showForm = showForm;

    if (tableSearchInput) {
        let timeout;
        tableSearchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                refreshTable(container);
            }, 300);
        });
    }

    btnNuevoRegistro.addEventListener('click', () => {
        resetForm(container);
        setReadOnly(container, false);
        showForm();
    });

    btnVolverTabla.addEventListener('click', () => {
        showTable();
    });

    btnLimpiar.addEventListener('click', () => {
        resetForm(container);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveRecord(container);
        showTable();
    });

    showTable();
}

function resetForm(container) {
    currentRecordId = null;
    const form = container.querySelector('#registro-form');
    form.reset();
    
    // Default date to today
    container.querySelector('#input-ultima_recarga').value = new Date().toISOString().slice(0, 10);
    
    container.querySelector('#btn-guardar').innerHTML = '<i data-lucide="save"></i> Guardar Extintor';
    if (window.lucide) window.lucide.createIcons();
}

function calcularVencimiento(fechaRecarga) {
    // Adds exactly 1 year (or 365 days)
    const date = new Date(fechaRecarga + 'T00:00:00');
    // Using simple Date methods, adding 1 year is robust against leap years
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().slice(0, 10);
}

function calcularEstadoVisual(vencimientoDateString) {
    if (!vencimientoDateString) return { text: 'Desconocido', bg: '#e2e8f0', color: '#475569' };
    
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const venc = new Date(vencimientoDateString + 'T00:00:00');
    
    const diffTime = venc.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
        return { text: 'Vencido', color: 'var(--danger)', bg: 'var(--danger-bg)' };
    } else if (diffDays <= 30) {
        return { text: 'Próximo a vencer', color: 'var(--warning)', bg: 'var(--warning-bg)' };
    } else {
        return { text: 'Al día', color: 'var(--success)', bg: 'var(--success-bg)' };
    }
}

function getFormData(container) {
    const ultima_recarga = container.querySelector('#input-ultima_recarga').value;
    const vencimiento = calcularVencimiento(ultima_recarga);

    return {
        numero_serie: container.querySelector('#input-numero_serie').value,
        tipo: container.querySelector('#input-tipo').value,
        capacidad: container.querySelector('#input-capacidad').value,
        ubicacion: container.querySelector('#input-ubicacion').value,
        clase_fuego: container.querySelector('#input-clase_fuego').value,
        ultima_recarga: ultima_recarga,
        vencimiento: vencimiento
    };
}

async function saveRecord(container) {
    const btn = container.querySelector('#btn-guardar');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px"></div> Guardando...';
    btn.disabled = true;

    try {
        const datos = getFormData(container);
        
        let res;
        if (currentRecordId) {
            res = await updateInventario(currentRecordId, datos);
        } else {
            res = await createInventario(datos);
        }

        if (res.error) throw res.error;

        showToast(currentRecordId ? 'Extintor actualizado' : 'Extintor guardado', 'success');
        resetForm(container);
        await refreshTable(container, true);
        
    } catch (err) {
        showToast(err.message || 'Error al guardar', 'error');
    } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
    }
}

async function refreshTable(container, forceFetch = false) {
    const tableContainer = container.querySelector('#table-container');
    
    if (!dataTableInstance) {
        tableContainer.innerHTML = '<div class="spinner" style="margin:20px auto"></div>';
    }

    if (forceFetch || !cachedInventario) {
        const res = await getAllInventario();
        if (res.error) {
            tableContainer.innerHTML = `<p style="color:var(--color-danger)">Error: ${res.error.message}</p>`;
            return;
        }
        cachedInventario = res.data || [];
    }

    const searchInput = container.querySelector('#table-search-input');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filterByQuery = (records) => {
        if (!query) return records;
        return records.filter(r => {
            const str = `
                ${r.numero_serie || ''} 
                ${r.tipo || ''} 
                ${r.ubicacion || ''}
            `.toLowerCase();
            return str.includes(query);
        });
    };

    const displayRows = filterByQuery(cachedInventario);

    if (dataTableInstance) {
        dataTableInstance.destroy();
        dataTableInstance = null;
    }

    const columns = [
        { key: 'numero_serie', label: 'Nº SERIE' },
        { key: 'tipo', label: 'TIPO' },
        { key: 'capacidad', label: 'CAP.' },
        { key: 'ubicacion', label: 'UBICACIÓN' },
        { key: 'clase_fuego', label: 'CLASE' },
        { key: 'ultima_recarga', label: 'ÚLTIMA RECARGA' },
        { key: 'vencimiento', label: 'VENCIMIENTO' },
        { 
            key: 'estado', 
            label: 'ESTADO',
            format: (v, item) => {
                const estado = calcularEstadoVisual(item.vencimiento);
                return `<span style="background:${estado.bg}; color:${estado.color}; padding:4px 8px; border-radius:12px; font-weight:bold; font-size:11px; text-transform:uppercase;">${estado.text}</span>`;
            }
        }
    ];

    dataTableInstance = createDataTable({
        containerId: 'table-container',
        columns,
        data: displayRows,
        onView: async (record) => {
            await openRecordForEdit(container, record.id, true);
        },
        onEdit: async (record) => {
            await openRecordForEdit(container, record.id, false);
        },
        onDelete: async (record) => {
            const confirmed = await showConfirmModal('Eliminar', `¿Seguro que desea eliminar el extintor ${record.numero_serie}?`);
            if (confirmed) {
                const delRes = await deleteInventario(record.id);
                if (delRes.error) showToast('Error al eliminar', 'error');
                else {
                    showToast('Extintor eliminado', 'success');
                    await refreshTable(container, true);
                }
            }
        },
        emptyMessage: 'No hay extintores en el inventario.'
    });
}

async function openRecordForEdit(container, id, isReadOnly) {
    const res = await getInventarioById(id);
    if (res.error || !res.data) {
        showToast('Error al cargar el extintor', 'error');
        return;
    }
    
    loadRecordIntoForm(container, res.data);
    setReadOnly(container, isReadOnly);
    container._showForm();
}

function setReadOnly(container, isReadOnly) {
    const fieldset = container.querySelector('#form-fieldset');
    const actionsContainer = container.querySelector('#form-actions-container');
    
    if (fieldset) {
        fieldset.disabled = isReadOnly;
    }
    
    if (actionsContainer) {
        actionsContainer.style.display = isReadOnly ? 'none' : 'flex';
    }
}

function loadRecordIntoForm(container, record) {
    currentRecordId = record.id;
    
    container.querySelector('#input-numero_serie').value = record.numero_serie || '';
    container.querySelector('#input-tipo').value = record.tipo || '';
    container.querySelector('#input-capacidad').value = record.capacidad || '';
    container.querySelector('#input-ubicacion').value = record.ubicacion || '';
    container.querySelector('#input-clase_fuego').value = record.clase_fuego || '';
    container.querySelector('#input-ultima_recarga').value = record.ultima_recarga || '';
    
    container.querySelector('#btn-guardar').innerHTML = '<i data-lucide="edit"></i> Actualizar Extintor';
    if (window.lucide) window.lucide.createIcons();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
