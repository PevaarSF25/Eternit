/**
 * DataTable Component
 * Renders sortable data tables with client-side pagination and edit/delete action buttons.
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
 * @param {boolean} [options.disableSorting=false] - Disable sorting
 * @param {number} [options.pageSize=50] - Number of items per page
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
    emptyMessage = 'No hay registros disponibles',
    disableSorting = false,
    pageSize = 50
}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`DataTable: container #${containerId} not found`);
        return { update() {}, destroy() {} };
    }

    let currentData = [...data];
    let sortKey = null;
    let sortAsc = true;
    let currentPage = 1;

    // Disable sorting if requested or if there are subtotal rows
    const shouldSort = !disableSorting && !currentData.some(row => row.isSubtotal === true);

    function sortData(key) {
        if (!shouldSort) return;
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
        currentPage = 1; // Reset to page 1 on sort
        render();
    }

    function getSortIcon(key) {
        if (!shouldSort) return '';
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

        // Re-evaluate shouldSort based on the current data
        const activeShouldSort = !disableSorting && !currentData.some(row => row.isSubtotal === true);

        // Paginate data
        const totalItems = currentData.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        // Safety check current page boundary
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        const paginatedData = currentData.slice(startIndex, endIndex);

        const headerCells = columns.map(col => `
            <th style="
                padding: 8px 10px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                color: var(--text-secondary);
                border-bottom: 1px solid var(--border-default);
                ${activeShouldSort ? 'cursor: pointer; user-select: none;' : ''}
                white-space: nowrap;
                ${col.width ? `width:${col.width};` : ''}
            " ${activeShouldSort ? `data-sort-key="${col.key}"` : ''}>
                <span style="display:flex;align-items:center;gap:4px;">
                    ${col.label}
                    ${activeShouldSort ? getSortIcon(col.key) : ''}
                </span>
            </th>
        `).join('');

        const actionHeader = (onView || onEdit || onDelete) ? `
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
        ` : '';

        const rows = paginatedData.map((row, idx) => {
            const isSubtotal = row.isSubtotal === true;
            // The global data index corresponding to this page row
            const globalIdx = startIndex + idx;

            const cells = columns.map(col => {
                let value = row[col.key];
                if (col.format && value !== undefined && value !== null) {
                    value = col.format(value, row);
                }
                
                // Bold font for subtotal rows
                const cellWeight = isSubtotal ? '700' : '500';
                const cellColor = isSubtotal ? 'var(--text-primary)' : 'var(--text-secondary)';
                const borderBottom = isSubtotal ? '2px solid var(--border-default)' : '1px solid var(--border-light)';
                
                return `<td style="
                    padding: 8px 10px;
                    font-size: 12px;
                    font-weight: ${cellWeight};
                    color: ${cellColor};
                    border-bottom: ${borderBottom};
                    white-space: nowrap;
                ">${value ?? '—'}</td>`;
            }).join('');

            const actions = (onView || onEdit || onDelete) ? `
                <td style="
                    padding: 8px 10px;
                    text-align: center;
                    border-bottom: ${isSubtotal ? '2px solid var(--border-default)' : '1px solid var(--border-light)'};
                ">
                    ${isSubtotal ? '' : `
                    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
                        ${onView ? `<button class="dt-view-btn" data-global-idx="${globalIdx}" title="Ver todos los datos" style="
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
                        ${onEdit ? `<button class="dt-edit-btn" data-global-idx="${globalIdx}" title="Editar" style="
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
                        ${onDelete ? `<button class="dt-delete-btn" data-global-idx="${globalIdx}" title="Eliminar" style="
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
                    `}
                </td>
            ` : '';

            const rowStyle = isSubtotal 
                ? 'background-color: rgba(148, 163, 184, 0.08); font-weight: bold;' 
                : 'transition: background 200ms;';
            const mouseEvents = isSubtotal 
                ? '' 
                : 'onmouseenter="this.style.background=\'var(--bg-hover)\'" onmouseleave="this.style.background=\'transparent\'"';
                
            return `<tr style="${rowStyle}" ${mouseEvents}>${cells}${actions}</tr>`;
        }).join('');

        let tfootHtml = '';
        if (footerRow && currentData.length > 0) {
            const footerCells = columns.map(col => {
                let value = footerRow[col.key];
                if (col.format && value !== undefined && value !== null) {
                    value = col.format(value, footerRow);
                }
                return `<td style="
                    padding: 8px 10px;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-size: 12px;
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

        // Generate pagination controls
        const paginationControls = totalPages > 1 ? `
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
                    Mostrando <strong>${startIndex + 1}</strong> a <strong>${endIndex}</strong> de <strong>${totalItems}</strong> registros
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-prev-page btn btn-secondary" ${currentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'}>
                        Anterior
                    </button>
                    <span style="display: flex; align-items: center; padding: 0 8px; font-weight: 500;">
                        Pág. ${currentPage} de ${totalPages}
                    </span>
                    <button class="btn-next-page btn btn-secondary" ${currentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="cursor: pointer;"'}>
                        Siguiente
                    </button>
                </div>
            </div>
        ` : '';

        container.innerHTML = `
            <div style="overflow-x:auto; border-radius:12px; border:1px solid var(--border-default); background-color: var(--bg-surface);">
                <table style="width:100%; border-collapse:collapse; font-family:'Inter',sans-serif;">
                    <thead><tr>${headerCells}${actionHeader}</tr></thead>
                    <tbody>${rows}</tbody>
                    ${tfootHtml}
                </table>
                ${paginationControls}
            </div>
        `;

        // Attach Lucide icons to current container only
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ nodes: [container] });
        }
    }

    // Single click listener attached to container using event delegation
    const clickHandler = (e) => {
        // 1. Sort handler
        const th = e.target.closest('th[data-sort-key]');
        if (th && shouldSort) {
            sortData(th.dataset.sortKey);
            return;
        }

        // 2. View action
        const viewBtn = e.target.closest('.dt-view-btn');
        if (viewBtn && onView) {
            const idx = parseInt(viewBtn.dataset.globalIdx, 10);
            onView(currentData[idx]);
            return;
        }

        // 3. Edit action
        const editBtn = e.target.closest('.dt-edit-btn');
        if (editBtn && onEdit) {
            const idx = parseInt(editBtn.dataset.globalIdx, 10);
            onEdit(currentData[idx]);
            return;
        }

        // 4. Delete action
        const deleteBtn = e.target.closest('.dt-delete-btn');
        if (deleteBtn && onDelete) {
            const idx = parseInt(deleteBtn.dataset.globalIdx, 10);
            onDelete(currentData[idx]);
            return;
        }

        // 5. Prev Page
        const prevBtn = e.target.closest('.btn-prev-page');
        if (prevBtn && currentPage > 1) {
            currentPage--;
            render();
            return;
        }

        // 6. Next Page
        const nextBtn = e.target.closest('.btn-next-page');
        const totalPages = Math.ceil(currentData.length / pageSize);
        if (nextBtn && currentPage < totalPages) {
            currentPage++;
            render();
        }
    };

    container.addEventListener('click', clickHandler);

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
            currentPage = 1; // Reset to page 1 on update
            render();
        },
        /**
         * Destroys the table and clears the container.
         */
        destroy() {
            container.removeEventListener('click', clickHandler);
            container.innerHTML = '';
            currentData = [];
        }
    };
}
