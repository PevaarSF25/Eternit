import { getParametros, createParametro, deleteParametro } from '../services/parametricaService.js';
import { showToast } from '../components/toast.js';
import { showConfirmModal } from '../components/modal.js';

let currentState = {
  ciudad: [],
  contratista: [],
  mes: [],
  anio: [],
  empresa: []
};

export async function renderParametricas(container) {
  container.innerHTML = `
    <div class="parametricas-container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title"><i data-lucide="settings"></i> Configuración de Parámetros</h2>
        </div>
        
        <div class="param-tabs">
          <button class="param-tab active" data-tab="ciudad">Ciudad (Planta)</button>
          <button class="param-tab" data-tab="contratista">Tipo de Contratista</button>
          <button class="param-tab" data-tab="mes">Mes</button>
          <button class="param-tab" data-tab="anio">Año</button>
          <button class="param-tab" data-tab="empresa">Empresa</button>
        </div>

        <!-- Tab Content: Ciudad -->
        <div class="param-content active" id="tab-ciudad">
          <p class="form-label" style="margin-bottom: var(--space-4);">Administre las ciudades o plantas disponibles para el registro.</p>
          <div class="param-chips" id="chips-ciudad">
            <div class="spinner"></div>
          </div>
          <form class="param-add" id="form-add-ciudad">
            <div class="form-group">
              <input type="text" class="form-input" id="input-new-ciudad" placeholder="Ej. Barranquilla, Bogotá..." required>
            </div>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="plus"></i> Agregar
            </button>
          </form>
        </div>

        <!-- Tab Content: Contratista -->
        <div class="param-content" id="tab-contratista">
          <p class="form-label" style="margin-bottom: var(--space-4);">Administre los tipos de personal (ej. Directo, Contratista).</p>
          <div class="param-chips" id="chips-contratista">
            <div class="spinner"></div>
          </div>
          <form class="param-add" id="form-add-contratista">
            <div class="form-group">
              <input type="text" class="form-input" id="input-new-contratista" placeholder="Ej. Temporal, Subcontrato..." required>
            </div>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="plus"></i> Agregar
            </button>
          </form>
        </div>

        <!-- Tab Content: Mes -->
        <div class="param-content" id="tab-mes">
          <p class="form-label" style="margin-bottom: var(--space-4);">Administre los meses disponibles (ej. Enero, Febrero).</p>
          <div class="param-chips" id="chips-mes">
            <div class="spinner"></div>
          </div>
          <form class="param-add" id="form-add-mes">
            <div class="form-group">
              <input type="text" class="form-input" id="input-new-mes" placeholder="Ej. Enero..." required>
            </div>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="plus"></i> Agregar
            </button>
          </form>
        </div>

        <!-- Tab Content: Año -->
        <div class="param-content" id="tab-anio">
          <p class="form-label" style="margin-bottom: var(--space-4);">Administre los años disponibles (ej. 2026).</p>
          <div class="param-chips" id="chips-anio">
            <div class="spinner"></div>
          </div>
          <form class="param-add" id="form-add-anio">
            <div class="form-group">
              <input type="number" class="form-input" id="input-new-anio" placeholder="Ej. 2026" required>
            </div>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="plus"></i> Agregar
            </button>
          </form>
        </div>

        <!-- Tab Content: Empresa -->
        <div class="param-content" id="tab-empresa">
          <p class="form-label" style="margin-bottom: var(--space-4);">Administre las empresas contratistas disponibles para el registro.</p>
          <div class="param-chips" id="chips-empresa">
            <div class="spinner"></div>
          </div>
          <form class="param-add" id="form-add-empresa">
            <div class="form-group">
              <input type="text" class="form-input" id="input-new-empresa" placeholder="Ej. Constructora ABC, Seguridad XYZ..." required>
            </div>
            <button type="submit" class="btn btn-primary">
              <i data-lucide="plus"></i> Agregar
            </button>
          </form>
        </div>
      </div>

      <!-- Constantes -->
      <div class="constantes-info">
        <h4><i data-lucide="info"></i> Constantes del Sistema</h4>
        <p>Estos valores son utilizados en las fórmulas de cálculo interno y están definidos por el estándar.</p>
        <ul class="constante-list">
          <li class="constante-item">
            <span class="constante-name">Constante Elementia (HHT)</span>
            <span class="constante-val">200,000</span>
          </li>
          <li class="constante-item">
            <span class="constante-name">Constante Normatividad Colombia</span>
            <span class="constante-val">100</span>
          </li>
        </ul>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup Tabs
  const tabs = container.querySelectorAll('.param-tab');
  const contents = container.querySelectorAll('.param-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      // Add active to clicked
      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      container.querySelector(`#${targetId}`).classList.add('active');
    });
  });

  // Load Initial Data
  await loadData();

  // Setup Forms
  const formCiudad = container.querySelector('#form-add-ciudad');
  const formContratista = container.querySelector('#form-add-contratista');
  const formMes = container.querySelector('#form-add-mes');
  const formAnio = container.querySelector('#form-add-anio');
  const formEmpresa = container.querySelector('#form-add-empresa');

  formCiudad.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = container.querySelector('#input-new-ciudad');
    await handleAdd('ciudad', input.value.trim(), input);
  });

  formContratista.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = container.querySelector('#input-new-contratista');
    await handleAdd('contratista', input.value.trim(), input);
  });

  formMes.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = container.querySelector('#input-new-mes');
    await handleAdd('mes', input.value.trim(), input);
  });

  formAnio.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = container.querySelector('#input-new-anio');
    await handleAdd('anio', input.value.trim(), input);
  });

  formEmpresa.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = container.querySelector('#input-new-empresa');
    await handleAdd('empresa', input.value.trim(), input);
  });

  async function loadData() {
    try {
      const [ciudades, contratistas, meses, anios, empresas] = await Promise.all([
        getParametros('ciudad'),
        getParametros('contratista'),
        getParametros('mes'),
        getParametros('anio'),
        getParametros('empresa')
      ]);
      
      currentState.ciudad = ciudades.data || [];
      currentState.contratista = contratistas.data || [];
      currentState.mes = meses.data || [];
      currentState.anio = anios.data || [];
      currentState.empresa = empresas.data || [];

      renderChips('ciudad');
      renderChips('contratista');
      renderChips('mes');
      renderChips('anio');
      renderChips('empresa');
    } catch (error) {
      showToast('Error cargando parámetros', 'error');
    }
  }

  function renderChips(categoria) {
    const chipsContainer = container.querySelector(`#chips-${categoria}`);
    const data = currentState[categoria];

    if (data.length === 0) {
      chipsContainer.innerHTML = `<div class="param-empty">No hay parámetros configurados</div>`;
      return;
    }

    chipsContainer.innerHTML = data.map(item => `
      <div class="chip">
        ${item.valor}
        <button type="button" data-id="${item.id}" data-cat="${categoria}" class="btn-delete-chip" title="Eliminar">
          <i data-lucide="x" style="width:14px;height:14px;"></i>
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    // Attach delete events
    chipsContainer.querySelectorAll('.btn-delete-chip').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const cat = btn.dataset.cat;
        const item = currentState[cat].find(x => x.id === id);
        
        const confirmed = await showConfirmModal(
          'Eliminar Parámetro', 
          `¿Está seguro de eliminar "${item.valor}"? Esto no afectará los registros históricos.`
        );

        if (confirmed) {
          const res = await deleteParametro(id);
          if (res.error) {
            showToast('Error al eliminar', 'error');
          } else {
            showToast('Eliminado correctamente', 'success');
            currentState[cat] = currentState[cat].filter(x => x.id !== id);
            renderChips(cat);
          }
        }
      });
    });
  }

  async function handleAdd(categoria, valor, inputElement) {
    if (!valor) return;

    // Check duplicate locally
    if (currentState[categoria].some(x => x.valor.toLowerCase() === valor.toLowerCase())) {
      showToast('Este valor ya existe', 'warning');
      return;
    }

    const submitBtn = inputElement.closest('form').querySelector('button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div>';
    submitBtn.disabled = true;

    const res = await createParametro(categoria, valor);
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    if (res.error) {
      showToast(res.error.message || 'Error al guardar', 'error');
    } else {
      showToast('Guardado correctamente', 'success');
      inputElement.value = '';
      currentState[categoria].push(res.data[0]); // Supabase returns array
      renderChips(categoria);
    }
  }
}
