/**
 * DataTable Component
 * Renders sortable data tables with edit/delete action buttons.
 */

/**
 * Creates a data table in the specified container.
 * @param {Object} options
 * @param {string} options.containerId - ID of the container element
 * @param {Array<{key:string, label:string, format?:Function, width?:string}>} options.columns - Column definitions
 * @param {Array<Object>} options.data - Row data
 * @param {Function} [options.onView] - Callback when view button clicked, receives row data
 * @param {Function} [options.onEdit] - Callback when edit button clicked, receives row data
 * @param {Function} [options.onDelete] - Callback when delete button clicked, receives row data
 * @param {Object} [options.footerRow] - Optional data for a summary/footer row
 * @param {string} [options.emptyMessage='No hay registros disponibles'] - Message when no data
 * @returns {{ update: Function, destroy: Function }}
 */
export function createDataTable({
    containerId,
    columns,
    data = [],
    onView,
    onEdit,
    onDelete,
    footerRow = null,
    emptyMessage = 'No hay registros disponibles'
}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`DataTable: container #${containerId} not found`);
        return { update() {}, destroy() {} };
    }

    let currentData = [...data];
    let sortKey = null;
    let sortAsc = true;

    function sortData(key) {
        if (sortKey === key) {
            sortAsc = !sortAsc;
        } else {
            sortKey = key;
            sortAsc = true;
        }
        currentData.sort((a, b) => {
            const valA = a[key] ?? '';
            const valB = b[key] ?? '';
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortAsc ? valA - valB : valB - valA;
            }
            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
        render();
    }

    function getSortIcon(key) {
        if (sortKey !== key) return '<i data-lucide="arrow-up-down" style="width:14px;height:14px;opacity:0.3;"></i>';
        return sortAsc
            ? '<i data-lucide="arrow-up" style="width:14px;height:14px;color:#00b4d8;"></i>'
            : '<i data-lucide="arrow-down" style="width:14px;height:14px;color:#00b4d8;"></i>';
    }

    function render() {
        if (currentData.length === 0) {
            container.innerHTML = `
                <div class="datatable-empty" style="
                    text-align: center;
                    padding: 48px 24px;
                    color: #5a6a7a;
                    font-size: 14px;
                ">
                    <i data-lucide="inbox" style="width:48px;height:48px;margin-bottom:16px;opacity:0.4;"></i>
                    <p style="margin:0;">${emptyMessage}</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [container] });
            return;
        }

        const headerCells = columns.map(col => `
            <th style="
                padding: 12px 16px;
                text-align: left;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                border-bottom: 1px solid var(--border-default);
                cursor: pointer;
                user-select: none;
                white-space: nowrap;
                ${col.width ? `width:${col.width};` : ''}
            " data-sort-key="${col.key}">
                <span style="display:flex;align-items:center;gap:6px;">
                    ${col.label}
                    ${getSortIcon(col.key)}
                </span>
            </th>
        `).join('');
 
        const actionHeader = (onView || onEdit || onDelete) ? `
            <th style="
                padding: 12px 16px;
                text-align: center;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-secondary);
                border-bottom: 1px solid var(--border-default);
                width: 140px;
            ">Acciones</th>
        ` : '';
 
        const rows = currentData.map((row, idx) => {
            const cells = columns.map(col => {
                let value = row[col.key];
                if (col.format && value !== undefined && value !== null) {
                    value = col.format(value, row);
                }
                return `<td style="
                    padding: 12px 16px;
                    font-size: 13px;
                    color: var(--text-primary);
                    border-bottom: 1px solid var(--border-light);
                    white-space: nowrap;
                ">${value ?? '—'}</td>`;
            }).join('');
 
            const actions = (onView || onEdit || onDelete) ? `
                <td style="
                    padding: 12px 16px;
                    text-align: center;
                    border-bottom: 1px solid var(--border-light);
                ">
                    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
                        ${onView ? `<button class="dt-view-btn" data-row-index="${idx}" title="Ver todos los datos" style="
                            background: var(--accent-bg);
                            border: 1px solid var(--border-focus);
                            border-radius: 6px;
                            padding: 6px;
                            cursor: pointer;
                            color: var(--accent);
                            transition: all 200ms;
                            display: flex;
                            align-items: center;
                        "><i data-lucide="eye" style="width:14px;height:14px;"></i></button>` : ''}
                        ${onEdit ? `<button class="dt-edit-btn" data-row-index="${idx}" title="Editar" style="
                            background: rgba(0,180,216,0.1);
                            border: 1px solid rgba(0,180,216,0.2);
                            border-radius: 6px;
                            padding: 6px;
                            cursor: pointer;
                            color: #00b4d8;
                            transition: all 200ms;
                            display: flex;
                            align-items: center;
                        "><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>` : ''}
                        ${onDelete ? `<button class="dt-delete-btn" data-row-index="${idx}" title="Eliminar" style="
                            background: var(--danger-bg);
                            border: 1px solid rgba(239,68,68,0.2);
                            border-radius: 6px;
                            padding: 6px;
                            cursor: pointer;
                            color: var(--danger);
                            transition: all 200ms;
                            display: flex;
                            align-items: center;
                        "><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>` : ''}
                    </div>
                </td>
            ` : '';
 
            return `<tr style="transition: background 200ms;" onmouseenter="this.style.background='var(--bg-hover)'" onmouseleave="this.style.background='transparent'">${cells}${actions}</tr>`;
        }).join('');
 
        let tfootHtml = '';
        if (footerRow && currentData.length > 0) {
            const footerCells = columns.map(col => {
                let value = footerRow[col.key];
                if (col.format && value !== undefined && value !== null) {
                    value = col.format(value, footerRow);
                }
                return `<td style="
                    padding: 12px 16px;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-size: 13px;
                    white-space: nowrap;
                ">${value ?? '—'}</td>`;
            }).join('');
            
            const emptyActionCell = (onView || onEdit || onDelete) ? `<td></td>` : '';
            tfootHtml = `
                <tfoot style="background: var(--accent-bg); border-top: 2px solid var(--accent);">
                    <tr>${footerCells}${emptyActionCell}</tr>
                </tfoot>
            `;
        }
 
        container.innerHTML = `
            <div style="overflow-x:auto;border-radius:12px;border:1px solid var(--border-default);">
                <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;">
                    <thead><tr>${headerCells}${actionHeader}</tr></thead>
                    <tbody>${rows}</tbody>
                    ${tfootHtml}
                </table>
            </div>
        `;

        // Attach sort handlers via event delegation
        container.querySelectorAll('th[data-sort-key]').forEach(th => {
            th.addEventListener('click', () => sortData(th.dataset.sortKey));
        });

        // Attach action handlers via event delegation
        container.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.dt-view-btn');
            if (viewBtn && onView) {
                const idx = parseInt(viewBtn.dataset.rowIndex, 10);
                onView(currentData[idx]);
                return;
            }
            const editBtn = e.target.closest('.dt-edit-btn');
            if (editBtn && onEdit) {
                const idx = parseInt(editBtn.dataset.rowIndex, 10);
                onEdit(currentData[idx]);
                return;
            }
            const deleteBtn = e.target.closest('.dt-delete-btn');
            if (deleteBtn && onDelete) {
                const idx = parseInt(deleteBtn.dataset.rowIndex, 10);
                onDelete(currentData[idx]);
            }
        });

        // Render lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ nodes: [container] });
        }
    }

    // Initial render
    render();

    return {
        /**
         * Updates the table with new data.
         * @param {Array<Object>} newData
         * @param {Object} [newFooterRow]
         */
        update(newData, newFooterRow = null) {
            currentData = [...newData];
            if (newFooterRow !== null) {
                footerRow = newFooterRow;
            }
            if (sortKey) {
                currentData.sort((a, b) => {
                    const valA = a[sortKey] ?? '';
                    const valB = b[sortKey] ?? '';
                    if (typeof valA === 'number' && typeof valB === 'number') {
                        return sortAsc ? valA - valB : valB - valA;
                    }
                    return sortAsc
                        ? String(valA).localeCompare(String(valB))
                        : String(valB).localeCompare(String(valA));
                });
            }
            render();
        },
        /**
         * Destroys the table and clears the container.
         */
        destroy() {
            container.innerHTML = '';
            currentData = [];
        }
    };
}
