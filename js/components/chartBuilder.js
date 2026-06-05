/**
 * Chart Builder
 * Factory functions for creating themed Chart.js charts.
 * Requires Chart.js 4 loaded via CDN.
 */

const DEFAULT_COLORS = ['#00b4d8', '#06d6a0', '#ef476f', '#ffd166', '#48cae4', '#9b5de5'];

const THEME = {
    gridColor: 'rgba(0,0,0,0.06)',
    textColor: '#64748b',
    fontFamily: "'Inter', sans-serif",
    tooltipBg: 'rgba(30, 41, 59, 0.95)',
    tooltipBorder: 'rgba(0,0,0,0.1)',
    tooltipTitleColor: '#f1f5f9',
    tooltipBodyColor: '#cbd5e1'
};

/**
 * Returns common chart options shared across all chart types.
 */
function baseOptions(customOptions = {}) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 700,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: {
                labels: {
                    color: THEME.textColor,
                    font: { family: THEME.fontFamily, size: 12 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle'
                },
                ...customOptions.legend
            },
            tooltip: {
                backgroundColor: THEME.tooltipBg,
                titleColor: THEME.tooltipTitleColor,
                bodyColor: THEME.tooltipBodyColor,
                borderColor: THEME.tooltipBorder,
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                titleFont: { family: THEME.fontFamily, size: 13, weight: '600' },
                bodyFont: { family: THEME.fontFamily, size: 12 },
                displayColors: true,
                boxPadding: 4,
                ...customOptions.tooltip
            }
        },
        ...customOptions
    };
}

/**
 * Returns common scale options for axes.
 */
function scaleOptions(stacked = false) {
    return {
        x: {
            stacked,
            grid: { color: THEME.gridColor, drawBorder: false },
            ticks: {
                color: THEME.textColor,
                font: { family: THEME.fontFamily, size: 11 }
            }
        },
        y: {
            stacked,
            beginAtZero: true,
            grid: { color: THEME.gridColor, drawBorder: false },
            ticks: {
                color: THEME.textColor,
                font: { family: THEME.fontFamily, size: 11 }
            }
        }
    };
}

/**
 * Creates a bar chart, optionally stacked, with an optional overlay line dataset.
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} config
 * @param {string[]} config.labels - X-axis labels
 * @param {Array} config.datasets - Chart.js dataset objects (may include type:'line')
 * @param {boolean} [config.stacked=false] - Whether bars should be stacked
 * @param {boolean} [config.showLine=false] - Deprecated, use dataset type:'line' instead
 * @returns {Chart} Chart.js instance
 */
export function createBarChart(ctx, { labels, datasets, stacked = false, showLine = false }) {
    const coloredDatasets = datasets.map((ds, i) => ({
        backgroundColor: ds.backgroundColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderColor: ds.borderColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        borderWidth: ds.type === 'line' ? 2 : 0,
        borderRadius: ds.type === 'line' ? 0 : 6,
        tension: 0.4,
        pointRadius: ds.type === 'line' ? 4 : undefined,
        pointBackgroundColor: ds.type === 'line' ? (ds.borderColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length]) : undefined,
        ...ds
    }));

    return new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: coloredDatasets },
        options: {
            ...baseOptions(),
            scales: scaleOptions(stacked)
        }
    });
}

/**
 * Creates a doughnut chart.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config
 * @param {string[]} config.labels
 * @param {number[]} config.data
 * @param {string[]} [config.colors]
 * @returns {Chart}
 */
export function createDoughnutChart(ctx, { labels, data, colors }) {
    const chartColors = colors || DEFAULT_COLORS.slice(0, data.length);

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: chartColors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            ...baseOptions({
                legend: {
                    position: 'bottom'
                }
            }),
            cutout: '65%',
            plugins: {
                ...baseOptions().plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        color: THEME.textColor,
                        font: { family: THEME.fontFamily, size: 12 },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                }
            }
        }
    });
}

/**
 * Creates a line chart with optional fill (area).
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config
 * @param {string[]} config.labels
 * @param {Array} config.datasets
 * @param {boolean} [config.fill=false] - Whether to fill under the lines
 * @returns {Chart}
 */
export function createLineChart(ctx, { labels, datasets, fill = false }) {
    const coloredDatasets = datasets.map((ds, i) => {
        const color = ds.borderColor || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        return {
            borderColor: color,
            backgroundColor: fill ? hexToRgba(color, 0.1) : 'transparent',
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: color,
            pointBorderColor: color,
            fill: fill ? 'origin' : false,
            ...ds
        };
    });

    return new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: coloredDatasets },
        options: {
            ...baseOptions(),
            scales: scaleOptions(false),
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

/**
 * Safely destroys a Chart.js instance.
 * @param {Chart|null} chart - The chart instance to destroy.
 */
export function destroyChart(chart) {
    if (chart && typeof chart.destroy === 'function') {
        try {
            chart.destroy();
        } catch (e) {
            console.warn('Error destroying chart:', e);
        }
    }
}

/**
 * Converts a hex color to rgba string.
 */
function hexToRgba(hex, alpha) {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
