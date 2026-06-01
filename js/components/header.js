/**
 * Header Component
 * Renders the fixed top header with breadcrumb, live clock, and app badge.
 */

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_NOMBRE = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

let clockInterval = null;

/**
 * Initializes the header and renders it into the #header container.
 */
export function initHeader() {
    const header = document.getElementById('header');
    if (!header) {
        console.error('Header: #header container not found');
        return;
    }

    renderHeader(header);
    startClock();
}

/**
 * Renders the header HTML.
 */
function renderHeader(header) {
    header.innerHTML = `
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
                    <span id="clock-text">${formatDateTime(new Date())}</span>
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
    `;

    // Render lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [header] });
    }
}

/**
 * Formats a Date object into the Spanish display format.
 * Example: "Mar 27 May 2026 — 14:30:45"
 * @param {Date} date
 * @returns {string}
 */
function formatDateTime(date) {
    const dia = DIAS_SEMANA[date.getDay()];
    const num = date.getDate();
    const mes = MESES_NOMBRE[date.getMonth()];
    const anio = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dia} ${num} ${mes} ${anio} — ${hh}:${mm}:${ss}`;
}

/**
 * Starts the live clock that updates every second.
 */
function startClock() {
    // Clear any existing interval
    if (clockInterval) clearInterval(clockInterval);

    clockInterval = setInterval(() => {
        const clockText = document.getElementById('clock-text');
        if (clockText) {
            clockText.textContent = formatDateTime(new Date());
        }
    }, 1000);
}

/**
 * Updates the breadcrumb/page title in the header.
 * @param {string} pageTitle - The title to display.
 */
export function updateHeader(pageTitle) {
    const breadcrumb = document.getElementById('header-breadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = pageTitle;
    }
}
