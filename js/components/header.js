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
            padding: 0 32px;
        ">
            <!-- Breadcrumb / Page Title -->
            <div class="header-left" style="display:flex;align-items:center;gap:12px;">
                <i data-lucide="home" style="width:16px;height:16px;color:#5a6a7a;"></i>
                <span style="color:#5a6a7a;font-size:14px;">/</span>
                <span id="header-breadcrumb" style="
                    color: #e0e6ed;
                    font-size: 15px;
                    font-weight: 600;
                ">Registro de Datos</span>
            </div>

            <!-- Right Side: Clock + Badge -->
            <div class="header-right" style="display:flex;align-items:center;gap:24px;">
                <!-- Live Clock -->
                <div id="header-clock" style="
                    color: #8899aa;
                    font-size: 13px;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    <i data-lucide="clock" style="width:15px;height:15px;"></i>
                    <span id="clock-text">${formatDateTime(new Date())}</span>
                </div>

                <!-- App Badge -->
                <div class="header-badge" style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 8px;
                    background: rgba(0, 180, 216, 0.1);
                    border: 1px solid rgba(0, 180, 216, 0.2);
                ">
                    <i data-lucide="shield-check" style="width:16px;height:16px;color:#00b4d8;"></i>
                    <span style="
                        color: #00b4d8;
                        font-size: 13px;
                        font-weight: 600;
                        letter-spacing: 0.3px;
                    ">Eternit HSE</span>
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
