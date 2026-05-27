/**
 * Sidebar Navigation Component
 * Renders the collapsible sidebar with menu items and active state management.
 */

const MENU_ITEMS = [
    { label: 'Registro', icon: 'clipboard-list', hash: '#registro' },
    { label: 'Dashboard', icon: 'bar-chart-2', hash: '#dashboard' },
    { label: 'Paramétricas', icon: 'settings', hash: '#parametricas' }
];

let isCollapsed = false;

/**
 * Initializes the sidebar and renders it into the #sidebar container.
 */
export function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        console.error('Sidebar: #sidebar container not found');
        return;
    }

    renderSidebar(sidebar);
    attachEvents(sidebar);

    // Set initial active state
    updateActiveNav(window.location.hash || '#registro');
}

/**
 * Renders the sidebar HTML.
 */
function renderSidebar(sidebar) {
    const menuItemsHtml = MENU_ITEMS.map(item => `
        <a href="${item.hash}" class="sidebar-nav-item" data-hash="${item.hash}" data-tooltip="${item.label}">
            <span class="sidebar-nav-icon">
                <i data-lucide="${item.icon}"></i>
            </span>
            <span class="sidebar-nav-label">${item.label}</span>
        </a>
    `).join('');

    sidebar.innerHTML = `
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
            ${menuItemsHtml}
        </nav>

        <!-- Toggle Button -->
        <div class="sidebar-footer">
            <button id="sidebar-toggle" class="sidebar-toggle">
                <i data-lucide="chevrons-left" class="sidebar-toggle-icon" id="toggle-icon"></i>
                <span class="sidebar-toggle-label">Cerrar</span>
            </button>
        </div>
    `;

    // Render lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [sidebar] });
    }
}

/**
 * Attaches event listeners to the sidebar.
 */
function attachEvents(sidebar) {
    // Toggle collapse
    sidebar.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#sidebar-toggle');
        if (toggleBtn) {
            isCollapsed = !isCollapsed;
            document.body.classList.toggle('collapsed', isCollapsed);
        }
    });

    // Nav item clicks — let the hashchange handler do the work
    sidebar.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Allow default href behavior (hash change)
        });
    });
}

/**
 * Updates which navigation item is visually active.
 * @param {string} hash - The current route hash (e.g., '#registro')
 */
export function updateActiveNav(hash) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.querySelectorAll('.sidebar-nav-item').forEach(item => {
        const itemHash = item.dataset.hash;
        const isActive = itemHash === hash;

        if (isActive) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}
