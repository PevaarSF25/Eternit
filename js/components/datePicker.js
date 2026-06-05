/**
 * Custom Material-Style Date Picker
 * Renders a gorgeous calendar modal to select a year, month, and day,
 * and formats the result as YYYY-MM for database compatibility.
 */

import { MESES } from '../models/incidente.js';

const DAYS_SHORT = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MESES_COMPLETOS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function initDatePicker(inputElement, onChangeCallback) {
    if (!inputElement) return;

    // Make read-only so typing doesn't interfere
    inputElement.readOnly = true;
    inputElement.style.cursor = 'pointer';

    // Click handler to open calendar
    inputElement.addEventListener('click', (e) => {
        // If parent fieldset is disabled, do not open
        const fieldset = inputElement.closest('fieldset');
        if (fieldset && fieldset.disabled) return;

        openDatePicker(inputElement, onChangeCallback);
    });
}

function openDatePicker(inputElement, onChangeCallback) {
    // Determine initial date
    let initialDate = new Date();
    if (inputElement.value) {
        const [year, month] = inputElement.value.split('-');
        if (year && month) {
            initialDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
        }
    }

    let selectedYear = initialDate.getFullYear();
    let selectedMonth = initialDate.getMonth();
    let selectedDay = initialDate.getDate();

    let viewingYear = selectedYear;
    let viewingMonth = selectedMonth;

    let viewMode = 'calendar'; // 'calendar' | 'years'

    // Create Modal Overlay
    const overlay = document.createElement('div');
    overlay.className = 'datepicker-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '11000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        fontFamily: "'Inter', sans-serif"
    });

    // Create Dialog Container
    const dialog = document.createElement('div');
    dialog.className = 'datepicker-dialog';
    Object.assign(dialog.style, {
        background: '#ffffff',
        borderRadius: '16px',
        width: '320px',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'modalSlideIn 250ms ease-out'
    });

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    function renderView() {
        dialog.innerHTML = '';

        // 1. Header Block
        const header = document.createElement('div');
        Object.assign(header.style, {
            background: 'var(--accent, #ef4444)',
            padding: '20px 24px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            position: 'relative'
        });

        const selectDateLabel = document.createElement('span');
        selectDateLabel.innerText = 'SELECCIONAR FECHA';
        Object.assign(selectDateLabel.style, {
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '0.8px',
            opacity: '0.8'
        });

        // Formatted Selected Date: e.g. "Lun, 17 Nov"
        const testDate = new Date(selectedYear, selectedMonth, selectedDay);
        const dayName = testDate.toLocaleDateString('es-ES', { weekday: 'short' });
        const monthNameShort = testDate.toLocaleDateString('es-ES', { month: 'short' });
        const bigDateText = document.createElement('h2');
        bigDateText.innerText = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${selectedDay} de ${monthNameShort}`;
        Object.assign(bigDateText.style, {
            margin: '0',
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.2'
        });

        header.appendChild(selectDateLabel);
        header.appendChild(bigDateText);
        dialog.appendChild(header);

        // 2. Content Body
        const body = document.createElement('div');
        Object.assign(body.style, {
            padding: '16px',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            flex: '1'
        });

        if (viewMode === 'calendar') {
            // Navigation Bar: Month dropdown and navigation arrows
            const nav = document.createElement('div');
            Object.assign(nav.style, {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            });

            // Month Year Title Button
            const monthYearBtn = document.createElement('button');
            monthYearBtn.innerHTML = `${MESES_COMPLETOS[viewingMonth]} ${viewingYear} <i data-lucide="chevron-down" style="width:16px;height:16px;display:inline-block;vertical-align:middle;margin-left:4px"></i>`;
            Object.assign(monthYearBtn.style, {
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
            });
            monthYearBtn.addEventListener('click', () => {
                viewMode = 'years';
                renderView();
            });

            // Arrows container
            const arrows = document.createElement('div');
            Object.assign(arrows.style, {
                display: 'flex',
                gap: '8px'
            });

            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i data-lucide="chevron-left" style="width:20px;height:20px;"></i>';
            Object.assign(prevBtn.style, {
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
            });
            prevBtn.addEventListener('click', () => {
                if (viewingMonth === 0) {
                    viewingMonth = 11;
                    viewingYear--;
                } else {
                    viewingMonth--;
                }
                renderView();
            });

            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i data-lucide="chevron-right" style="width:20px;height:20px;"></i>';
            Object.assign(nextBtn.style, {
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
            });
            nextBtn.addEventListener('click', () => {
                if (viewingMonth === 11) {
                    viewingMonth = 0;
                    viewingYear++;
                } else {
                    viewingMonth++;
                }
                renderView();
            });

            arrows.appendChild(prevBtn);
            arrows.appendChild(nextBtn);

            nav.appendChild(monthYearBtn);
            nav.appendChild(arrows);
            body.appendChild(nav);

            // Weekday Headers
            const weekdayRow = document.createElement('div');
            Object.assign(weekdayRow.style, {
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-muted)',
                marginBottom: '8px'
            });
            DAYS_SHORT.forEach(day => {
                const dayCell = document.createElement('div');
                dayCell.innerText = day;
                weekdayRow.appendChild(dayCell);
            });
            body.appendChild(weekdayRow);

            // Days Grid
            const daysGrid = document.createElement('div');
            Object.assign(daysGrid.style, {
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                rowGap: '6px',
                textAlign: 'center'
            });

            // Calculate calendar layout
            const firstDayOfMonth = new Date(viewingYear, viewingMonth, 1).getDay();
            const totalDaysInMonth = new Date(viewingYear, viewingMonth + 1, 0).getDate();

            // Empty cells for alignment
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyCell = document.createElement('div');
                daysGrid.appendChild(emptyCell);
            }

            // Fill active days
            const today = new Date();
            for (let day = 1; day <= totalDaysInMonth; day++) {
                const dayCell = document.createElement('button');
                dayCell.innerText = day;
                Object.assign(dayCell.style, {
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'all 150ms'
                });

                const isSelected = (viewingYear === selectedYear && viewingMonth === selectedMonth && day === selectedDay);
                const isToday = (viewingYear === today.getFullYear() && viewingMonth === today.getMonth() && day === today.getDate());

                if (isSelected) {
                    dayCell.style.background = 'var(--accent, #ef4444)';
                    dayCell.style.color = '#ffffff';
                    dayCell.style.fontWeight = '700';
                } else if (isToday) {
                    dayCell.style.border = '1px solid var(--accent, #ef4444)';
                    dayCell.style.color = 'var(--accent, #ef4444)';
                } else {
                    dayCell.addEventListener('mouseenter', () => {
                        dayCell.style.background = 'var(--bg-hover, #f1f5f9)';
                    });
                    dayCell.addEventListener('mouseleave', () => {
                        dayCell.style.background = 'none';
                    });
                }

                dayCell.addEventListener('click', () => {
                    selectedYear = viewingYear;
                    selectedMonth = viewingMonth;
                    selectedDay = day;
                    renderView();
                });

                daysGrid.appendChild(dayCell);
            }

            body.appendChild(daysGrid);
        } else if (viewMode === 'years') {
            // Render Year selector
            const yearList = document.createElement('div');
            Object.assign(yearList.style, {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                maxHeight: '220px',
                overflowY: 'auto',
                padding: '8px 0'
            });

            const currentYear = new Date().getFullYear();
            for (let yr = currentYear - 10; yr <= currentYear + 10; yr++) {
                const yrBtn = document.createElement('button');
                yrBtn.innerText = yr;
                Object.assign(yrBtn.style, {
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-default)',
                    background: yr === viewingYear ? 'var(--accent)' : 'var(--bg-base)',
                    color: yr === viewingYear ? '#ffffff' : 'var(--text-primary)',
                    fontWeight: yr === viewingYear ? '700' : '500',
                    cursor: 'pointer',
                    fontSize: '13px'
                });

                yrBtn.addEventListener('click', () => {
                    viewingYear = yr;
                    viewMode = 'calendar';
                    renderView();
                });

                yearList.appendChild(yrBtn);
            }
            body.appendChild(yearList);
        }

        // 3. Footer Action Buttons
        const footer = document.createElement('div');
        Object.assign(footer.style, {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '12px 16px',
            borderTop: '1px solid var(--border-light, #f1f5f9)'
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'CANCELAR';
        Object.assign(cancelBtn.style, {
            background: 'none',
            border: 'none',
            color: 'var(--accent, #ef4444)',
            fontWeight: '700',
            fontSize: '13px',
            padding: '8px 12px',
            cursor: 'pointer'
        });
        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });

        const okBtn = document.createElement('button');
        okBtn.innerText = 'ACEPTAR';
        Object.assign(okBtn.style, {
            background: 'none',
            border: 'none',
            color: 'var(--accent, #ef4444)',
            fontWeight: '700',
            fontSize: '13px',
            padding: '8px 12px',
            cursor: 'pointer'
        });
        okBtn.addEventListener('click', () => {
            const formattedMonth = (selectedMonth + 1).toString().padStart(2, '0');
            const resultVal = `${selectedYear}-${formattedMonth}`;
            inputElement.value = resultVal;
            
            // Dispatch input event to notify listeners
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            
            if (onChangeCallback) {
                onChangeCallback(resultVal);
            }
            overlay.remove();
        });

        footer.appendChild(cancelBtn);
        footer.appendChild(okBtn);
        body.appendChild(footer);

        dialog.appendChild(body);

        // Build Lucide icons if any
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ nodes: [dialog] });
        }
    }

    renderView();

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
