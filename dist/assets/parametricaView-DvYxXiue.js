import{i as e,n as t,r as n,t as r}from"./parametricaService-CrC5YH-P.js";import{r as i,t as a}from"./modal-DKrJSUEn.js";var o=[{id:`ciudad`,code:`PAR-001`,name:`Centros de trabajo (Plantas)`},{id:`empresa`,code:`PAR-002`,name:`Empresa`}],s={currentCategory:null,values:[],isModalOpen:!1,editingItem:null};async function c(c){c.innerHTML=`
    <div class="parametricas-container">
      
      <!-- LEVEL 1: Master View (Categories) -->
      <div id="master-view" class="master-view">
        <div class="master-header-section">
          <h1 class="page-title-large">Configuración de Paramétricas</h1>
          <p class="page-subtitle-large">Gestión dinámica de las opciones para los selectores del sistema.</p>
        </div>

        <div class="table-toolbar">
          <div class="search-wrapper">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" class="search-input" id="search-categories" placeholder="Buscar categoría...">
          </div>
        </div>
        
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 25%">Código</th>
                <th style="width: 60%">Nombre de la Categoría</th>
                <th style="width: 15%; text-align: right">Acciones</th>
              </tr>
            </thead>
            <tbody id="categories-tbody">
              <!-- Categories injected here -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- LEVEL 2: Detail View (Values) -->
      <div id="detail-view" class="detail-view">
        <div class="detail-header-section">
          <button class="btn-back" id="btn-back">
            <i data-lucide="arrow-left"></i> Volver a Categorías
          </button>
          
          <div class="detail-title-row">
            <h1 class="page-title-large">Editar parámetro: <span id="detail-category-name" class="text-accent-glow"></span></h1>
            <p class="page-subtitle-large">Administre las opciones internas disponibles para este selector.</p>
          </div>
        </div>

        <div class="table-toolbar">
          <div class="search-wrapper">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" class="search-input" id="search-values" placeholder="Buscar por nombre...">
          </div>
          <button class="btn btn-primary btn-glow" id="btn-new-value">
            <i data-lucide="plus"></i> Nuevo
          </button>
        </div>

        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 15%">#</th>
                <th style="width: 65%">Nombre</th>
                <th style="width: 20%; text-align: right">Acciones</th>
              </tr>
            </thead>
            <tbody id="values-tbody">
              <!-- Values injected here -->
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- LEVEL 3: Modal (Create/Edit) -->
    <div class="modal-overlay" id="param-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">Nuevo parámetro</h3>
          <button class="modal-close" id="btn-close-modal">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="form-label" style="margin-top:0">Ingrese el valor del parámetro.</p>
          <form id="param-form">
            <input type="hidden" id="input-id">
            <div class="form-group">
              <label class="form-label">Nombre del parámetro*</label>
              <input type="text" class="form-input" id="input-name" required placeholder="Ej: Planta Barranquilla">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-modal">Cancelar</button>
          <button class="btn btn-primary btn-glow" id="btn-save-modal">Guardar</button>
        </div>
      </div>
    </div>
  `,window.lucide&&window.lucide.createIcons();let l=c.querySelector(`#master-view`),u=c.querySelector(`#detail-view`),d=c.querySelector(`#categories-tbody`),f=c.querySelector(`#values-tbody`),p=c.querySelector(`#detail-category-name`),m=c.querySelector(`#btn-back`),h=c.querySelector(`#search-categories`),g=c.querySelector(`#search-values`),_=c.querySelector(`#param-modal`),v=c.querySelector(`#modal-title`),y=c.querySelector(`#btn-close-modal`),b=c.querySelector(`#btn-cancel-modal`),x=c.querySelector(`#btn-save-modal`),S=c.querySelector(`#param-form`),C=c.querySelector(`#input-id`),w=c.querySelector(`#input-name`);function T(e=``){let t=e.toLowerCase().trim(),n=o.filter(e=>e.code.toLowerCase().includes(t)||e.name.toLowerCase().includes(t));if(n.length===0){d.innerHTML=`
        <tr>
          <td colspan="3">
            <div class="empty-state">
              <i data-lucide="info" class="empty-state-icon"></i>
              <span>No se encontraron categorías que coincidan con la búsqueda.</span>
            </div>
          </td>
        </tr>
      `,window.lucide&&window.lucide.createIcons({nodes:[d]});return}d.innerHTML=n.map(e=>`
      <tr>
        <td><span class="td-code">${e.code}</span></td>
        <td style="font-weight: 500; color: var(--text-primary);">${e.name}</td>
        <td style="text-align: right;">
          <div class="actions-wrapper">
            <button class="btn-action edit" data-id="${e.id}" title="Editar valores de ${e.name}">
              <i data-lucide="pencil" style="width:16px;height:16px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join(``),d.querySelectorAll(`.btn-action.edit`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.id;D(t)})}),window.lucide&&window.lucide.createIcons({nodes:[d]})}function E(e=``){let n=e.toLowerCase().trim(),r=s.values.filter(e=>e.valor.toLowerCase().includes(n));if(r.length===0){f.innerHTML=`
        <tr>
          <td colspan="3">
            <div class="empty-state">
              <i data-lucide="alert-circle" class="empty-state-icon"></i>
              <span>No se encontraron parámetros. Haz clic en "Nuevo" para crear uno.</span>
            </div>
          </td>
        </tr>
      `,window.lucide&&window.lucide.createIcons({nodes:[f]});return}f.innerHTML=r.map((e,t)=>`
      <tr>
        <td><span class="td-code">${t+1}</span></td>
        <td style="font-weight: 500; color: var(--text-primary);">${e.valor}</td>
        <td style="text-align: right;">
          <div class="actions-wrapper">
            <button class="btn-action edit" data-id="${e.id}" title="Editar">
              <i data-lucide="pencil" style="width:16px;height:16px;"></i>
            </button>
            <button class="btn-action delete" data-id="${e.id}" title="Eliminar">
              <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join(``),f.querySelectorAll(`.btn-action.edit`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.id;k(s.values.find(e=>e.id===t))})}),f.querySelectorAll(`.btn-action.delete`).forEach(e=>{e.addEventListener(`click`,async()=>{let n=e.dataset.id;if(await a(`Eliminar Parámetro`,`¿Estás seguro de eliminar este parámetro? Esta acción no se puede deshacer.`)){let{error:e}=await t(n);if(e){i(`Error al eliminar: ${e.message}`,`error`);return}s.values=s.values.filter(e=>e.id!==n),E(g.value),i(`Eliminado correctamente`,`success`)}})}),window.lucide&&window.lucide.createIcons({nodes:[f]})}async function D(e){let t=o.find(t=>t.id===e);s.currentCategory=t,g.value=``,p.textContent=t.name,l.classList.add(`hidden`),u.classList.add(`active`),f.innerHTML=`
      <tr>
        <td colspan="3" style="text-align:center;padding:3rem 0;">
          <div class="spinner" style="margin:0 auto 12px auto;"></div>
          <span style="color:var(--text-secondary);font-size:var(--text-sm);">Cargando parámetros...</span>
        </td>
      </tr>
    `,window.lucide&&window.lucide.createIcons({nodes:[f]});let{data:r,error:i}=await n(e);if(i){f.innerHTML=`
        <tr>
          <td colspan="3">
            <div class="empty-state">
              <i data-lucide="alert-triangle" class="empty-state-icon"></i>
              <span style="color:var(--danger);">Error al cargar: ${i.message}</span>
            </div>
          </td>
        </tr>
      `,window.lucide&&window.lucide.createIcons({nodes:[f]});return}s.values=r||[],E()}function O(){s.currentCategory=null,s.values=[],u.classList.remove(`active`),l.classList.remove(`hidden`)}function k(e=null){s.editingItem=e,s.isModalOpen=!0,e?(v.textContent=`Editar parámetro`,C.value=e.id,w.value=e.valor):(v.textContent=`Nuevo parámetro`,S.reset(),C.value=``),_.classList.add(`active`),w.focus()}function A(){s.isModalOpen=!1,s.editingItem=null,_.classList.remove(`active`)}async function j(){if(!S.checkValidity()){S.reportValidity();return}let t=w.value.trim();if(!t){i(`El nombre del parámetro no puede estar vacío`,`error`);return}x.disabled=!0,x.innerHTML=`<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px"></div> Guardando...`;try{if(s.editingItem){let{data:n,error:r}=await e(s.editingItem.id,t);if(r){i(`Error al actualizar: ${r.message}`,`error`);return}let a=s.values.findIndex(e=>e.id===s.editingItem.id);a!==-1&&n&&(s.values[a]=n),i(`Actualizado correctamente`,`success`)}else{let{data:e,error:n}=await r(s.currentCategory.id,t);if(n){i(`Error al guardar: ${n.message}`,`error`);return}e&&s.values.push(e),i(`Guardado correctamente`,`success`)}E(g.value),A()}catch(e){i(`Error inesperado: ${e.message}`,`error`)}finally{x.disabled=!1,x.innerHTML=`Guardar`}}h.addEventListener(`input`,()=>{T(h.value)}),g.addEventListener(`input`,()=>{E(g.value)}),m.addEventListener(`click`,O),c.querySelector(`#btn-new-value`).addEventListener(`click`,()=>{k()}),y.addEventListener(`click`,A),b.addEventListener(`click`,A),x.addEventListener(`click`,e=>{e.preventDefault(),j()}),_.addEventListener(`click`,e=>{e.target===_&&A()}),T()}export{c as renderParametricas};