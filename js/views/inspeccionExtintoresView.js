import { showToast } from '../components/toast.js';
import { showModal, showConfirmModal } from '../components/modal.js';
import { createDataTable } from '../components/dataTable.js';
import { getParametros } from '../services/parametricaService.js';
import { initDatePicker } from '../components/datePicker.js';
import { 
  getAllInspecciones, 
  getInspeccionById, 
  createInspeccion, 
  updateInspeccion, 
  deleteInspeccion 
} from '../services/inspeccionExtintoresService.js';
import { getAllInventario } from '../services/inventarioExtintoresService.js';

let currentRecordId = null;
let dataTableInstance = null;
let cachedInspecciones = null;

const ELEMENTOS_ESTADOS = ['Buen estado', 'Mal estado', 'No aplica'];

const ELEMENTOS_LISTA = [
    { key: 'estado_acceso', label: 'Acceso' },
    { key: 'estado_senalizacion', label: 'Señalización' },
    { key: 'estado_pared_altura', label: 'Pared/Altura' },
    { key: 'estado_piso_base', label: 'Piso (Base)' },
    { key: 'estado_limpieza', label: 'Limpieza' },
    { key: 'estado_rotulo', label: 'Rótulo' },
    { key: 'estado_cilindro', label: 'Cilindro' },
    { key: 'estado_manometro', label: 'Manómetro' },
    { key: 'estado_boquilla', label: 'Boquilla' },
    { key: 'estado_presion', label: 'Presión' },
    { key: 'estado_pin_seguridad', label: 'Pin de seguridad' },
    { key: 'estado_manguera', label: 'Manguera' },
    { key: 'estado_corneta', label: 'Corneta' },
    { key: 'estado_pintura', label: 'Pintura' },
    { key: 'estado_manija_transporte', label: 'Manija de transporte' },
    { key: 'estado_sello_garantia', label: 'Sello de garantía' }
];

