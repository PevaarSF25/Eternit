/**
 * Toast Notification System
 * Manages transient notifications displayed in the top-right corner.
 */

const TOAST_DURATION = 4000;
const FADE_DURATION = 400;

const TOAST_ICONS = {
    success: 'check-circle',
    error: 'x-circle',
    info: 'info'
};

const TOAST_COLORS = {
    success: { bg: 'rgba(6, 214, 160, 0.15)', border: '#06d6a0', icon: '#06d6a0' },
    error: { bg: 'rgba(239, 71, 111, 0.15)', border: '#ef476f', icon: '#ef476f' },
    info: { bg: 'rgba(0, 180, 216, 0.15)', border: '#00b4d8', icon: '#00b4d8' }
};

/**
 * Ensures the toast container exists in the DOM.
 * @returns {HTMLElement} The toast container element.
 */
function getOrCreateContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    // Always apply styling to ensure correct fixed positioning at top-right
    Object.assign(container.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
    });
    return container;
}

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'} type - The type of toast.
 */
export function showToast(message, type = 'info') {
    const container = getOrCreateContainer();
    const colors = TOAST_COLORS[type] || TOAST_COLORS.info;
    const iconName = TOAST_ICONS[type] || TOAST_ICONS.info;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    Object.assign(toast.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '10px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: '#ffffff',
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif",
        minWidth: '280px',
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        pointerEvents: 'auto',
        opacity: '0',
        transform: 'translateX(40px)',
        transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`
    });

    toast.innerHTML = `
        <i data-lucide="${iconName}" style="width:20px;height:20px;color:${colors.icon};flex-shrink:0;"></i>
        <span style="flex:1;line-height:1.4;">${message}</span>
        <button class="toast-close" style="background:none;border:none;color:#8899aa;cursor:pointer;padding:2px;flex-shrink:0;">
            <i data-lucide="x" style="width:16px;height:16px;"></i>
        </button>
    `;

    container.appendChild(toast);

    // Render lucide icons inside the toast
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [toast] });
    }

    // Trigger entrance animation
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    // Auto-dismiss
    const timer = setTimeout(() => dismissToast(toast), TOAST_DURATION);

    // Cancel auto-dismiss on hover
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => dismissToast(toast), 1500);
    });
}

/**
 * Dismisses a toast with fade-out animation.
 * @param {HTMLElement} toast - The toast element to dismiss.
 */
function dismissToast(toast) {
    if (toast.dataset.dismissing) return;
    toast.dataset.dismissing = 'true';

    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';

    setTimeout(() => {
        toast.remove();
    }, FADE_DURATION);
}
