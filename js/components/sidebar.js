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
        <a href="${item.hash}" class="sidebar-nav-item" data-hash="${item.hash}" style="
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 20px;
            color: #8899aa;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            border-radius: 10px;
            margin: 2px 12px;
            transition: all 200ms ease;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
        ">
            <span class="nav-icon" style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 22px;
                flex-shrink: 0;
            ">
                <i data-lucide="${item.icon}" style="width:20px;height:20px;"></i>
            </span>
            <span class="nav-label" style="transition: opacity 200ms ease;">${item.label}</span>
        </a>
    `).join('');

    sidebar.innerHTML = `
        <div class="sidebar-inner" style="
            display: flex;
            flex-direction: column;
            height: 100%;
        ">
            <!-- Logo Section -->
            <div class="sidebar-brand" style="
                padding: 24px 20px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.06);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 12px;
                overflow: hidden;
                white-space: nowrap;
            ">
                <div class="brand-icon" style="
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #00b4d8, #0077b6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 16px;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -0.5px;
                ">E</div>
                <div class="brand-text">
                    <div style="
                        font-size: 16px;
                        font-weight: 700;
                        color: #e0e6ed;
                        letter-spacing: 1.5px;
                        line-height: 1.2;
                    ">ETERNIT</div>
                    <div style="
                        font-size: 11px;
                        color: #5a6a7a;
                        font-weight: 400;
                    ">HSE Manager</div>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="sidebar-nav" style="
                flex: 1;
                padding: 8px 0;
                display: flex;
                flex-direction: column;
                gap: 2px;
            ">
                ${menuItemsHtml}
            </nav>

            <!-- Toggle Button -->
            <div class="sidebar-footer" style="
                padding: 16px;
                border-top: 1px solid rgba(255,255,255,0.06);
            ">
                <button id="sidebar-toggle" style="
                    width: 100%;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                    color: #8899aa;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 13px;
                    font-family: 'Inter', sans-serif;
                    transition: all 200ms;
                ">
                    <i data-lucide="chevrons-left" id="toggle-icon" style="width:18px;height:18px;transition:transform 300ms;"></i>
                    <span class="toggle-label" style="transition: opacity 200ms;">Colapsar</span>
                </button>
            </div>
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
            document.body.classList.toggle('sidebar-collapsed', isCollapsed);

            const icon = document.getElementById('toggle-icon');
            if (icon) {
                icon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
            }

            // Update toggle label
            const toggleLabel = sidebar.querySelector('.toggle-label');
            if (toggleLabel) {
                toggleLabel.textContent = isCollapsed ? '' : 'Colapsar';
            }
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
            item.style.background = 'rgba(0, 180, 216, 0.1)';
            item.style.color = '#00b4d8';
            item.style.borderLeft = '3px solid #00b4d8';
            item.style.paddingLeft = '17px';
        } else {
            item.style.background = 'transparent';
            item.style.color = '#8899aa';
            item.style.borderLeft = '3px solid transparent';
            item.style.paddingLeft = '17px';
        }
    });
}
