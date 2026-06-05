import{r as e}from"./parametricaService-CrC5YH-P.js";import{a as t,c as n,d as r,f as i,i as a,l as o,m as s,n as c,o as l,p as u,r as d,u as f}from"./formatter-BfxvljpV.js";import{n as p,r as m,t as h}from"./modal-DKrJSUEn.js";function g({containerId:e,columns:t,data:n=[],onView:r,onEdit:i,onDelete:a,footerRow:o=null,emptyMessage:s=`No hay registros disponibles`,disableSorting:c=!1,pageSize:l=50}){let u=document.getElementById(e);if(!u)return console.error(`DataTable: container #${e} not found`),{update(){},destroy(){}};let d=[...n],f=null,p=!0,m=1,h=!c&&!d.some(e=>e.isSubtotal===!0);function g(e){h&&(f===e?p=!p:(f=e,p=!0),d.sort((t,n)=>{let r=t[e]??``,i=n[e]??``;if(typeof r==`number`&&typeof i==`number`)return p?r-i:i-r;let a=String(r).toLowerCase(),o=String(i).toLowerCase();return p?a.localeCompare(o):o.localeCompare(a)}),m=1,v())}function _(e){return h?f===e?p?`<i data-lucide="arrow-up" style="width:14px;height:14px;color:#00b4d8;"></i>`:`<i data-lucide="arrow-down" style="width:14px;height:14px;color:#00b4d8;"></i>`:`<i data-lucide="arrow-up-down" style="width:14px;height:14px;opacity:0.3;"></i>`:``}function v(){if(d.length===0){u.innerHTML=`
                <div class="datatable-empty" style="
                    text-align: center;
                    padding: 48px 24px;
                    color: #5a6a7a;
                    font-size: 14px;
                ">
                    <i data-lucide="inbox" style="width:48px;height:48px;margin-bottom:16px;opacity:0.4;"></i>
                    <p style="margin:0;">${s}</p>
                </div>
            `,typeof lucide<`u`&&lucide.createIcons({nodes:[u]});return}let e=!c&&!d.some(e=>e.isSubtotal===!0),n=d.length,f=Math.ceil(n/l);m>f&&(m=Math.max(1,f));let p=(m-1)*l,h=Math.min(p+l,n),g=d.slice(p,h),v=t.map(t=>`
            <th style="
                padding: 8px 10px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                color: var(--text-secondary);
                border-bottom: 1px solid var(--border-default);
                ${e?`cursor: pointer; user-select: none;`:``}
                white-space: nowrap;
                ${t.width?`width:${t.width};`:``}
            " ${e?`data-sort-key="${t.key}"`:``}>
                <span style="display:flex;align-items:center;gap:4px;">
                    ${t.label}
                    ${e?_(t.key):``}
                </span>
            </th>
        `).join(``),y=r||i||a?`
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
        `:``,b=g.map((e,n)=>{let o=e.isSubtotal===!0,s=p+n,c=t.map(t=>{let n=e[t.key];return t.format&&n!=null&&(n=t.format(n,e)),`<td style="
                    padding: 8px 10px;
                    font-size: 12px;
                    font-weight: ${o?`700`:`500`};
                    color: ${o?`var(--text-primary)`:`var(--text-secondary)`};
                    border-bottom: ${o?`2px solid var(--border-default)`:`1px solid var(--border-light)`};
                    white-space: nowrap;
                ">${n??`—`}</td>`}).join(``),l=r||i||a?`
                <td style="
                    padding: 8px 10px;
                    text-align: center;
                    border-bottom: ${o?`2px solid var(--border-default)`:`1px solid var(--border-light)`};
                ">
                    ${o?``:`
                    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
                        ${r?`<button class="dt-view-btn" data-global-idx="${s}" title="Ver todos los datos" style="
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
                        ${i?`<button class="dt-edit-btn" data-global-idx="${s}" title="Editar" style="
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
                        ${a?`<button class="dt-delete-btn" data-global-idx="${s}" title="Eliminar" style="
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
                    `}
                </td>
            `:``;return`<tr style="${o?`background-color: rgba(148, 163, 184, 0.08); font-weight: bold;`:`transition: background 200ms;`}" ${o?``:`onmouseenter="this.style.background='var(--bg-hover)'" onmouseleave="this.style.background='transparent'"`}>${c}${l}</tr>`}).join(``),x=``;o&&d.length>0&&(x=`
                <tfoot style="background: var(--accent-bg); border-top: 2px solid var(--accent);">
                    <tr>${t.map(e=>{let t=o[e.key];return e.format&&t!=null&&(t=e.format(t,o)),`<td style="
                    padding: 8px 10px;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-size: 12px;
                    white-space: nowrap;
                ">${t??`—`}</td>`}).join(``)}${r||i||a?`<td></td>`:``}</tr>
                </tfoot>
            `);let S=f>1?`
            <div class="datatable-pagination" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                border-top: 1px solid var(--border-default);
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                color: var(--text-secondary);
                background-color: var(--bg-surface);
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
            ">
                <div>
                    Mostrando <strong>${p+1}</strong> a <strong>${h}</strong> de <strong>${n}</strong> registros
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-prev-page btn btn-secondary" ${m===1?`disabled style="opacity: 0.5; cursor: not-allowed;"`:`style="cursor: pointer;"`}>
                        Anterior
                    </button>
                    <span style="display: flex; align-items: center; padding: 0 8px; font-weight: 500;">
                        Pág. ${m} de ${f}
                    </span>
                    <button class="btn-next-page btn btn-secondary" ${m===f?`disabled style="opacity: 0.5; cursor: not-allowed;"`:`style="cursor: pointer;"`}>
                        Siguiente
                    </button>
                </div>
            </div>
        `:``;u.innerHTML=`
            <div style="overflow-x:auto; border-radius:12px; border:1px solid var(--border-default); background-color: var(--bg-surface);">
                <table style="width:100%; border-collapse:collapse; font-family:'Inter',sans-serif;">
                    <thead><tr>${v}${y}</tr></thead>
                    <tbody>${b}</tbody>
                    ${x}
                </table>
                ${S}
            </div>
        `,typeof lucide<`u`&&lucide.createIcons({nodes:[u]})}let y=e=>{let t=e.target.closest(`th[data-sort-key]`);if(t&&h){g(t.dataset.sortKey);return}let n=e.target.closest(`.dt-view-btn`);if(n&&r){let e=parseInt(n.dataset.globalIdx,10);r(d[e]);return}let o=e.target.closest(`.dt-edit-btn`);if(o&&i){let e=parseInt(o.dataset.globalIdx,10);i(d[e]);return}let s=e.target.closest(`.dt-delete-btn`);if(s&&a){let e=parseInt(s.dataset.globalIdx,10);a(d[e]);return}if(e.target.closest(`.btn-prev-page`)&&m>1){m--,v();return}let c=e.target.closest(`.btn-next-page`),u=Math.ceil(d.length/l);c&&m<u&&(m++,v())};return u.addEventListener(`click`,y),v(),{update(e,t=null){d=[...e],t!==null&&(o=t),f&&d.sort((e,t)=>{let n=e[f]??``,r=t[f]??``;return typeof n==`number`&&typeof r==`number`?p?n-r:r-n:p?String(n).localeCompare(String(r)):String(r).localeCompare(String(n))}),m=1,v()},destroy(){u.removeEventListener(`click`,y),u.innerHTML=``,d=[]}}}var _=[`D`,`L`,`M`,`M`,`J`,`V`,`S`],v=[`Enero`,`Febrero`,`Marzo`,`Abril`,`Mayo`,`Junio`,`Julio`,`Agosto`,`Septiembre`,`Octubre`,`Noviembre`,`Diciembre`];function y(e,t){e&&(e.readOnly=!0,e.style.cursor=`pointer`,e.addEventListener(`click`,n=>{let r=e.closest(`fieldset`);r&&r.disabled||b(e,t)}))}function b(e,t){let n=new Date;if(e.value){let[t,r]=e.value.split(`-`);t&&r&&(n=new Date(parseInt(t,10),parseInt(r,10)-1,1))}let r=n.getFullYear(),i=n.getMonth(),a=n.getDate(),o=r,s=i,c=`calendar`,l=document.createElement(`div`);l.className=`datepicker-overlay`,Object.assign(l.style,{position:`fixed`,inset:`0`,zIndex:`11000`,display:`flex`,alignItems:`center`,justifyContent:`center`,background:`rgba(15, 23, 42, 0.4)`,backdropFilter:`blur(4px)`,fontFamily:`'Inter', sans-serif`});let u=document.createElement(`div`);u.className=`datepicker-dialog`,Object.assign(u.style,{background:`#ffffff`,borderRadius:`16px`,width:`320px`,boxShadow:`var(--shadow-xl)`,display:`flex`,flexDirection:`column`,overflow:`hidden`,animation:`modalSlideIn 250ms ease-out`}),l.appendChild(u),document.body.appendChild(l);function d(){u.innerHTML=``;let n=document.createElement(`div`);Object.assign(n.style,{background:`var(--accent, #ef4444)`,padding:`20px 24px`,color:`#ffffff`,display:`flex`,flexDirection:`column`,gap:`4px`,position:`relative`});let f=document.createElement(`span`);f.innerText=`SELECCIONAR FECHA`,Object.assign(f.style,{fontSize:`10px`,fontWeight:`700`,letterSpacing:`0.8px`,opacity:`0.8`});let p=new Date(r,i,a),m=p.toLocaleDateString(`es-ES`,{weekday:`short`}),h=p.toLocaleDateString(`es-ES`,{month:`short`}),g=document.createElement(`h2`);g.innerText=`${m.charAt(0).toUpperCase()+m.slice(1)}, ${a} de ${h}`,Object.assign(g.style,{margin:`0`,fontSize:`28px`,fontWeight:`700`,color:`#ffffff`,lineHeight:`1.2`}),n.appendChild(f),n.appendChild(g),u.appendChild(n);let y=document.createElement(`div`);if(Object.assign(y.style,{padding:`16px`,background:`#ffffff`,display:`flex`,flexDirection:`column`,flex:`1`}),c===`calendar`){let e=document.createElement(`div`);Object.assign(e.style,{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`16px`});let t=document.createElement(`button`);t.innerHTML=`${v[s]} ${o} <i data-lucide="chevron-down" style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-left:4px"></i>`,Object.assign(t.style,{fontSize:`14px`,fontWeight:`600`,color:`var(--text-primary)`,background:`none`,border:`none`,cursor:`pointer`,display:`flex`,alignItems:`center`}),t.addEventListener(`click`,()=>{c=`years`,d()});let n=document.createElement(`div`);Object.assign(n.style,{display:`flex`,gap:`8px`});let l=document.createElement(`button`);l.innerHTML=`<i data-lucide="chevron-left" style="width:20px;height:20px;"></i>`,Object.assign(l.style,{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-secondary)`}),l.addEventListener(`click`,()=>{s===0?(s=11,o--):s--,d()});let u=document.createElement(`button`);u.innerHTML=`<i data-lucide="chevron-right" style="width:20px;height:20px;"></i>`,Object.assign(u.style,{background:`none`,border:`none`,cursor:`pointer`,color:`var(--text-secondary)`}),u.addEventListener(`click`,()=>{s===11?(s=0,o++):s++,d()}),n.appendChild(l),n.appendChild(u),e.appendChild(t),e.appendChild(n),y.appendChild(e);let f=document.createElement(`div`);Object.assign(f.style,{display:`grid`,gridTemplateColumns:`repeat(7, 1fr)`,textAlign:`center`,fontSize:`12px`,fontWeight:`600`,color:`var(--text-muted)`,marginBottom:`8px`}),_.forEach(e=>{let t=document.createElement(`div`);t.innerText=e,f.appendChild(t)}),y.appendChild(f);let p=document.createElement(`div`);Object.assign(p.style,{display:`grid`,gridTemplateColumns:`repeat(7, 1fr)`,rowGap:`6px`,textAlign:`center`});let m=new Date(o,s,1).getDay(),h=new Date(o,s+1,0).getDate();for(let e=0;e<m;e++){let e=document.createElement(`div`);p.appendChild(e)}let g=new Date;for(let e=1;e<=h;e++){let t=document.createElement(`button`);t.innerText=e,Object.assign(t.style,{width:`36px`,height:`36px`,borderRadius:`50%`,border:`none`,background:`none`,fontSize:`13px`,fontWeight:`500`,color:`var(--text-primary)`,cursor:`pointer`,display:`flex`,alignItems:`center`,justifyContent:`center`,margin:`0 auto`,transition:`all 150ms`});let n=o===r&&s===i&&e===a,c=o===g.getFullYear()&&s===g.getMonth()&&e===g.getDate();n?(t.style.background=`var(--accent, #ef4444)`,t.style.color=`#ffffff`,t.style.fontWeight=`700`):c?(t.style.border=`1px solid var(--accent, #ef4444)`,t.style.color=`var(--accent, #ef4444)`):(t.addEventListener(`mouseenter`,()=>{t.style.background=`var(--bg-hover, #f1f5f9)`}),t.addEventListener(`mouseleave`,()=>{t.style.background=`none`})),t.addEventListener(`click`,()=>{r=o,i=s,a=e,d()}),p.appendChild(t)}y.appendChild(p)}else if(c===`years`){let e=document.createElement(`div`);Object.assign(e.style,{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:`12px`,maxHeight:`220px`,overflowY:`auto`,padding:`8px 0`});let t=new Date().getFullYear();for(let n=t-10;n<=t+10;n++){let t=document.createElement(`button`);t.innerText=n,Object.assign(t.style,{padding:`8px`,borderRadius:`8px`,border:`1px solid var(--border-default)`,background:n===o?`var(--accent)`:`var(--bg-base)`,color:n===o?`#ffffff`:`var(--text-primary)`,fontWeight:n===o?`700`:`500`,cursor:`pointer`,fontSize:`13px`}),t.addEventListener(`click`,()=>{o=n,c=`calendar`,d()}),e.appendChild(t)}y.appendChild(e)}let b=document.createElement(`div`);Object.assign(b.style,{display:`flex`,justifyContent:`flex-end`,gap:`12px`,padding:`12px 16px`,borderTop:`1px solid var(--border-light, #f1f5f9)`});let x=document.createElement(`button`);x.innerText=`CANCELAR`,Object.assign(x.style,{background:`none`,border:`none`,color:`var(--accent, #ef4444)`,fontWeight:`700`,fontSize:`13px`,padding:`8px 12px`,cursor:`pointer`}),x.addEventListener(`click`,()=>{l.remove()});let S=document.createElement(`button`);S.innerText=`ACEPTAR`,Object.assign(S.style,{background:`none`,border:`none`,color:`var(--accent, #ef4444)`,fontWeight:`700`,fontSize:`13px`,padding:`8px 12px`,cursor:`pointer`}),S.addEventListener(`click`,()=>{let n=(i+1).toString().padStart(2,`0`),a=`${r}-${n}`;e.value=a,e.dispatchEvent(new Event(`input`,{bubbles:!0})),t&&t(a),l.remove()}),b.appendChild(x),b.appendChild(S),y.appendChild(b),u.appendChild(y),typeof lucide<`u`&&lucide.createIcons({nodes:[u]})}d(),l.addEventListener(`click`,e=>{e.target===l&&l.remove()})}var x=null,S=null,C={},w=null,T=[];function E(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{clearTimeout(n),e(...r)},t)}}function D(e){if(!e||e.length===0){m(`No hay datos para exportar`,`warning`);return}let t=`Anio,Mes,Tipo de vinculacion,Planta,Empresa,Trabajadores,HHT,DP,NM,FAI,MTI,MWD,LTI,Fatalidad,Dias Inc. Elementia,Dias Inc. Ley,Dias Cargados,Casos EG,Incapacidad EG,Casos EL,Inc. Lesion,Inc. TIRF,Total Inc.,LTIF,TIRF,SR,Frec. Acc.,Sev. Acc.,% Mort.`.split(`,`),n=[];n.push(t.join(`;`)),e.forEach(e=>{if(e.isSubtotal)return;let t=[e.anio??``,e.mes??``,e.tipo??``,e.planta??``,e.empresa??``,e.num_trabajadores??0,e.hht??0,e.dp??0,e.nm??0,e.fai??0,e.mti??0,e.mwd??0,e.lti??0,e.fatalidad??0,e.dias_incapacidad_at_elementia??0,e.dias_incapacidad_at_ley??0,e.dias_cargados??0,e.casos_eg??0,e.incapacidad_eg??0,e.casos_el??0,e.incidentes_lesiones??0,e.incidente_tirf??0,e.total_incidentes??0,e.ltif??0,e.tirf??0,e.sr??0,e.frecuencia_accidentalidad??0,e.severidad_accidentalidad??0,e.proporcion_mortalidad??0].map(e=>{let t=String(e).replace(/"/g,`""`);return t.includes(`;`)||t.includes(`
`)||t.includes(`"`)?`"${t}"`:t});n.push(t.join(`;`))});let r=`﻿`+n.join(`
`),i=new Blob([r],{type:`text/csv;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.setAttribute(`href`,a),o.setAttribute(`download`,`registro_sst_export_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(o),o.click(),document.body.removeChild(o)}async function O(e,t=`Directo`){e._currentModo=t,e.innerHTML=`
    <div class="registro-container">
      <div class="registro-header" style="display:flex; flex-direction:column; align-items:stretch; gap:var(--space-4); margin-bottom:var(--space-6); width:100%;">

        <h2>Registro de Datos SST</h2>
        
        <!-- Controles de la cabecera: Buscador a la izquierda, Botones a la derecha -->
        <div style="display:flex; align-items:center; width:100%; gap: 12px;">
          <div class="search-wrapper" id="table-search-wrapper" style="position:relative; flex:0 1 500px;">
            <input type="text" class="form-input" id="table-search-input" placeholder="Buscar por fecha, empresa, planta..." style="width:100%; padding-left:40px; background-color:var(--bg-surface); border:1px solid var(--border-default);">
            <i data-lucide="search" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); width:16px; height:16px; pointer-events:none;"></i>
          </div>
          <button class="btn btn-secondary" id="btn-exportar-csv" style="display:none; margin-left:auto; flex-shrink:0; white-space:nowrap; align-items:center; gap:6px;">
            <i data-lucide="download" style="width:16px;height:16px;"></i> Exportar CSV
          </button>
          <button class="btn btn-primary btn-glow" id="btn-nuevo-registro" style="display:none; flex-shrink:0; white-space:nowrap; align-items:center; gap:6px;">
            <i data-lucide="plus" style="width:16px;height:16px;"></i> Nuevo Registro
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
                      <select class="form-select" id="tipo-select" name="tipo_registro" disabled>
                        <option value="Directo" ${t===`Directo`?`selected`:``}>Directo</option>
                        <option value="Contratista" ${t===`Contratista`?`selected`:``}>Contratista</option>
                      </select>
                    </div>
                    ${A(`planta`,[])}
                    ${A(`empresa`,[])}
                    <div class="form-group">
                      <label for="input-periodo" class="form-label">Periodo (Mes y Año)</label>
                      <input type="text" class="form-input" id="input-periodo" name="periodo" required readonly placeholder="Seleccione periodo...">
                    </div>
                    ${k(`num_trabajadores`)}
                    ${k(`hht`)}
                  </div>
                </div>

                <div class="card form-section" style="margin-bottom:var(--space-6)">
                  <h3 class="form-section-title">2. Incidentes y Lesiones</h3>
                  <div class="form-grid">
                    ${k(`dp`)}
                    ${k(`nm`)}
                    ${k(`fai`)}
                    ${k(`mti`)}
                    ${k(`mwd`)}
                    ${k(`lti`)}
                    ${k(`fatalidad`)}
                  </div>
                </div>

                <div class="card form-section">
                  <h3 class="form-section-title">3. Incapacidades y Ausentismo</h3>
                  <div class="form-grid">
                    ${k(`dias_incapacidad_at_elementia`)}
                    ${k(`dias_incapacidad_at_ley`)}
                    ${k(`dias_cargados`)}
                    ${k(`casos_eg`)}
                    ${k(`incapacidad_eg`)}
                    ${k(`casos_el`)}
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
  `,window.lucide&&window.lucide.createIcons(),await j(e),y(e.querySelector(`#input-periodo`),()=>{F(e)}),N(e),await R(e),I(e)}function k(e){let t=u(e);return t?`
    <div class="form-group" style="position:relative;">
      <label for="input-${e}" class="form-label">${t.label}</label>
      <div style="display:flex; align-items:center; gap:8px;">
        <input type="number" class="form-input" id="input-${e}" name="${e}" min="0" step="any" style="flex:1;">
        <button type="button" class="btn-comment" data-key="${e}" title="Añadir comentario" style="background:none; border:none; cursor:pointer; color:var(--color-text-secondary); padding:4px;">
          <i data-lucide="message-square" style="width:18px;height:18px;"></i>
        </button>
      </div>
    </div>
  `:``}function A(e,t){let n=u(e);return n?`
    <div class="form-group">
      <label for="input-${e}" class="form-label">${n.label}</label>
      <select class="form-select" id="input-${e}" name="${e}">
        <option value="" disabled selected>Seleccione...</option>
        ${t.map(e=>`<option value="${e}">${e}</option>`).join(``)}
      </select>
    </div>
  `:``}async function j(t){let[n,r]=await Promise.all([e(`ciudad`),e(`empresa`)]),i=(e,n)=>{let r=t.querySelector(e);r&&n&&n.length>0&&(r.innerHTML=`<option value="" disabled selected>Seleccione...</option>`+n.map(e=>`<option value="${e.valor}">${e.valor}</option>`).join(``))};i(`#input-planta`,n.data),i(`#input-empresa`,r.data)}function M(e,t){let n=e.querySelector(`#input-planta`)?.closest(`.form-group`),r=e.querySelector(`#input-empresa`)?.closest(`.form-group`);if(t===`Directo`){n&&(n.style.display=`block`),r&&(r.style.display=`none`);let t=e.querySelector(`#input-empresa`);t&&(t.value=``)}else{n&&(n.style.display=`none`),r&&(r.style.display=`block`);let t=e.querySelector(`#input-planta`);t&&(t.value=``)}F(e)}function N(e){let t=e.querySelector(`#registro-form`),n=e.querySelector(`#tipo-select`),r=e.querySelector(`#btn-limpiar`),i=e.querySelector(`#btn-nuevo-registro`),a=e.querySelector(`#btn-exportar-csv`),o=e.querySelector(`#btn-volver-tabla`),s=e.querySelector(`#view-table`),c=e.querySelector(`#view-form`),l=e.querySelector(`#table-search-wrapper`),d=e.querySelector(`#table-search-input`),f=()=>{s.style.display=`none`,i.style.display=`none`,a&&(a.style.display=`none`),l&&(l.style.display=`none`),c.style.display=`block`},m=()=>{c.style.display=`none`,s.style.display=`block`,i.style.display=`inline-flex`,a&&(a.style.display=`inline-flex`),l&&(l.style.display=`block`),R(e)};d&&d.addEventListener(`input`,E(()=>{R(e)},300)),a&&a.addEventListener(`click`,()=>{D(T)}),i.addEventListener(`click`,()=>{I(e),z(e,!1),f()}),o.addEventListener(`click`,()=>{m()}),e._showForm=f,m(),n&&n.addEventListener(`change`,t=>{let n=t.target.value;M(e,n)}),t.querySelectorAll(`input, select`).forEach(t=>{t.addEventListener(`input`,()=>F(e))}),e.querySelectorAll(`.btn-comment`).forEach(t=>{t.addEventListener(`click`,()=>{if(e.querySelector(`#form-fieldset`).disabled)return;let n=t.dataset.key,r=C[n]||``;p({title:`Comentario para ${u(n).label}`,content:`
          <div style="margin:0;">
            <textarea id="comment-textarea" class="form-input" style="width:100%; min-height:100px; resize:vertical; background: #ffffff; border: 1px solid var(--border-default); color: var(--text-primary); padding: 12px; border-radius: 8px; font-family: inherit; font-size: 14px;" placeholder="Escribe un comentario aquí...">${r}</textarea>
          </div>
        `,confirmText:`Guardar`,cancelText:`Cancelar`}).then(r=>{if(r){let r=document.getElementById(`comment-textarea`),i=r?r.value:``;i.trim()===``?(delete C[n],t.style.color=`var(--text-secondary)`):(C[n]=i.trim(),t.style.color=`var(--danger)`),F(e)}})})}),r.addEventListener(`click`,()=>{I(e)}),t.addEventListener(`submit`,async t=>{t.preventDefault(),await L(e),m()})}function P(e){let t=i(),n=e.querySelector(`#tipo-select`);(n?n.value:`Directo`)===`Contratista`?(t.tipo=`Contratista`,t.empresa=e.querySelector(`#input-empresa`).value||``,t.planta=``):(t.tipo=`Directo`,t.planta=e.querySelector(`#input-planta`).value||``,t.empresa=``);let a=e.querySelector(`#input-periodo`);if(a&&a.value){let[e,n]=a.value.split(`-`);t.anio=parseInt(e,10),t.mes=r[parseInt(n,10)-1]}else t.anio=null,t.mes=null;return t.comentarios=C,f.forEach(n=>{if(n.key!==`tipo`&&n.key!==`comentarios`&&n.key!==`planta`&&n.key!==`empresa`&&n.key!==`anio`&&n.key!==`mes`){let r=e.querySelector(`#input-${n.key}`);if(r)if(r.value===``)t[n.key]=null;else{let e=r.value;n.type===`integer`&&(e=parseInt(e,10)),n.type===`numeric`&&(e=parseFloat(e)),t[n.key]=isNaN(e)?n.type===`select`?r.value:null:e}}}),t}function F(e){let t=s(P(e));o.forEach(n=>{let r=e.querySelector(`#calc-${n.key}`);if(r){let e=``;e=n.key===`proporcion_mortalidad`?d(t[n.key]):n.key===`incidentes_lesiones`||n.key===`total_incidentes`?Math.round(t[n.key]).toString():c(t[n.key]),r.innerText!==e&&(r.innerText=e,r.classList.add(`changed`),setTimeout(()=>r.classList.remove(`changed`),500))}})}function I(e){x=null,C={},e.querySelector(`#registro-form`).reset(),f.forEach(t=>{if(t.key!==`tipo`&&t.key!==`comentarios`){let n=e.querySelector(`#input-${t.key}`);n&&(n.value=``)}}),e.querySelectorAll(`.btn-comment`).forEach(e=>{e.style.color=`var(--color-text-secondary)`});let t=e.querySelector(`#tipo-select`);M(e,t?t.value:`Directo`),e.querySelector(`#btn-guardar`).innerHTML=`<i data-lucide="save"></i> Guardar Registro`,window.lucide&&window.lucide.createIcons(),F(e)}async function L(e){let t=e.querySelector(`#btn-guardar`),r=t.innerHTML;t.innerHTML=`<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px"></div> Guardando...`,t.disabled=!0;try{let t=P(e),r;if(r=x?await n(x,t):await a(t),r.error)throw r.error;m(x?`Registro actualizado`:`Registro guardado`,`success`),I(e),await R(e,!0)}catch(e){m(e.message||`Error al guardar`,`error`)}finally{t.innerHTML=r,t.disabled=!1,window.lucide&&window.lucide.createIcons()}}async function R(e,n=!1){let r=e.querySelector(`#table-container`);if(S||(r.innerHTML=`<div class="spinner" style="margin:20px auto"></div>`),n||!w){let e=await l();if(e.error){r.innerHTML=`<p style="color:var(--color-danger)">Error: ${e.error.message}</p>`;return}w=e.data||[]}let i=e._currentModo||`Directo`,a=w.filter(e=>e.tipo===i).map(e=>{let t=s(e);return{...e,...t}}),o=e.querySelector(`#table-search-input`),u=o?o.value.trim().toLowerCase():``;u&&(a=a.filter(e=>{let t=String(e.anio||``).toLowerCase(),n=String(e.mes||``).toLowerCase(),r=String(e.planta||``).toLowerCase(),i=String(e.empresa||``).toLowerCase(),a=String(e.tipo||``).toLowerCase(),o=`${n} ${t}`;return t.includes(u)||n.includes(u)||r.includes(u)||i.includes(u)||a.includes(u)||o.includes(u)})),T=a;let f={fai:0,mti:0,mwd:0,lti:0,dp:0,nm:0,hht:0,num_trabajadores:0,fatalidad:0,dias_incapacidad_at_elementia:0,dias_incapacidad_at_ley:0,dias_cargados:0,casos_eg:0,incapacidad_eg:0,casos_el:0};a.forEach(e=>{Object.keys(f).forEach(t=>{f[t]+=Number(e[t])||0})});let p=s(f),_={anio:`Acumulado General`,mes:`-`,tipo:`-`,planta:`-`,empresa:`-`,num_trabajadores:f.num_trabajadores,hht:f.hht,incidentes_lesiones:p.incidentes_lesiones,incidente_tirf:p.incidente_tirf,total_incidentes:p.total_incidentes,ltif:p.ltif,tirf:p.tirf,sr:p.sr,frecuencia_accidentalidad:p.frecuencia_accidentalidad,severidad_accidentalidad:p.severidad_accidentalidad,proporcion_mortalidad:p.proporcion_mortalidad},v=(e,t,n)=>{let r={fai:0,mti:0,mwd:0,lti:0,dp:0,nm:0,hht:0,num_trabajadores:0,fatalidad:0,dias_incapacidad_at_elementia:0,dias_incapacidad_at_ley:0,dias_cargados:0,casos_eg:0,incapacidad_eg:0,casos_el:0};e.forEach(e=>{Object.keys(r).forEach(t=>{r[t]+=Number(e[t])||0})});let i=s(r);return{isSubtotal:!0,anio:t,mes:n,tipo:`-`,planta:`-`,empresa:`Acumulado`,num_trabajadores:r.num_trabajadores,hht:r.hht,...r,incidentes_lesiones:i.incidentes_lesiones,incidente_tirf:i.incidente_tirf,total_incidentes:i.total_incidentes,ltif:i.ltif,tirf:i.tirf,sr:i.sr,frecuencia_accidentalidad:i.frecuencia_accidentalidad,severidad_accidentalidad:i.severidad_accidentalidad,proporcion_mortalidad:i.proporcion_mortalidad}},y=[],b=[],x=null,C=null;a.forEach(e=>{e.anio!==x||e.mes!==C?(b.length>0&&(y.push(...b),y.push(v(b,x,C))),b=[e],x=e.anio,C=e.mes):b.push(e)}),b.length>0&&(y.push(...b),y.push(v(b,x,C)));let E=[];E.push({key:`mes`,label:`PERIODO`,format:(e,t)=>`${t.mes} ${t.anio}`}),i===`Contratista`&&E.push({key:`empresa`,label:`EMPRESA`,width:`220px`,format:e=>e||`-`}),E.push({key:`num_trabajadores`,label:`<span title="Trabajadores">TRAB.</span>`},{key:`hht`,label:`HHT`,format:e=>c(e,0)},{key:`incidentes_lesiones`,label:`<span title="Incidentes con Lesión">LESIÓN</span>`,format:e=>c(e,0)},{key:`incidente_tirf`,label:`<span title="Incidentes TIRF">TIRF</span>`,format:e=>c(e,0)},{key:`total_incidentes`,label:`<span title="Total Incidentes">INC.</span>`,format:e=>c(e,0)},{key:`ltif`,label:`<span title="Lost Time Injury Frequency Rate (Tasa de Frecuencia de Lesiones con Tiempo Perdido)">LTIF</span>`,format:e=>c(e)},{key:`tirf`,label:`<span title="Total Recordable Injury Frequency Rate (Tasa de Frecuencia de Lesiones Totales Registrables)">TIRF</span>`,format:e=>c(e)},{key:`sr`,label:`<span title="Severity Rate (Tasa de Severidad)">SR</span>`,format:e=>c(e)},{key:`frecuencia_accidentalidad`,label:`<span title="Frecuencia de Accidentalidad">Frec. Acc.</span>`,format:e=>c(e)},{key:`severidad_accidentalidad`,label:`<span title="Severidad de Accidentalidad">Sev. Acc.</span>`,format:e=>c(e)},{key:`proporcion_mortalidad`,label:`<span title="Proporción de Mortalidad">% Mort.</span>`,format:e=>d(e)}),S&&S.destroy(),S=g({containerId:`table-container`,columns:E,data:y,footerRow:_,onView:t=>{B(e,t),z(e,!0),e._showForm()},onEdit:t=>{B(e,t),z(e,!1),e._showForm()},onDelete:async n=>{await h(`Eliminar`,`¿Seguro que desea eliminar el registro de ${n.mes} ${n.anio}?`)&&((await t(n.id)).error?m(`Error al eliminar`,`error`):(m(`Registro eliminado`,`success`),await R(e,!0)))},emptyMessage:`No hay registros guardados.`})}function z(e,t){let n=e.querySelector(`#form-fieldset`),r=e.querySelector(`#form-actions-container`);n&&(n.disabled=t),r&&(r.style.display=t?`none`:`flex`)}function B(e,t){x=t.id,C=t.comentarios||{};let n=t.tipo===`Directo`;if(e.querySelector(`#tipo-select`).value=n?`Directo`:`Contratista`,M(e,n?`Directo`:`Contratista`),n?t.planta&&(e.querySelector(`#input-planta`).value=t.planta):t.empresa&&(e.querySelector(`#input-empresa`).value=t.empresa),t.anio&&t.mes){let n=r.indexOf(t.mes);if(n!==-1){let r=(n+1).toString().padStart(2,`0`);e.querySelector(`#input-periodo`).value=`${t.anio}-${r}`}}else e.querySelector(`#input-periodo`).value=``;f.forEach(n=>{if(n.key!==`tipo`&&n.key!==`comentarios`&&n.key!==`planta`&&n.key!==`empresa`&&n.key!==`anio`&&n.key!==`mes`){let r=e.querySelector(`#input-${n.key}`);r&&t[n.key]!==void 0&&t[n.key]!==null?r.value=t[n.key]:r&&(r.value=``)}}),e.querySelectorAll(`.btn-comment`).forEach(e=>{let t=e.dataset.key;C[t]?e.style.color=`var(--danger)`:e.style.color=`var(--text-secondary)`}),F(e),e.querySelector(`#btn-guardar`).innerHTML=`<i data-lucide="edit"></i> Actualizar Registro`,window.lucide&&window.lucide.createIcons(),window.scrollTo({top:0,behavior:`smooth`})}export{O as renderRegistro};