export async function renderInspeccionExtintores(container) {
    container.innerHTML = `
    <div class="registro-container">
      <div class="registro-header" style="display:flex; flex-direction:column; align-items:stretch; gap:var(--space-4); margin-bottom:var(--space-6); width:100%;">
        <h2>Inspección Extintores</h2>
        
        <div style="display:flex; align-items:center; width:100%; gap: 12px; flex-wrap: wrap;">
          <div class="search-wrapper" id="table-search-wrapper" style="position:relative; flex:0 1 400px;">
            <input type="text" class="form-input" id="table-search-input" placeholder="Buscar por lugar, inspector, fecha..." style="width:100%; padding-left:40px; background-color:var(--bg-surface); border:1px solid var(--border-default);">
            <i data-lucide="search" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); width:16px; height:16px; pointer-events:none;"></i>
          </div>
          
          <button class="btn btn-primary btn-glow" id="btn-nuevo-registro" style="display:none; flex-shrink:0; white-space:nowrap; align-items:center; gap:6px; margin-left:auto;">
            <i data-lucide="plus" style="width:16px;height:16px;"></i> Crear nueva inspección
          </button>
        </div>
      </div>

      <!-- Tabla de Registros -->
      <div id="view-table" class="registros-table-section card active-view">
        <div class="table-header" style="margin-bottom:var(--space-4);">
          <h3 class="card-title"><i data-lucide="list"></i> Inspecciones Guardadas</h3>
        </div>
        <div id="table-container"></div>
      </div>

      <!-- Formulario de Registro -->
      <div id="view-form" class="registro-form" style="display: none;">
        <div style="margin-bottom: var(--space-4);">
          <button class="btn-back" id="btn-volver-tabla" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:500;">
            <i data-lucide="arrow-left" style="width:18px;height:18px;"></i> Volver a la tabla
          </button>
        </div>

        <form id="registro-form">
            <fieldset id="form-fieldset" style="border:none; padding:0; margin:0;">
                
                <div class="card form-section" style="margin-bottom:var(--space-6)">
                    <h3 class="form-section-title">1. Datos Generales</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="input-lugar_trabajo" class="form-label">Lugar de trabajo</label>
                            <select class="form-select" id="input-lugar_trabajo" name="lugar_trabajo" required>
                                <option value="" disabled selected>Seleccione...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="input-fecha" class="form-label">Fecha de Inspección</label>
                            <input type="text" class="form-input" id="input-fecha" name="fecha" required readonly placeholder="Seleccione fecha...">
                        </div>
                        <div class="form-group">
                            <label for="input-inspector_nombre" class="form-label">Nombre del Inspector</label>
                            <input type="text" class="form-input" id="input-inspector_nombre" name="inspector_nombre" required>
                        </div>
                        <div class="form-group">
                            <label for="input-inspector_cargo" class="form-label">Cargo del Inspector</label>
                            <input type="text" class="form-input" id="input-inspector_cargo" name="inspector_cargo" required>
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label for="input-observaciones_generales" class="form-label">Observaciones Generales</label>
                            <textarea class="form-input" id="input-observaciones_generales" name="observaciones_generales" rows="2"></textarea>
                        </div>
                    </div>
                </div>

                <div class="card form-section" style="margin-bottom:var(--space-6); background: transparent; border: none; box-shadow: none; padding: 0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-4);">
                        <h3 class="form-section-title" style="margin-bottom:0;">2. Detalle de Extintores</h3>
                        <button type="button" class="btn btn-secondary" id="btn-add-extintor" style="font-size: var(--text-sm);">
                            <i data-lucide="plus-circle" style="width:16px;height:16px;"></i> Añadir Extintor
                        </button>
                    </div>
                    
                    <div id="extintores-container" style="display:flex; flex-direction:column; gap: var(--space-4);">
                        <!-- Dynamic items will be injected here -->
                    </div>
                    <div id="extintores-empty-state" class="empty-state" style="margin-top:var(--space-4); background:var(--bg-surface); padding:var(--space-6); border-radius:var(--radius-md); text-align:center; border:1px dashed var(--border-default);">
                        <p style="color:var(--text-secondary); margin:0;">No se han añadido extintores a esta inspección.</p>
                    </div>
                </div>

                <div class="form-actions" id="form-actions-container">
                    <button type="button" class="btn btn-secondary" id="btn-limpiar">
                        <i data-lucide="refresh-cw"></i> Limpiar
                    </button>
                    <button type="submit" class="btn btn-primary" id="btn-guardar">
                        <i data-lucide="save"></i> Guardar Inspección
                    </button>
                </div>

            </fieldset>
        </form>
      </div>
    </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    await loadParametricas(container);
    
    // Initialize custom date picker
    const fechaInput = container.querySelector('#input-fecha');
    initDatePicker(fechaInput, null, 'YYYY-MM-DD');

    bindEvents(container);
    await refreshTable(container);
    resetForm(container);
}

async function loadParametricas(container) {
    const [ciudades, codigos, ubicaciones, inventario] = await Promise.all([
        getParametros('ciudad'),
        getParametros('extintor_codigo'),
        getParametros('extintor_ubicacion'),
        getAllInventario()
    ]);

    const selectLugar = container.querySelector('#input-lugar_trabajo');
    if (selectLugar && ciudades.data) {
        selectLugar.innerHTML = '<option value="" disabled selected>Seleccione...</option>' + 
            ciudades.data.map(p => `<option value="${p.valor}">${p.valor}</option>`).join('');
    }

    // Guardar para uso en renderizado dinámico
    window._paramExtintorCodigos = codigos.data || [];
    window._paramExtintorUbicaciones = ubicaciones.data || [];
    window._inventarioExtintores = inventario.data || [];
}

function bindEvents(container) {
    const form = container.querySelector('#registro-form');
    const btnLimpiar = container.querySelector('#btn-limpiar');
    const btnNuevoRegistro = container.querySelector('#btn-nuevo-registro');
    const btnVolverTabla = container.querySelector('#btn-volver-tabla');
    const btnAddExtintor = container.querySelector('#btn-add-extintor');
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

    btnAddExtintor.addEventListener('click', () => {
        addExtintorCard(container);
    });

    // Delegación para eliminar extintores
    container.querySelector('#extintores-container').addEventListener('click', (e) => {
        const btnRemove = e.target.closest('.btn-remove-extintor');
        if (btnRemove && !container.querySelector('#form-fieldset').disabled) {
            btnRemove.closest('.extintor-card').remove();
            updateExtintoresEmptyState(container);
            renumberExtintores(container);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveRecord(container);
        showTable();
    });

    showTable();
}

function getExtintorCardHTML(index, data = {}) {
    const elementosHtml = ELEMENTOS_LISTA.map(elem => {
        const selectedValue = data[elem.key] || '';
        const optionsHtml = ELEMENTOS_ESTADOS.map(est => `<option value="${est}" ${selectedValue === est ? 'selected' : ''}>${est}</option>`).join('');
        
        return `
        <div class="form-group">
            <label class="form-label" style="font-size:var(--text-xs); color:var(--text-secondary); margin-bottom:4px;">${elem.label}</label>
            <select class="form-select" data-field="${elem.key}" required style="padding:4px 8px; font-size:var(--text-sm); height:auto;">
                <option value="" disabled ${!selectedValue ? 'selected' : ''}>Selec...</option>
                ${optionsHtml}
            </select>
        </div>
        `;
    }).join('');

    return `
    <div class="extintor-card card" data-index="${index}" style="position:relative; border-left: 4px solid var(--info); padding-bottom:var(--space-4);">
        <button type="button" class="btn-remove-extintor" style="position:absolute; top:var(--space-3); right:var(--space-3); background:none; border:none; color:var(--danger); cursor:pointer; padding:4px; border-radius:var(--radius-sm);">
            <i data-lucide="trash-2" style="width:18px;height:18px;"></i>
        </button>
        
        <h4 class="extintor-title" style="margin-top:0; margin-bottom:var(--space-4); color:var(--text-primary); font-size:var(--text-md);">Extintor #${index + 1}</h4>
        
        <div class="form-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:var(--space-3); margin-bottom:var(--space-4);">
            <div class="form-group">
                <label class="form-label">Código / #</label>
                <select class="form-select selector-codigo-extintor" data-field="codigo" required>
                    <option value="" disabled ${!data.codigo ? 'selected' : ''}>Seleccione un extintor...</option>
                    ${window._inventarioExtintores ? window._inventarioExtintores.map(ext => `<option value="${ext.numero_serie}" ${data.codigo === ext.numero_serie ? 'selected' : ''}>${ext.numero_serie} (${ext.tipo})</option>`).join('') : ''}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Tipo</label>
                <select class="form-select extintor-param-codigo" data-field="tipo" required>
                    <option value="" disabled ${!data.tipo ? 'selected' : ''}>Seleccione...</option>
                    ${window._paramExtintorCodigos ? window._paramExtintorCodigos.map(p => `<option value="${p.valor}" ${data.tipo === p.valor ? 'selected' : ''}>${p.valor}</option>`).join('') : ''}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Capacidad</label>
                <input type="text" class="form-input" data-field="capacidad" value="${data.capacidad || ''}" required placeholder="Ej: 10 lbs">
            </div>
            <div class="form-group">
                <label class="form-label">Ubicación</label>
                <select class="form-select extintor-param-ubicacion" data-field="ubicacion" required>
                    <option value="" disabled ${!data.ubicacion ? 'selected' : ''}>Seleccione...</option>
                    ${window._paramExtintorUbicaciones ? window._paramExtintorUbicaciones.map(p => `<option value="${p.valor}" ${data.ubicacion === p.valor ? 'selected' : ''}>${p.valor}</option>`).join('') : ''}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Fecha de Recarga</label>
                <input type="date" class="form-input" data-field="fecha_recarga" value="${data.fecha_recarga || ''}" required>
            </div>
        </div>
        
        <div style="border-top:1px solid var(--border-light); padding-top:var(--space-3); margin-top:var(--space-3);">
            <h5 style="margin-top:0; margin-bottom:var(--space-3); color:var(--text-secondary); font-size:var(--text-sm); text-transform:uppercase; letter-spacing:0.5px;">Estado de Elementos</h5>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:var(--space-2);">
                ${elementosHtml}
            </div>
        </div>
    </div>
    `;
}

function addExtintorCard(container, data = {}) {
    const extContainer = container.querySelector('#extintores-container');
    const index = extContainer.children.length;
    
    // Insert HTML
    extContainer.insertAdjacentHTML('beforeend', getExtintorCardHTML(index, data));
    const newCard = extContainer.lastElementChild;
    
    // Add logic for auto-complete from inventory
    const selectorCodigo = newCard.querySelector('.selector-codigo-extintor');
    if (selectorCodigo) {
        const handleAutocomplete = () => {
            const selectedSerie = selectorCodigo.value;
            const extintor = window._inventarioExtintores?.find(e => e.numero_serie === selectedSerie);
            
            const fieldTipo = newCard.querySelector('[data-field="tipo"]');
            const fieldCapacidad = newCard.querySelector('[data-field="capacidad"]');
            const fieldUbicacion = newCard.querySelector('[data-field="ubicacion"]');
            const fieldFechaRecarga = newCard.querySelector('[data-field="fecha_recarga"]');
            
            if (extintor) {
                if(fieldTipo) { fieldTipo.value = extintor.tipo; fieldTipo.disabled = true; fieldTipo.style.backgroundColor = 'var(--bg-body)'; }
                if(fieldCapacidad) { fieldCapacidad.value = extintor.capacidad; fieldCapacidad.disabled = true; fieldCapacidad.style.backgroundColor = 'var(--bg-body)'; }
                if(fieldUbicacion) { fieldUbicacion.value = extintor.ubicacion; fieldUbicacion.disabled = true; fieldUbicacion.style.backgroundColor = 'var(--bg-body)'; }
                if(fieldFechaRecarga) { fieldFechaRecarga.value = extintor.ultima_recarga; fieldFechaRecarga.disabled = true; fieldFechaRecarga.style.backgroundColor = 'var(--bg-body)'; }
            } else {
                if(fieldTipo) { fieldTipo.disabled = false; fieldTipo.style.backgroundColor = ''; }
                if(fieldCapacidad) { fieldCapacidad.disabled = false; fieldCapacidad.style.backgroundColor = ''; }
                if(fieldUbicacion) { fieldUbicacion.disabled = false; fieldUbicacion.style.backgroundColor = ''; }
                if(fieldFechaRecarga) { fieldFechaRecarga.disabled = false; fieldFechaRecarga.style.backgroundColor = ''; }
            }
        };

        selectorCodigo.addEventListener('change', handleAutocomplete);
        
        // Trigger immediately if we loaded existing data
        if (data.codigo) {
            handleAutocomplete();
        }
    }
    
    // Re-init icons
    if (window.lucide) window.lucide.createIcons({ nodes: [newCard] });
    
    updateExtintoresEmptyState(container);
}

function renumberExtintores(container) {
    const cards = container.querySelectorAll('.extintor-card');
    cards.forEach((card, i) => {
        card.dataset.index = i;
        const title = card.querySelector('.extintor-title');
        if (title) title.innerText = `Extintor #${i + 1}`;
    });
}

