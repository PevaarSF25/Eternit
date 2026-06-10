import{r as e}from"./parametricaService-CrC5YH-P.js";import{d as t,n,o as r,s as i,t as a}from"./formatter-Cvxt4yKU.js";var o=[`#00b4d8`,`#06d6a0`,`#ef476f`,`#ffd166`,`#48cae4`,`#9b5de5`],s={gridColor:`rgba(0,0,0,0.06)`,textColor:`#64748b`,fontFamily:`'Inter', sans-serif`,tooltipBg:`rgba(30, 41, 59, 0.95)`,tooltipBorder:`rgba(0,0,0,0.1)`,tooltipTitleColor:`#f1f5f9`,tooltipBodyColor:`#cbd5e1`};function c(e={}){return{responsive:!0,maintainAspectRatio:!1,animation:{duration:700,easing:`easeOutQuart`},plugins:{legend:{labels:{color:s.textColor,font:{family:s.fontFamily,size:12},padding:16,usePointStyle:!0,pointStyle:`circle`},...e.legend},tooltip:{backgroundColor:s.tooltipBg,titleColor:s.tooltipTitleColor,bodyColor:s.tooltipBodyColor,borderColor:s.tooltipBorder,borderWidth:1,cornerRadius:8,padding:12,titleFont:{family:s.fontFamily,size:13,weight:`600`},bodyFont:{family:s.fontFamily,size:12},displayColors:!0,boxPadding:4,...e.tooltip}},...e}}function l(e=!1){return{x:{stacked:e,grid:{color:s.gridColor,drawBorder:!1},ticks:{color:s.textColor,font:{family:s.fontFamily,size:11}}},y:{stacked:e,beginAtZero:!0,grid:{color:s.gridColor,drawBorder:!1},ticks:{color:s.textColor,font:{family:s.fontFamily,size:11}}}}}function u(e,{labels:t,datasets:n,stacked:r=!1,showLine:i=!1}){let a=n.map((e,t)=>({backgroundColor:e.backgroundColor||o[t%o.length],borderColor:e.borderColor||o[t%o.length],borderWidth:e.type===`line`?2:0,borderRadius:e.type===`line`?0:6,tension:.4,pointRadius:e.type===`line`?4:void 0,pointBackgroundColor:e.type===`line`?e.borderColor||o[t%o.length]:void 0,...e}));return new Chart(e,{type:`bar`,data:{labels:t,datasets:a},options:{...c(),scales:l(r)}})}function d(e,{labels:t,data:n,colors:r}){let i=r||o.slice(0,n.length);return new Chart(e,{type:`doughnut`,data:{labels:t,datasets:[{data:n,backgroundColor:i,borderColor:`#ffffff`,borderWidth:3,hoverOffset:8}]},options:{...c({legend:{position:`bottom`}}),cutout:`65%`,plugins:{...c().plugins,legend:{position:`bottom`,labels:{color:s.textColor,font:{family:s.fontFamily,size:12},padding:20,usePointStyle:!0,pointStyle:`circle`}}}}})}function f(e,{labels:t,datasets:n,fill:r=!1}){let i=n.map((e,t)=>{let n=e.borderColor||o[t%o.length];return{borderColor:n,backgroundColor:r?m(n,.1):`transparent`,borderWidth:2.5,tension:.4,pointRadius:4,pointHoverRadius:6,pointBackgroundColor:n,pointBorderColor:n,fill:r?`origin`:!1,...e}});return new Chart(e,{type:`line`,data:{labels:t,datasets:i},options:{...c(),scales:l(!1),interaction:{mode:`index`,intersect:!1}}})}function p(e){if(e&&typeof e.destroy==`function`)try{e.destroy()}catch(e){console.warn(`Error destroying chart:`,e)}}function m(e,t){let n=e.replace(`#`,``);return`rgba(${parseInt(n.substring(0,2),16)}, ${parseInt(n.substring(2,4),16)}, ${parseInt(n.substring(4,6),16)}, ${t})`}var h={};async function g(e){return e.innerHTML=`
    <div class="dashboard-container">
      
      <!-- Filters -->
      <div class="dashboard-filters card" style="padding:var(--space-3) var(--space-5); margin-bottom:var(--space-2); display:flex; align-items:flex-end; gap:var(--space-4);">
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
            ${t.map(e=>`<option value="${e}">${e}</option>`).join(``)}
          </select>
        </div>
        <div style="margin-left:auto;">
          <button class="btn btn-secondary" id="btn-limpiar-filtros">
            <i data-lucide="filter-x"></i> Limpiar Filtros
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
  `,window.lucide&&window.lucide.createIcons(),await _(e),await y(e),()=>{Object.values(h).forEach(p),h={}}}async function _(t){let n=t.querySelector(`#filter-anio`),r=t.querySelector(`#filter-tipo`),[a,o]=await Promise.all([i(),e(`contratista`)]);!a.error&&a.data&&a.data.forEach(e=>{e.anio&&(n.innerHTML+=`<option value="${e.anio}">${e.anio}</option>`)}),!o.error&&o.data&&o.data.forEach(e=>{r.innerHTML+=`<option value="${e.valor}">${e.valor}</option>`});let s=t.querySelectorAll(`.dashboard-filters select`);s.forEach(e=>e.addEventListener(`change`,()=>y(t))),t.querySelector(`#btn-limpiar-filtros`).addEventListener(`click`,()=>{s.forEach(e=>e.value=`Todos`),y(t)})}function v(e){let t=e.querySelector(`#filter-tipo`).value,n=e.querySelector(`#filter-anio`).value,r=e.querySelector(`#filter-mes`).value,i={};return t!==`Todos`&&(i.tipo=t),n!==`Todos`&&(i.anio=parseInt(n,10)),r!==`Todos`&&(i.mes=r),i}async function y(e){let t=v(e),n=await r(t);if(n.error){console.error(n.error);return}let i=n.data||[];b(e,i),x(e,i,t),S(e,i)}function b(e,t){let r=0,i=0,o=0,s=0,c=0,l=0,u=0,d=0;t.forEach(e=>{r+=e.total_incidentes||0,i+=e.lti||0,o+=e.mti||0,s+=e.fai||0,c+=e.fatalidad||0,l+=e.hht||0,u+=e.ltif||0,d+=(e.dias_incapacidad_at||0)+(e.dias_cargados||0)});let f=t.length>0?u/t.length:0,p=[{label:`TOTAL INCIDENTES`,value:a(r)},{label:`LTI (Lost Time)`,value:a(i)},{label:`MTI (Med Treat)`,value:a(o)},{label:`FAI (First Aid)`,value:a(s)},{label:`FATALIDADES`,value:a(c)},{label:`HHT TOTAL`,value:a(l)},{label:`LTIF PROM.`,value:n(f)},{label:`DÍAS INCAP.`,value:a(d)}].map(e=>`
    <div class="kpi-card">
      <span class="kpi-label">${e.label}</span>
      <span class="kpi-value">${e.value}</span>
    </div>
  `).join(``);e.querySelector(`#kpi-container`).innerHTML=p}function x(e,n,r){let i=`#06d6a0`,a=`#ffd166`,o=`#ef476f`,s=`#e8edf2`,c=C(n),l=Object.keys(c).sort(),m=l.map(e=>c[e].fai),g=l.map(e=>c[e].mti),_=l.map(e=>c[e].lti),v=l.map(e=>c[e].fai+c[e].mti+c[e].lti);h.incidentesAnio&&p(h.incidentesAnio);let y=e.querySelector(`#chart-incidentes-anio`).getContext(`2d`);h.incidentesAnio=u(y,{labels:l,datasets:[{label:`Total`,data:v,type:`line`,borderColor:s,backgroundColor:s,borderWidth:2,fill:!1},{label:`LTI`,data:_,backgroundColor:o,stack:`Stack 0`},{label:`MTI`,data:g,backgroundColor:a,stack:`Stack 0`},{label:`FAI`,data:m,backgroundColor:i,stack:`Stack 0`}],stacked:!0,showLine:!0});let b=0,x=0;n.forEach(e=>{(e.tipo||``).toLowerCase()===`directo`?b+=e.total_incidentes||0:x+=e.total_incidentes||0}),h.doughnut&&p(h.doughnut);let S=e.querySelector(`#chart-doughnut`).getContext(`2d`);h.doughnut=d(S,{labels:[`Directo`,`Contratista`],data:[b,x],colors:[`#00b4d8`,`#ffd166`]});let T=w(n),E=t.map(e=>T[e]?T[e].fai:0),D=t.map(e=>T[e]?T[e].mti:0),O=t.map(e=>T[e]?T[e].lti:0);h.mensual&&p(h.mensual);let k=e.querySelector(`#chart-mensual`).getContext(`2d`);h.mensual=f(k,{labels:t.map(e=>e.substring(0,3)),datasets:[{label:`LTI`,data:O,borderColor:o,tension:.3},{label:`MTI`,data:D,borderColor:a,tension:.3},{label:`FAI`,data:E,borderColor:i,tension:.3}],fill:!1});let A=l.map(e=>{let t=n.filter(t=>t.anio.toString()===e),r=t.reduce((e,t)=>e+(t.ltif||0),0);return t.length?r/t.length:0});h.ltif&&p(h.ltif);let j=e.querySelector(`#chart-ltif`).getContext(`2d`);h.ltif=f(j,{labels:l,datasets:[{label:`LTIF Promedio`,data:A,borderColor:`#48cae4`,backgroundColor:`rgba(72, 202, 228, 0.2)`}],fill:!0});let M=l.map(e=>{let t=n.filter(t=>t.anio.toString()===e),r=t.reduce((e,t)=>e+(t.tirf||0),0);return t.length?r/t.length:0});h.tirf&&p(h.tirf);let N=e.querySelector(`#chart-tirf`).getContext(`2d`);h.tirf=f(N,{labels:l,datasets:[{label:`TIRF Promedio`,data:M,borderColor:`#9b5de5`,backgroundColor:`rgba(155, 93, 229, 0.2)`}],fill:!0})}function S(e,t){let r=C(t),i=Object.keys(r).sort().reverse(),a=e.querySelector(`#table-resumen tbody`);if(i.length===0){a.innerHTML=`<tr><td colspan="4" style="text-align:center">No hay datos</td></tr>`;return}a.innerHTML=i.map(e=>{let t=r[e],i=t.count>0?t.ltifSum/t.count:0,a=t.count>0?t.tirfSum/t.count:0,o=t.count>0?t.srSum/t.count:0;return`
      <tr>
        <td><strong>${e}</strong></td>
        <td>${n(i)}</td>
        <td>${n(a)}</td>
        <td>${n(o)}</td>
      </tr>
    `}).join(``)}function C(e){return e.reduce((e,t)=>{let n=t.anio||`N/A`;return e[n]||(e[n]={fai:0,mti:0,lti:0,ltifSum:0,tirfSum:0,srSum:0,count:0}),e[n].fai+=t.fai||0,e[n].mti+=t.mti||0,e[n].lti+=t.lti||0,e[n].ltifSum+=t.ltif||0,e[n].tirfSum+=t.tirf||0,e[n].srSum+=t.sr||0,e[n].count+=1,e},{})}function w(e){return e.reduce((e,t)=>{let n=t.mes;return e[n]||(e[n]={fai:0,mti:0,lti:0}),e[n].fai+=t.fai||0,e[n].mti+=t.mti||0,e[n].lti+=t.lti||0,e},{})}export{g as renderDashboard};