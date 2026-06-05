import{r as e}from"./parametricaService-CrC5YH-P.js";import{a as t,c as n,d as r,f as i,i as a,l as o,m as s,n as c,o as l,p as u,r as d,u as f}from"./formatter-BfxvljpV.js";import{n as p,r as m,t as h}from"./modal-DKrJSUEn.js";function g({containerId:e,columns:t,data:n=[],onView:r,onEdit:i,onDelete:a,footerRow:o=null,emptyMessage:s=`No hay registros disponibles`}){let c=document.getElementById(e);if(!c)return console.error(`DataTable: container #${e} not found`),{update(){},destroy(){}};let l=[...n],u=null,d=!0;function f(e){u===e?d=!d:(u=e,d=!0),l.sort((t,n)=>{let r=t[e]??``,i=n[e]??``;if(typeof r==`number`&&typeof i==`number`)return d?r-i:i-r;let a=String(r).toLowerCase(),o=String(i).toLowerCase();return d?a.localeCompare(o):o.localeCompare(a)}),m()}function p(e){return u===e?d?`<i data-lucide="arrow-up" style="width:14px;height:14px;color:#00b4d8;"></i>`:`<i data-lucide="arrow-down" style="width:14px;height:14px;color:#00b4d8;"></i>`:`<i data-lucide="arrow-up-down" style="width:14px;height:14px;opacity:0.3;"></i>`}function m(){if(l.length===0){c.innerHTML=`
                <div class="datatable-empty" style="
                    text-align: center;
                    padding: 48px 24px;
                    color: #5a6a7a;
                    font-size: 14px;
                ">
                    <i data-lucide="inbox" style="width:48px;height:48px;margin-bottom:16px;opacity:0.4;"></i>
                    <p style="margin:0;">${s}</p>
                </div>
            `,typeof lucide<`u`&&lucide.createIcons({nodes:[c]});return}let e=t.map(e=>`
            <th style="
                padding: 8px 10px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                color: var(--text-secondary);
                border-bottom: 1px solid var(--border-default);
                cursor: pointer;
                user-select: none;
                white-space: nowrap;
                ${e.width?`width:${e.width};`:``}
            " data-sort-key="${e.key}">
                <span style="display:flex;align-items:center;gap:4px;">
                    ${e.label}
                    ${p(e.key)}
                </span>
            </th>
        `).join(``),n=r||i||a?`
            <th style="
                padding: 8px 10px;
                text-align: center;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                color: var(--text-secondary);
                border-bottom: 1px solid var(--border-default);
                width: 100px;
            ">Acciones</th>
        `:``,u=l.map((e,n)=>`<tr style="transition: background 200ms;" onmouseenter="this.style.background='var(--bg-hover)'" onmouseleave="this.style.background='transparent'">${t.map(t=>{let n=e[t.key];return t.format&&n!=null&&(n=t.format(n,e)),`<td style="
                    padding: 8px 10px;
                    font-size: 12px;
                    color: var(--text-primary);
                    border-bottom: 1px solid var(--border-light);
                    white-space: nowrap;
                ">${n??`—`}</td>`}).join(``)}${r||i||a?`
                <td style="
                    padding: 8px 10px;
                    text-align: center;
                    border-bottom: 1px solid var(--border-light);
                ">
                    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
                        ${r?`<button class="dt-view-btn" data-row-index="${n}" title="Ver todos los datos" style="
                            background: var(--accent-bg);
                            border: 1px solid var(--border-focus);
                            border-radius: 6px;
                            padding: 6px;
                            cursor: pointer;
                            color: var(--accent);
                            transition: all 200ms;
                            display: flex;
                            align-items: center;
                        "><i data-lucide="eye" style="width:14px;height:14px;"></i></button>`:``}
                        ${i?`<button class="dt-edit-btn" data-row-index="${n}" title="Editar" style="
                            background: rgba(0,180,216,0.1);
                            border: 1px solid rgba(0,180,216,0.2);
                            border-radius: 6px;
                            padding: 6px;
                            cursor: pointer;
                            color: #00b4d8;
                            transition: all 200ms;
                            display: flex;
                            align-items: center;
                        "><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>`:``}
                        ${a?`<button class="dt-delete-btn" data-row-index="${n}" title="Eliminar" style="
                            background: var(--danger-bg);
                            border: 1px solid rgba(239,68,68,0.2);
                            border-radius: 6px;
                            padding: 6px;
                            cursor: pointer;
                            color: var(--danger);
                            transition: all 200ms;
                            display: flex;
                            align-items: center;
                        "><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>`:``}
                    </div>
                </td>
            `:``}</tr>`).join(``),d=``;o&&l.length>0&&(d=`
                <tfoot style="background: var(--accent-bg); border-top: 2px solid var(--accent);">
                    <tr>${t.map(e=>{let t=o[e.key];return e.format&&t!=null&&(t=e.format(t,o)),`<td style="
                    padding: 8px 10px;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-size: 12px;
                    white-space: nowrap;
                ">${t??`—`}</td>`}).join(``)}${r||i||a?`<td></td>`:``}</tr>
                </tfoot>
            `),c.innerHTML=`
            <div style="overflow-x:auto;border-radius:12px;border:1px solid var(--border-default);">
                <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
                    <thead><tr>${e}${n}</tr></thead>
                    <tbody>${u}</tbody>
                    ${d}
                </table>
            </div>
        `,c.querySelectorAll(`th[data-sort-key]`).forEach(e=>{e.addEventListener(`click`,()=>f(e.dataset.sortKey))}),c.addEventListener(`click`,e=>{let t=e.target.closest(`.dt-view-btn`);if(t&&r){let e=parseInt(t.dataset.rowIndex,10);r(l[e]);return}let n=e.target.closest(`.dt-edit-btn`);if(n&&i){let e=parseInt(n.dataset.rowIndex,10);i(l[e]);return}let o=e.target.closest(`.dt-delete-btn`);if(o&&a){let e=parseInt(o.dataset.rowIndex,10);a(l[e])}}),typeof lucide<`u`&&lucide.createIcons({nodes:[c]})}return m(),{update(e,t=null){l=[...e],t!==null&&(o=t),u&&l.sort((e,t)=>{let n=e[u]??``,r=t[u]??``;return typeof n==`number`&&typeof r==`number`?d?n-r:r-n:d?String(n).localeCompare(String(r)):String(r).localeCompare(String(n))}),m()},destroy(){c.innerHTML=``,l=[]}}}var _=[`D`,`L`,`M`,`M`,`J`,`V`,`S`],v=[`Enero`,`Febrero`,`Marzo`,`Abril`,`Mayo`,`Junio`,`Julio`,`Agosto`,`Septiembre`,`Octubre`,`Noviembre`,`Diciembre`];function y(e,t){e&&(e.readOnly=!0,e.style.cursor=`pointer`,e.addEventListener(`click`,n=>{let r=e.closest(`fieldset`);r&&r.disabled||b(e,t)}))}function b(e,t){let n=new Date;if(e.value){let[t,r]=e.value.split(`-`);t&&r&&(n=new Date(parseInt(t,10),parseInt(r,10)-1,1))}let r=n.getFullYear(),i=n.getMonth(),a=n.getDate(),o=r,s=i,c=`calendar`,l=document.createElement(`div`);l.className=`datepicker-overlay`,Object.assign(l.style,{position:`fixed`,inset:`0`,zIndex:`11000`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`rgba(15, 23, 42, 0.4)`,backdropFilter:`blur(4px)`,fontFamily:`'Inter', sans-serif`});let u=document.createElement(`div`);u.className=`datepicker-dialog`,Object.assign(u.style,{background:`#ffffff`,borderRadius:`16px`,width:`320px`,boxShadow:`var(--shadow-xl)`,display:`flex`,flexDirection:`column`,overflow:`hidden`,animation:`modalSlideIn 250ms ease-out`}),l.appendChild(u),document.body.appendChild(l);function d(){u.innerHTML=``;let n=document.createElement(`div`);Object.assign(n.style,{background:`var(--accent, #ef4444)`,padding:`20px 24px`,color:`#ffffff`,display:`flex`,flexDirection:`column`,gap:`4px`,position:`relative`});let f=document.createElement(`span`);f.innerText=`SELECCIONAR FECHA`,Object.assign(f.style,{fontSize:`10px`,fontWeight:`700`,letterSpacing:`0.8px`,opacity:`0.8`});let p=new Date(r,i,a),m=p.toLocaleDateString(`es-ES`,{weekday:`short`}),h=p.toLocaleDateString(`es-ES`,{month:`short`}),g=document.createElement(`h2`);g.innerText=`${m.charAt(0).toUpperCase()+m.slice(1)}, ${a} de ${h}`,Object.assign(g.style,{margin:`0`,fontSize:`28px`,fontWeight:`700`,color:`#ffffff`,lineHeight:`1.2`}),n.appendChild(f),n.appendChild(g),u.appendChild(n);let y=document.createElement(`div`);if(Object.assign(y.style,{padding:`16px`,background:`#ffffff`,display:`flex`,flexDirection:`column`,flex:`1`}),c===`calendar`){let e=document.createElement(`div`);Object.assign(e.style,{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`16px`});let t=document.createElement(`button`);t.innerHTML=`${v[s]} ${o} <i data-lucide="chevron-down" style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-left:4px"></i>`,Object.assign(t.style,{fontSize:`14px`,fontWeight:`600`,color:`var(--text-primary)`,background:`none`,border:`none`,cursor:`pointer`,display:`flex`,alignItems:`center`}),t.addEventListener(`click`,()=>{c=`years`,d()});let n=document.createElement(`div`);Object.assign(n.style,{display:`flex`,gap:`8px`});let l=document.createElement(`button`);l.innerHTML=`<i data-lucide="chevron-left" style="width:20px;height:20px;"></i>`,Object.assign(l.style,{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-secondary)`}),l.addEventListener(`click`,()=>{s===0?(s=11,o--):s--,d()});let u=document.createElement(`button`);u.innerHTML=`<i data-lucide="chevron-right" style="width:20px;height:20px;"></i>`,Object.assign(u.style,{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-secondary)`}),u.addEventListener(`click`,()=>{s===11?(s=0,o++):s++,d()}),n.appendChild(l),n.appendChild(u),e.appendChild(t),e.appendChild(n),y.appendChild(e);let f=document.createElement(`div`);Object.assign(f.style,{display:`grid`,gridTemplateColumns:`repeat(7, 1fr)`,textAlign:`center`,fontSize:`12px`,fontWeight:`600`,color:`var(--text-muted)`,marginBottom:`8px`}),_.forEach(e=>{let t=document.createElement(`div`);t.innerText=e,f.appendChild(t)}),y.appendChild(f);let p=document.createElement(`div`);Object.assign(p.style,{display:`grid`,gridTemplateColumns:`repeat(7, 1fr)`,rowGap:`6px`,textAlign:`center`});let m=new Date(o,s,1).getDay(),h=new Date(o,s+1,0).getDate();for(let e=0;e<m;e++){let e=document.createElement(`div`);p.appendChild(e)}let g=new Date;for(let e=1;e<=h;e++){let t=document.createElement(`button`);t.innerText=e,Object.assign(t.style,{width:`36px`,height:`36px`,borderRadius:`50%`,border:`none`,background:`none`,fontSize:`13px`,fontWeight:`500`,color:`var(--text-primary)`,cursor:`pointer`,display:`flex`,alignItems:`center`,justifyContent:`center`,margin:`0 auto`,transition:`all 150ms`});let n=o===r&&s===i&&e===a,c=o===g.getFullYear()&&s===g.getMonth()&&e===g.getDate();n?(t.style.background=`var(--accent, #ef4444)`,t.style.color=`#ffffff`,t.style.fontWeight=`700`):c?(t.style.border=`1px solid var(--accent, #ef4444)`,t.style.color=`var(--accent, #ef4444)`):(t.addEventListener(`mouseenter`,()=>{t.style.background=`var(--bg-hover, #f1f5f9)`}),t.addEventListener(`mouseleave`,()=>{t.style.background=`none`})),t.addEventListener(`click`,()=>{r=o,i=s,a=e,d()}),p.appendChild(t)}y.appendChild(p)}else if(c===`years`){let e=document.createElement(`div`);Object.assign(e.style,{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:`12px`,maxHeight:`220px`,overflowY:`auto`,padding:`8px 0`});let t=new Date().getFullYear();for(let n=t-10;n<=t+10;n++){let t=document.createElement(`button`);t.innerText=n,Object.assign(t.style,{padding:`8px`,borderRadius:`8px`,border:`1px solid var(--border-default)`,background:n===o?`var(--accent)`:`var(--bg-base)`,color:n===o?`#ffffff`:`var(--text-primary)`,fontWeight:n===o?`700`:`500`,cursor:`pointer`,fontSize:`13px`}),t.addEventListener(`click`,()=>{o=n,c=`calendar`,d()}),e.appendChild(t)}y.appendChild(e)}let b=document.createElement(`div`);Object.assign(b.style,{display:`flex`,justifyContent:`flex-end`,gap:`12px`,padding:`12px 16px`,borderTop:`1px solid var(--border-light, #f1f5f9)`});let x=document.createElement(`button`);x.innerText=`CANCELAR`,Object.assign(x.style,{background:`none`,border:`none`,color:`var(--accent, #ef4444)`,fontWeight:`700`,fontSize:`13px`,padding:`8px 12px`,cursor:`pointer`}),x.addEventListener(`click`,()=>{l.remove()});let S=document.createElement(`button`);S.innerText=`ACEPTAR`,Object.assign(S.style,{background:`none`,border:`none`,color:`var(--accent, #ef4444)`,fontWeight:`700`,fontSize:`13px`,padding:`8px 12px`,cursor:`pointer`}),S.addEventListener(`click`,()=>{let n=(i+1).toString().padStart(2,`0`),a=`${r}-${n}`;e.value=a,e.dispatchEvent(new Event(`input`,{bubbles:!0})),t&&t(a),l.remove()}),b.appendChild(x),b.appendChild(S),y.appendChild(b),u.appendChild(y),typeof lucide<`u`&&lucide.createIcons({nodes:[u]})}d(),l.addEventListener(`click`,e=>{e.target===l&&l.remove()})}var x=null,S=null,C={};async function w(e){e.innerHTML=`
    <div class="registro-container">
      <div class="registro-header" style="display:flex; flex-direction:column; align-items:stretch; gap:var(--space-4); margin-bottom:var(--space-6); width:100%;">

        <h2>Registro de Datos SST</h2>
        
        <!-- Controles de la cabecera: Buscador a la izquierda, Botón a la derecha -->
        <div style="display:flex; align-items:center; width:100%;">
          <div class="search-wrapper" id="table-search-wrapper" style="position:relative; flex:0 1 500px;">
            <input type="text" class="form-input" id="table-search-input" placeholder="Buscar por fecha, empresa, planta..." style="width:100%; padding-left:40px; background-color:var(--bg-surface); border:1px solid var(--border-default);">
            <i data-lucide="search" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); width:16px; height:16px; pointer-events:none;"></i>
          </div>
          <button class="btn btn-primary btn-glow" id="btn-nuevo-registro" style="display:none; margin-left:auto; flex-shrink:0; white-space:nowrap;">
            <i data-lucide="plus"></i> Nuevo Registro
          </button>
        </div>
      </div>

      <!-- Tabla de Registros (Vista Principal) -->
      <div id="view-table" class="registros-table-section card active-view">
        <div class="table-header" style="margin-bottom:var(--space-4);">
          <h3 class="card-title"><i data-lucide="list"></i> Registros Guardados</h3>
        </div>
        <div id="table-container"></div>
      </div>

      <!-- Formulario de Registro (Vista Oculta Inicialmente) -->
      <div id="view-form" class="registro-form" style="display: none;">
        <div style="margin-bottom: var(--space-4);">
          <button class="btn-back" id="btn-volver-tabla" style="background:none; border:none; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:500;">
            <i data-lucide="arrow-left" style="width:18px;height:18px;"></i> Volver a la tabla
          </button>
        </div>

        <div style="display: flex; gap: var(--space-6);">
          <!-- Columna Izquierda: Formulario de entrada -->
          <div class="form-inputs-column" style="flex: 2;">
            <form id="registro-form">
              <fieldset id="form-fieldset" style="border:none; padding:0; margin:0;">
                
                <div class="card form-section" style="margin-bottom:var(--space-6)">
                  <h3 class="form-section-title">1. Información General</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="tipo-select" class="form-label">Tipo de vinculación</label>
                      <select class="form-select" id="tipo-select" name="tipo_registro">
                        <option value="Directo">Directo</option>
                        <option value="Contratista">Contratista</option>
                      </select>
                    </div>
                    ${E(`planta`,[])}
                    ${E(`empresa`,[])}
                    <div class="form-group">
                      <label for="input-periodo" class="form-label">Periodo (Mes y Año)</label>
                      <input type="text" class="form-input" id="input-periodo" name="periodo" required readonly placeholder="Seleccione periodo...">
                    </div>
                    ${T(`num_trabajadores`)}
                    ${T(`hht`)}
                  </div>
                </div>

                <div class="card form-section" style="margin-bottom:var(--space-6)">
                  <h3 class="form-section-title">2. Incidentes y Lesiones</h3>
                  <div class="form-grid">
                    ${T(`dp`)}
                    ${T(`nm`)}
                    ${T(`fai`)}
                    ${T(`mti`)}
                    ${T(`mwd`)}
                    ${T(`lti`)}
                    ${T(`fatalidad`)}
                  </div>
                </div>

                <div class="card form-section">
                  <h3 class="form-section-title">3. Incapacidades y Ausentismo</h3>
                  <div class="form-grid">
                    ${T(`dias_incapacidad_at_elementia`)}
                    ${T(`dias_incapacidad_at_ley`)}
                    ${T(`dias_cargados`)}
                    ${T(`casos_eg`)}
                    ${T(`incapacidad_eg`)}
                    ${T(`casos_el`)}
                  </div>
                </div>

                <div class="form-actions" id="form-actions-container">
                  <button type="button" class="btn btn-secondary" id="btn-limpiar">
                    <i data-lucide="refresh-cw"></i> Limpiar
                  </button>
                  <button type="submit" class="btn btn-primary" id="btn-guardar">
                    <i data-lucide="save"></i> Guardar Registro
                  </button>
                </div>
              </fieldset>
            </form>
          </div>

          <!-- Columna Derecha: Indicadores calculados -->
          <div class="indicadores-column" style="flex: 1;">
            <div class="card indicadores-section" style="position:sticky; top:20px;">
              <h3 class="form-section-title" style="margin-bottom:0">Indicadores Calculados</h3>
              <p style="color:var(--color-text-secondary);font-size:var(--text-xs);margin-bottom:var(--space-4)">Se actualizan en tiempo real.</p>
              
              <div class="indicadores-grid">
                ${o.map(e=>`
                  <div class="indicador-item">
                    <span class="indicador-label">${e.label}</span>
                    <span class="indicador-value" id="calc-${e.key}">0.00</span>
                  </div>
                `).join(``)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,window.lucide&&window.lucide.createIcons(),await D(e),y(e.querySelector(`#input-periodo`),()=>{j(e)}),k(e),await P(e),M(e)}function T(e){let t=u(e);return t?`
    <div class="form-group" style="position:relative;">
      <label for="input-${e}" class="form-label">${t.label}</label>
      <div style="display:flex; align-items:center; gap:8px;">
        <input type="number" class="form-input" id="input-${e}" name="${e}" min="0" step="any" style="flex:1;">
        <button type="button" class="btn-comment" data-key="${e}" title="Añadir comentario" style="background:none; border:none; cursor:pointer; color:var(--color-text-secondary); padding:4px;">
          <i data-lucide="message-square" style="width:18px;height:18px;"></i>
        </button>
      </div>
    </div>
  `:``}function E(e,t){let n=u(e);return n?`
    <div class="form-group">
      <label for="input-${e}" class="form-label">${n.label}</label>
      <select class="form-select" id="input-${e}" name="${e}">
        <option value="" disabled selected>Seleccione...</option>
        ${t.map(e=>`<option value="${e}">${e}</option>`).join(``)}
      </select>
    </div>
  `:``}async function D(t){let[n,r]=await Promise.all([e(`ciudad`),e(`empresa`)]),i=(e,n)=>{let r=t.querySelector(e);r&&n&&n.length>0&&(r.innerHTML=`<option value="" disabled selected>Seleccione...</option>`+n.map(e=>`<option value="${e.valor}">${e.valor}</option>`).join(``))};i(`#input-planta`,n.data),i(`#input-empresa`,r.data)}function O(e,t){let n=e.querySelector(`#input-planta`)?.closest(`.form-group`),r=e.querySelector(`#input-empresa`)?.closest(`.form-group`);if(t===`Directo`){n&&(n.style.display=`block`),r&&(r.style.display=`none`);let t=e.querySelector(`#input-empresa`);t&&(t.value=``)}else{n&&(n.style.display=`none`),r&&(r.style.display=`block`);let t=e.querySelector(`#input-planta`);t&&(t.value=``)}j(e)}function k(e){let t=e.querySelector(`#registro-form`),n=e.querySelector(`#tipo-select`),r=e.querySelector(`#btn-limpiar`),i=e.querySelector(`#btn-nuevo-registro`),a=e.querySelector(`#btn-volver-tabla`),o=e.querySelector(`#view-table`),s=e.querySelector(`#view-form`),c=e.querySelector(`#table-search-wrapper`),l=e.querySelector(`#table-search-input`),d=()=>{o.style.display=`none`,i.style.display=`none`,c&&(c.style.display=`none`),s.style.display=`block`},f=()=>{s.style.display=`none`,o.style.display=`block`,i.style.display=`inline-flex`,c&&(c.style.display=`block`),P(e)};l&&l.addEventListener(`input`,()=>{P(e)}),i.addEventListener(`click`,()=>{M(e),F(e,!1),d()}),a.addEventListener(`click`,()=>{f()}),e._showForm=d,f(),n&&n.addEventListener(`change`,t=>{let n=t.target.value;O(e,n)}),t.querySelectorAll(`input, select`).forEach(t=>{t.addEventListener(`input`,()=>j(e))}),e.querySelectorAll(`.btn-comment`).forEach(t=>{t.addEventListener(`click`,()=>{if(e.querySelector(`#form-fieldset`).disabled)return;let n=t.dataset.key,r=C[n]||``;p({title:`Comentario para ${u(n).label}`,content:`
          <div style="margin:0;">
            <textarea id="comment-textarea" class="form-input" style="width:100%; min-height:100px; resize:vertical; background: #ffffff; border: 1px solid var(--border-default); color: var(--text-primary); padding: 12px; border-radius: 8px; font-family: inherit; font-size: 14px;" placeholder="Escribe un comentario aquí...">${r}</textarea>
          </div>
        `,confirmText:`Guardar`,cancelText:`Cancelar`}).then(r=>{if(r){let r=document.getElementById(`comment-textarea`),i=r?r.value:``;i.trim()===``?(delete C[n],t.style.color=`var(--text-secondary)`):(C[n]=i.trim(),t.style.color=`var(--danger)`),j(e)}})})}),r.addEventListener(`click`,()=>{M(e)}),t.addEventListener(`submit`,async t=>{t.preventDefault(),await N(e),f()})}function A(e){let t=i(),n=e.querySelector(`#tipo-select`);(n?n.value:`Directo`)===`Contratista`?(t.tipo=`Contratista`,t.empresa=e.querySelector(`#input-empresa`).value||``,t.planta=``):(t.tipo=`Directo`,t.planta=e.querySelector(`#input-planta`).value||``,t.empresa=``);let a=e.querySelector(`#input-periodo`);if(a&&a.value){let[e,n]=a.value.split(`-`);t.anio=parseInt(e,10),t.mes=r[parseInt(n,10)-1]}else t.anio=null,t.mes=null;return t.comentarios=C,f.forEach(n=>{if(n.key!==`tipo`&&n.key!==`comentarios`&&n.key!==`planta`&&n.key!==`empresa`&&n.key!==`anio`&&n.key!==`mes`){let r=e.querySelector(`#input-${n.key}`);if(r)if(r.value===``)t[n.key]=null;else{let e=r.value;n.type===`integer`&&(e=parseInt(e,10)),n.type===`numeric`&&(e=parseFloat(e)),t[n.key]=isNaN(e)?n.type===`select`?r.value:null:e}}}),t}function j(e){let t=s(A(e));o.forEach(n=>{let r=e.querySelector(`#calc-${n.key}`);if(r){let e=``;e=n.key===`proporcion_mortalidad`?d(t[n.key]):n.key===`incidentes_lesiones`||n.key===`total_incidentes`?Math.round(t[n.key]).toString():c(t[n.key]),r.innerText!==e&&(r.innerText=e,r.classList.add(`changed`),setTimeout(()=>r.classList.remove(`changed`),500))}})}function M(e){x=null,C={},e.querySelector(`#registro-form`).reset(),f.forEach(t=>{if(t.key!==`tipo`&&t.key!==`comentarios`){let n=e.querySelector(`#input-${t.key}`);n&&(n.value=``)}}),e.querySelectorAll(`.btn-comment`).forEach(e=>{e.style.color=`var(--color-text-secondary)`});let t=e.querySelector(`#tipo-select`);O(e,t?t.value:`Directo`),e.querySelector(`#btn-guardar`).innerHTML=`<i data-lucide="save"></i> Guardar Registro`,window.lucide&&window.lucide.createIcons(),j(e)}async function N(e){let t=e.querySelector(`#btn-guardar`),r=t.innerHTML;t.innerHTML=`<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px"></div> Guardando...`,t.disabled=!0;try{let t=A(e),r;if(r=x?await n(x,t):await a(t),r.error)throw r.error;m(x?`Registro actualizado`:`Registro guardado`,`success`),M(e),await P(e)}catch(e){m(e.message||`Error al guardar`,`error`)}finally{t.innerHTML=r,t.disabled=!1,window.lucide&&window.lucide.createIcons()}}async function P(e){let n=e.querySelector(`#table-container`);S||(n.innerHTML=`<div class="spinner" style="margin:20px auto"></div>`);let r=await l();if(r.error){n.innerHTML=`<p style="color:var(--color-danger)">Error: ${r.error.message}</p>`;return}let i=(r.data||[]).map(e=>{let t=s(e);return{...e,...t}}),a=e.querySelector(`#table-search-input`),o=a?a.value.trim().toLowerCase():``;o&&(i=i.filter(e=>{let t=String(e.anio||``).toLowerCase(),n=String(e.mes||``).toLowerCase(),r=String(e.planta||``).toLowerCase(),i=String(e.empresa||``).toLowerCase(),a=String(e.tipo||``).toLowerCase(),s=`${n} ${t}`;return t.includes(o)||n.includes(o)||r.includes(o)||i.includes(o)||a.includes(o)||s.includes(o)}));let u={fai:0,mti:0,mwd:0,lti:0,dp:0,nm:0,hht:0,num_trabajadores:0,fatalidad:0,dias_incapacidad_at_elementia:0,dias_incapacidad_at_ley:0,dias_cargados:0,casos_eg:0,incapacidad_eg:0,casos_el:0};i.forEach(e=>{Object.keys(u).forEach(t=>{u[t]+=Number(e[t])||0})});let f=s(u),p={anio:`Acumulado`,mes:`-`,tipo:`-`,planta:`-`,empresa:`-`,num_trabajadores:u.num_trabajadores,hht:u.hht,incidentes_lesiones:f.incidentes_lesiones,incidente_tirf:f.incidente_tirf,total_incidentes:f.total_incidentes,ltif:f.ltif,tirf:f.tirf,sr:f.sr,frecuencia_accidentalidad:f.frecuencia_accidentalidad,severidad_accidentalidad:f.severidad_accidentalidad,proporcion_mortalidad:f.proporcion_mortalidad};S&&S.destroy(),S=g({containerId:`table-container`,columns:[{key:`anio`,label:`Año`},{key:`mes`,label:`Mes`},{key:`tipo`,label:`Tipo`},{key:`planta`,label:`Planta`,format:e=>e||`-`},{key:`empresa`,label:`Empresa`,format:e=>e||`-`},{key:`num_trabajadores`,label:`Trabajadores`},{key:`hht`,label:`HHT`,format:e=>c(e,0)},{key:`incidentes_lesiones`,label:`Inc. Lesión`,format:e=>c(e,0)},{key:`incidente_tirf`,label:`Inc. TIRF`,format:e=>c(e,0)},{key:`total_incidentes`,label:`Total Inc.`,format:e=>c(e,0)},{key:`ltif`,label:`LTIF`,format:e=>c(e)},{key:`tirf`,label:`TIRF`,format:e=>c(e)},{key:`sr`,label:`SR`,format:e=>c(e)},{key:`frecuencia_accidentalidad`,label:`Frec. Acc.`,format:e=>c(e)},{key:`severidad_accidentalidad`,label:`Sev. Acc.`,format:e=>c(e)},{key:`proporcion_mortalidad`,label:`% Mort.`,format:e=>d(e)}],data:i,footerRow:p,onView:t=>{I(e,t),F(e,!0),e._showForm()},onEdit:t=>{I(e,t),F(e,!1),e._showForm()},onDelete:async n=>{await h(`Eliminar`,`¿Seguro que desea eliminar el registro de ${n.mes} ${n.anio}?`)&&((await t(n.id)).error?m(`Error al eliminar`,`error`):(m(`Registro eliminado`,`success`),P(e)))},emptyMessage:`No hay registros guardados.`})}function F(e,t){let n=e.querySelector(`#form-fieldset`),r=e.querySelector(`#form-actions-container`);n&&(n.disabled=t),r&&(r.style.display=t?`none`:`flex`)}function I(e,t){x=t.id,C=t.comentarios||{};let n=t.tipo===`Directo`;if(e.querySelector(`#tipo-select`).value=n?`Directo`:`Contratista`,O(e,n?`Directo`:`Contratista`),n?t.planta&&(e.querySelector(`#input-planta`).value=t.planta):t.empresa&&(e.querySelector(`#input-empresa`).value=t.empresa),t.anio&&t.mes){let n=r.indexOf(t.mes);if(n!==-1){let r=(n+1).toString().padStart(2,`0`);e.querySelector(`#input-periodo`).value=`${t.anio}-${r}`}}else e.querySelector(`#input-periodo`).value=``;f.forEach(n=>{if(n.key!==`tipo`&&n.key!==`comentarios`&&n.key!==`planta`&&n.key!==`empresa`&&n.key!==`anio`&&n.key!==`mes`){let r=e.querySelector(`#input-${n.key}`);r&&t[n.key]!==void 0&&t[n.key]!==null?r.value=t[n.key]:r&&(r.value=``)}}),e.querySelectorAll(`.btn-comment`).forEach(e=>{let t=e.dataset.key;C[t]?e.style.color=`var(--danger)`:e.style.color=`var(--text-secondary)`}),j(e),e.querySelector(`#btn-guardar`).innerHTML=`<i data-lucide="edit"></i> Actualizar Registro`,window.lucide&&window.lucide.createIcons(),window.scrollTo({top:0,behavior:`smooth`})}export{w as renderRegistro};