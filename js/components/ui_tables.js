/**
 * SIM-UI Data Tables Component
 * SDN Kalisalak 01 Component Engine
 */
(function (global) {
  'use strict';

  function createTableHtml(props = {}) {
    const {
      id = '',
      columns = [],
      data = [],
      className = '',
      style = '',
      emptyMessage = 'Belum ada data'
    } = props;

    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames('sim-table', className) : `sim-table ${className}`;
    const idAttr = id ? `id="${id}"` : '';
    const styleAttr = style ? `style="${style}"` : '';

    // Generate table headers
    const thsHtml = columns.map(col => {
      const widthStyle = col.width ? `width: ${col.width}; min-width: ${col.width};` : '';
      const alignClass = col.align === 'center' ? 'sim-table-center' : (col.align === 'right' ? 'sim-table-right' : '');
      return `<th class="${alignClass}" style="${widthStyle}">${global.SIM_CORE ? global.SIM_CORE.escapeHtml(col.label) : col.label}</th>`;
    }).join('');

    // Generate table rows
    let rowsHtml = '';
    if (!data || data.length === 0) {
      rowsHtml = `<tr><td colspan="${columns.length}" class="sim-table-center" style="padding: 1.5rem; color: #64748b;">${emptyMessage}</td></tr>`;
    } else {
      rowsHtml = data.map((row, idx) => {
        const tdsHtml = columns.map(col => {
          const alignClass = col.align === 'center' ? 'sim-table-center' : (col.align === 'right' ? 'sim-table-right' : '');
          const colKey = col.key;
          const val = row[colKey] !== undefined ? row[colKey] : '';

          // Cell rendering based on type
          if (col.render && typeof col.render === 'function') {
            return `<td class="${alignClass}">${col.render(row, idx, col)}</td>`;
          }

          if (col.type === 'index' || col.type === 'number-badge') {
            return `<td class="sim-table-center">${idx + 1}</td>`;
          }

          if (col.type === 'input-text') {
            const changeHandler = col.onChange ? col.onChange(idx, colKey) : '';
            return `<td class="${alignClass}">
              <input type="text" class="sim-cell-input ${alignClass}" value="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(val) : val}" onchange="${changeHandler}">
            </td>`;
          }

          if (col.type === 'input-number') {
            const changeHandler = col.onChange ? col.onChange(idx, colKey) : '';
            const minAttr = col.min !== undefined ? `min="${col.min}"` : '';
            return `<td class="${alignClass}">
              <input type="number" class="sim-cell-input sim-table-center" value="${val}" ${minAttr} onchange="${changeHandler}">
            </td>`;
          }

          if (col.type === 'select') {
            const changeHandler = col.onChange ? col.onChange(idx, colKey) : '';
            const opts = col.options || [];
            let allOpts = [...opts];
            const curVal = String(val || '').trim();
            if (curVal && !allOpts.some(o => (typeof o === 'object' ? o.value : o).toLowerCase() === curVal.toLowerCase())) {
              allOpts.unshift(curVal);
            }
            const optsHtml = allOpts.map(o => {
              const oVal = typeof o === 'object' ? o.value : o;
              const oLabel = typeof o === 'object' ? o.label : o;
              const sel = String(oVal).toLowerCase() === curVal.toLowerCase() ? 'selected' : '';
              return `<option value="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(oVal) : oVal}" ${sel}>${global.SIM_CORE ? global.SIM_CORE.escapeHtml(oLabel) : oLabel}</option>`;
            }).join('');

            return `<td class="${alignClass}">
              <select class="sim-cell-select" onchange="${changeHandler}">
                ${optsHtml}
              </select>
            </td>`;
          }

          if (col.type === 'currency-input') {
            const changeHandler = col.onChange ? col.onChange(idx, colKey) : '';
            return `<td class="${alignClass}">
              <input type="text" class="sim-cell-input sim-table-right" value="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(val) : val}" onchange="${changeHandler}">
            </td>`;
          }

          if (col.type === 'readonly-currency') {
            return `<td class="sim-table-center" style="font-weight: 700; color: var(--primary); white-space: nowrap;">
              Rp ${val}
            </td>`;
          }

          if (col.type === 'badge') {
            const badgeVariant = col.badgeVariant ? col.badgeVariant(val, row) : 'blue';
            return `<td class="sim-table-center">
              <span class="sim-badge-pill sim-badge-${badgeVariant}">${global.SIM_CORE ? global.SIM_CORE.escapeHtml(val) : val}</span>
            </td>`;
          }

          if (col.type === 'actions' || col.type === 'delete') {
            const deleteHandler = col.onDelete ? col.onDelete(idx, row) : '';
            return `<td class="sim-table-center">
              <button type="button" class="sim-btn-trash" title="Hapus baris ini" onclick="${deleteHandler}">🗑️</button>
            </td>`;
          }

          // Default text
          const boldStyle = col.bold ? 'font-weight: 700;' : '';
          return `<td class="${alignClass}" style="${boldStyle}">${global.SIM_CORE ? global.SIM_CORE.escapeHtml(val) : val}</td>`;
        }).join('');

        return `<tr>${tdsHtml}</tr>`;
      }).join('');
    }

    return `
      <div class="sim-table-wrap">
        <table ${idAttr} class="${fullClass}" ${styleAttr}>
          <thead>
            <tr>${thsHtml}</tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `.trim();
  }

  global.SIM_TABLES = {
    table: createTableHtml
  };

})(typeof window !== 'undefined' ? window : global);
