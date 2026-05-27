/**
 * Modal Dialog System
 * Provides generic modal and confirm dialog functionality.
 */

let currentModal = null;

/**
 * Shows a modal dialog with customizable content and buttons.
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {string} options.content - HTML content for the modal body
 * @param {Function} [options.onConfirm] - Callback when confirmed
 * @param {Function} [options.onCancel] - Callback when cancelled
 * @param {string} [options.confirmText='Confirmar'] - Confirm button text
 * @param {string} [options.cancelText='Cancelar'] - Cancel button text
 * @returns {Promise<boolean>} Resolves true if confirmed, false if cancelled.
 */
export function showModal({
    title,
    content,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}) {
    // Close any existing modal
    closeModal();

    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            opacity: '0',
            transition: 'opacity 250ms ease'
        });

        overlay.innerHTML = `
            <div class="modal-dialog" style="
                background: #1a2332;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 16px;
                padding: 0;
                min-width: 400px;
                max-width: 520px;
                width: 90%;
                box-shadow: 0 24px 64px rgba(0,0,0,0.5);
                transform: scale(0.85);
                opacity: 0;
                transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease;
            ">
                <div class="modal-header" style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                ">
                    <h3 style="margin:0;color:#e0e6ed;font-size:18px;font-weight:600;">${title}</h3>
                    <button class="modal-close-btn" style="
                        background: none;
                        border: none;
                        color: #8899aa;
                        cursor: pointer;
                        padding: 4px;
                        border-radius: 6px;
                        transition: color 200ms;
                    ">
                        <i data-lucide="x" style="width:20px;height:20px;"></i>
                    </button>
                </div>
                <div class="modal-body" style="
                    padding: 24px;
                    color: #c0c8d4;
                    font-size: 14px;
                    line-height: 1.6;
                ">${content}</div>
                <div class="modal-footer" style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    padding: 16px 24px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                ">
                    <button class="modal-cancel-btn" style="
                        padding: 10px 20px;
                        border-radius: 8px;
                        border: 1px solid rgba(255,255,255,0.1);
                        background: transparent;
                        color: #8899aa;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 200ms;
                        font-family: 'Inter', sans-serif;
                    ">${cancelText}</button>
                    <button class="modal-confirm-btn" style="
                        padding: 10px 20px;
                        border-radius: 8px;
                        border: none;
                        background: linear-gradient(135deg, #00b4d8, #0096c7);
                        color: #fff;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 200ms;
                        font-family: 'Inter', sans-serif;
                    ">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        currentModal = overlay;

        // Render lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ nodes: [overlay] });
        }

        // Animate in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            const dialog = overlay.querySelector('.modal-dialog');
            dialog.style.transform = 'scale(1)';
            dialog.style.opacity = '1';
        });

        function handleClose(confirmed) {
            const dialog = overlay.querySelector('.modal-dialog');
            overlay.style.opacity = '0';
            dialog.style.transform = 'scale(0.85)';
            dialog.style.opacity = '0';

            setTimeout(() => {
                overlay.remove();
                if (currentModal === overlay) currentModal = null;
            }, 250);

            if (confirmed) {
                onConfirm?.();
            } else {
                onCancel?.();
            }
            resolve(confirmed);
        }

        // Event listeners
        overlay.querySelector('.modal-confirm-btn').addEventListener('click', () => handleClose(true));
        overlay.querySelector('.modal-cancel-btn').addEventListener('click', () => handleClose(false));
        overlay.querySelector('.modal-close-btn').addEventListener('click', () => handleClose(false));

        // Close on overlay click (not on dialog)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) handleClose(false);
        });

        // Close on Escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', escHandler);
                handleClose(false);
            }
        };
        document.addEventListener('keydown', escHandler);
    });
}

/**
 * Shows a simplified confirmation dialog.
 * @param {string} title - Dialog title
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} True if confirmed.
 */
export function showConfirmModal(title, message) {
    return showModal({
        title,
        content: `<p style="margin:0;">${message}</p>`,
        confirmText: 'Sí, confirmar',
        cancelText: 'Cancelar'
    });
}

/**
 * Closes any currently open modal.
 */
export function closeModal() {
    if (currentModal) {
        currentModal.remove();
        currentModal = null;
    }
}