function updateExtintoresEmptyState(container) {
    const extContainer = container.querySelector('#extintores-container');
    const emptyState = container.querySelector('#extintores-empty-state');
    if (extContainer.children.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

function resetForm(container) {
    currentRecordId = null;
    const form = container.querySelector('#registro-form');
    form.reset();
    
    // Default date
    container.querySelector('#input-fecha').value = new Date().toISOString().slice(0, 10);
    
    // Clear extintores
    container.querySelector('#extintores-container').innerHTML = '';
    updateExtintoresEmptyState(container);
    
    container.querySelector('#btn-guardar').innerHTML = '<i data-lucide="save"></i> Guardar Inspección';
    if (window.lucide) window.lucide.createIcons();
}

function getFormData(container) {
    const cabecera = {
        lugar_trabajo: container.querySelector('#input-lugar_trabajo').value,
        fecha: container.querySelector('#input-fecha').value,
        inspector_nombre: container.querySelector('#input-inspector_nombre').value,
        inspector_cargo: container.querySelector('#input-inspector_cargo').value,
        observaciones_generales: container.querySelector('#input-observaciones_generales').value || null
    };

    const detalles = [];
    const cards = container.querySelectorAll('.extintor-card');
    cards.forEach(card => {
        const item = {};
        // Find inputs and selects
        card.querySelectorAll('input[data-field], select[data-field]').forEach(el => {
            item[el.dataset.field] = el.value || null;
        });
        detalles.push(item);
    });

    return { cabecera, detalles };
}

async function saveRecord(container) {
    const btn = container.querySelector('#btn-guardar');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px"></div> Guardando...';
    btn.disabled = true;

    try {
        const { cabecera, detalles } = getFormData(container);
        
        let res;
        if (currentRecordId) {
            res = await updateInspeccion(currentRecordId, cabecera, detalles);
        } else {
            res = await createInspeccion(cabecera, detalles);
        }

        if (res.error) throw res.error;

        showToast(currentRecordId ? 'Inspección actualizada' : 'Inspección guardada', 'success');
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

    if (forceFetch || !cachedInspecciones) {
        const res = await getAllInspecciones();
        if (res.error) {
            tableContainer.innerHTML = `<p style="color:var(--color-danger)">Error: ${res.error.message}</p>`;
            return;
        }
        cachedInspecciones = res.data || [];
    }

    const searchInput = container.querySelector('#table-search-input');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filterByQuery = (records) => {
        if (!query) return records;
        return records.filter(r => {
            const str = `
                ${r.lugar_trabajo || ''} 
                ${r.fecha || ''} 
                ${r.inspector_nombre || ''}
            `.toLowerCase();
            return str.includes(query);
        });
    };

    const displayRows = filterByQuery(cachedInspecciones);

    if (dataTableInstance) {
        dataTableInstance.destroy();
        dataTableInstance = null;
    }

    const columns = [
        { key: 'fecha', label: 'FECHA' },
        { key: 'lugar_trabajo', label: 'LUGAR DE TRABAJO' },
        { key: 'inspector_nombre', label: 'INSPECTOR' },
        { 
            key: 'total_extintores', 
            label: 'EXTINTORES',
            format: (v) => `<span style="background:var(--info-bg); color:var(--info); padding:4px 8px; border-radius:12px; font-weight:bold; font-size:12px;">${v || 0}</span>`
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
            const confirmed = await showConfirmModal('Eliminar', `¿Seguro que desea eliminar la inspección del ${record.fecha}?`);
            if (confirmed) {
                const delRes = await deleteInspeccion(record.id);
                if (delRes.error) showToast('Error al eliminar', 'error');
                else {
                    showToast('Inspección eliminada', 'success');
                    await refreshTable(container, true);
                }
            }
        },
        emptyMessage: 'No hay inspecciones guardadas.'
    });
}

async function openRecordForEdit(container, id, isReadOnly) {
    const res = await getInspeccionById(id);
    if (res.error || !res.data) {
        showToast('Error al cargar la inspección', 'error');
        return;
    }
    
    loadRecordIntoForm(container, res.data);
    setReadOnly(container, isReadOnly);
    container._showForm();
}

function setReadOnly(container, isReadOnly) {
    const fieldset = container.querySelector('#form-fieldset');
    const actionsContainer = container.querySelector('#form-actions-container');
    const btnAddExtintor = container.querySelector('#btn-add-extintor');
    
    if (fieldset) {
        fieldset.disabled = isReadOnly;
    }
    
    if (actionsContainer) {
        actionsContainer.style.display = isReadOnly ? 'none' : 'flex';
    }

    if (btnAddExtintor) {
        btnAddExtintor.style.display = isReadOnly ? 'none' : 'inline-flex';
    }
    
    // Hide all remove buttons if readonly
    const removeBtns = container.querySelectorAll('.btn-remove-extintor');
    removeBtns.forEach(btn => {
        btn.style.display = isReadOnly ? 'none' : 'block';
    });
}

function loadRecordIntoForm(container, record) {
    currentRecordId = record.id;
    
    // Set Header
    container.querySelector('#input-lugar_trabajo').value = record.lugar_trabajo || '';
    container.querySelector('#input-fecha').value = record.fecha || '';
    container.querySelector('#input-inspector_nombre').value = record.inspector_nombre || '';
    container.querySelector('#input-inspector_cargo').value = record.inspector_cargo || '';
    container.querySelector('#input-observaciones_generales').value = record.observaciones_generales || '';
    
    // Clear existing details
    container.querySelector('#extintores-container').innerHTML = '';
    
    // Add Details
    if (record.extintores_detalle && record.extintores_detalle.length > 0) {
        record.extintores_detalle.forEach(det => {
            addExtintorCard(container, det);
        });
    } else {
        updateExtintoresEmptyState(container);
    }
    
    container.querySelector('#btn-guardar').innerHTML = '<i data-lucide="edit"></i> Actualizar Inspección';
    if (window.lucide) window.lucide.createIcons();
    
    // Scroll up
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
