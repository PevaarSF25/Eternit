const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/registroView-HKKl-7X0.js","assets/modal-DKrJSUEn.js","assets/parametricaService-CrC5YH-P.js","assets/formatter-BfxvljpV.js","assets/dashboardView-Ajrh6eKX.js","assets/parametricaView-Cd5OuSb6.js"])))=>i.map(i=>d[i]);
(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{label:`Registro`,icon:`clipboard-list`,hash:`#registro`},{label:`Dashboard`,icon:`bar-chart-2`,hash:`#dashboard`},{label:`Administración`,icon:`building-2`,isCollapse:!0,children:[{label:`Paramétricas`,hash:`#parametricas`}]}],t=!1;function n(){let e=document.getElementById(`sidebar`);if(!e){console.error(`Sidebar: #sidebar container not found`);return}r(e),i(e),a(window.location.hash||`#registro`)}function r(t){t.innerHTML=`
        <!-- Logo Section -->
        <div class="sidebar-header">
            <div class="sidebar-logo">E</div>
            <div class="sidebar-brand">
                <span class="sidebar-brand-name">ETERNIT</span>
                <span class="sidebar-brand-sub">HSE Manager</span>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
            ${e.map(e=>{if(e.isCollapse){let t=e.children.map(e=>`
                <a href="${e.hash}" class="sidebar-nav-subitem" data-hash="${e.hash}">
                    <span class="sidebar-nav-label">${e.label}</span>
                </a>
            `).join(``);return`
                <div class="sidebar-nav-group">
                    <button class="sidebar-nav-item toggle-collapse" data-tooltip="${e.label}">
                        <span class="sidebar-nav-icon">
                            <i data-lucide="${e.icon}"></i>
                        </span>
                        <span class="sidebar-nav-label">${e.label}</span>
                        <span class="sidebar-nav-chevron">
                            <i data-lucide="chevron-down"></i>
                        </span>
                    </button>
                    <div class="sidebar-subnav">
                        ${t}
                    </div>
                </div>
            `}else return`
                <a href="${e.hash}" class="sidebar-nav-item" data-hash="${e.hash}" data-tooltip="${e.label}">
                    <span class="sidebar-nav-icon">
                        <i data-lucide="${e.icon}"></i>
                    </span>
                    <span class="sidebar-nav-label">${e.label}</span>
                </a>
            `}).join(``)}
        </nav>

        <!-- Toggle Button -->
        <div class="sidebar-footer">
            <button id="sidebar-toggle" class="sidebar-toggle">
                <i data-lucide="chevrons-left" class="sidebar-toggle-icon" id="toggle-icon"></i>
                <span class="sidebar-toggle-label">Cerrar</span>
            </button>
        </div>
    `,typeof lucide<`u`&&lucide.createIcons({nodes:[t]})}function i(e){e.addEventListener(`click`,n=>{if(t){t=!1,document.body.classList.remove(`collapsed`),typeof lucide<`u`&&lucide.createIcons({nodes:[e]});return}n.target.closest(`#sidebar-toggle`)&&(t=!t,document.body.classList.toggle(`collapsed`,t));let r=n.target.closest(`.toggle-collapse`);r&&r.closest(`.sidebar-nav-group`).classList.toggle(`open`)})}function a(e){let t=document.getElementById(`sidebar`);if(!t)return;t.querySelectorAll(`.sidebar-nav-item, .sidebar-nav-subitem`).forEach(e=>{e.classList.remove(`active`)});let n=t.querySelector(`[data-hash="${e}"]`);if(n){n.classList.add(`active`);let e=n.closest(`.sidebar-nav-group`);e?(e.classList.add(`open`),e.querySelector(`.sidebar-nav-item`).classList.add(`active-parent`)):t.querySelectorAll(`.active-parent`).forEach(e=>e.classList.remove(`active-parent`))}}var o=[`Dom`,`Lun`,`Mar`,`Mié`,`Jue`,`Vie`,`Sáb`],s=[`Ene`,`Feb`,`Mar`,`Abr`,`May`,`Jun`,`Jul`,`Ago`,`Sep`,`Oct`,`Nov`,`Dic`],c=null;function l(){let e=document.getElementById(`header`);if(!e){console.error(`Header: #header container not found`);return}u(e),f()}function u(e){e.innerHTML=`
        <div class="header-inner" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            padding: 0 var(--space-6);
        ">
            <!-- Left Side: Interactive Breadcrumb -->
            <div class="header-left">
                <a href="#dashboard" class="header-home-btn" title="Ir al Inicio">
                    <i data-lucide="home"></i>
                </a>
                <span class="breadcrumb-separator">/</span>
                <div class="breadcrumb-current-wrapper">
                    <span id="header-breadcrumb" class="breadcrumb-current">Registro de Datos</span>
                </div>
            </div>

            <!-- Right Side: Status HUD, Actions & Profile -->
            <div class="header-right">
                <!-- System Status HUD -->
                <div class="hud-status">
                    <span class="status-pulse-dot"></span>
                    <span class="hud-label">SISTEMA ONLINE</span>
                </div>

                <!-- Interactive Clock Widget -->
                <div id="header-clock" class="header-clock-widget">
                    <i data-lucide="clock"></i>
                    <span id="clock-text">${d(new Date)}</span>
                </div>

                <div class="header-divider"></div>

                <!-- Action Controls -->
                <div class="header-actions">
                    <button class="header-action-btn notification-btn" title="Notificaciones">
                        <i data-lucide="bell"></i>
                        <span class="notification-indicator"></span>
                    </button>
                    <button class="header-action-btn settings-btn" title="Configuraciones Rápidas">
                        <i data-lucide="sliders"></i>
                    </button>
                </div>

                <div class="header-divider"></div>

                <!-- Premium User Profile -->
                <div class="header-user-profile">
                    <div class="avatar-wrapper">
                        <div class="avatar-ring"></div>
                        <div class="avatar-img">SA</div>
                        <span class="user-status-dot"></span>
                    </div>
                    <div class="user-meta">
                        <span class="user-name">Super Admin</span>
                        <span class="user-role">HSE Coordinator</span>
                    </div>
                    <i data-lucide="chevron-down" class="user-menu-chevron"></i>
                </div>
            </div>
        </div>
    `,typeof lucide<`u`&&lucide.createIcons({nodes:[e]})}function d(e){return`${o[e.getDay()]} ${e.getDate()} ${s[e.getMonth()]} ${e.getFullYear()} — ${String(e.getHours()).padStart(2,`0`)}:${String(e.getMinutes()).padStart(2,`0`)}:${String(e.getSeconds()).padStart(2,`0`)}`}function f(){c&&clearInterval(c),c=setInterval(()=>{let e=document.getElementById(`clock-text`);e&&(e.textContent=d(new Date))},1e3)}function p(e){let t=document.getElementById(`header-breadcrumb`);t&&(t.textContent=e)}var m=`modulepreload`,h=function(e){return`/`+e},g={},_=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=h(t,n),t in g)return;g[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:m,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},v={"#registro":{loadView:()=>_(()=>import(`./registroView-HKKl-7X0.js`).then(e=>e.renderRegistro),__vite__mapDeps([0,1,2,3])),title:`Registro de Datos`},"#dashboard":{loadView:()=>_(()=>import(`./dashboardView-Ajrh6eKX.js`).then(e=>e.renderDashboard),__vite__mapDeps([4,2,3])),title:`Dashboard HSE`},"#parametricas":{loadView:()=>_(()=>import(`./parametricaView-Cd5OuSb6.js`).then(e=>e.renderParametricas),__vite__mapDeps([5,1,2])),title:`Configuración Paramétricas`}},y=null;async function b(e){if(!e||!v[e]){e=`#registro`,window.location.hash=e;return}let t=v[e],n=document.getElementById(`main-content`);n.innerHTML=`
    <div class="loading-screen" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--color-text-secondary)">
      <div class="spinner" style="margin-bottom:1rem"></div>
      <p>Cargando vista...</p>
    </div>
  `;try{a(e),p(t.title),y&&typeof y==`function`&&(y(),y=null),y=await(await t.loadView())(n)}catch(e){console.error(`Error loading view:`,e),n.innerHTML=`
      <div class="card" style="border-color:var(--color-danger)">
        <h3 style="color:var(--color-danger)">Error cargando la vista</h3>
        <p>${e.message}</p>
      </div>
    `}}document.addEventListener(`DOMContentLoaded`,()=>{n(),l(),window.addEventListener(`hashchange`,()=>{b(window.location.hash)}),b(window.location.hash)});