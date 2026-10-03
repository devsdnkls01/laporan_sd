/**
 * SIM-UI Form Controls & Inputs Component
 * SDN Kalisalak 01 Component Engine
 */
(function (global) {
  'use strict';

  // Standard preset lists for educational administration
  const ARKAS_SATUAN_LIST = [
    'Kegiatan', 'Paket', 'Eksemplar', 'Unit', 'Lembar', 'Bulan', 'Rim',
    'Orang', 'Set', 'Buah', 'Pcs', 'Box', 'Dus', 'Meter', 'Tahun', 'Hari', 'Kali'
  ];

  function createInputHtml(props = {}) {
    const {
      type = 'text',
      value = '',
      placeholder = '',
      onChange = '',
      onInput = '',
      id = '',
      name = '',
      disabled = false,
      min = null,
      max = null,
      step = null,
      style = '',
      className = '',
      align = 'left' // left, center, right
    } = props;

    const alignClass = align === 'center' ? 'sim-table-center' : (align === 'right' ? 'sim-table-right' : '');
    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames('sim-input', alignClass, className) : `sim-input ${alignClass} ${className}`;

    const idAttr = id ? `id="${id}"` : '';
    const nameAttr = name ? `name="${name}"` : '';
    const placeholderAttr = placeholder ? `placeholder="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(placeholder) : placeholder}"` : '';
    const changeAttr = onChange ? `onchange="${onChange}"` : '';
    const inputAttr = onInput ? `oninput="${onInput}"` : '';
    const styleAttr = style ? `style="${style}"` : '';
    const minAttr = min !== null ? `min="${min}"` : '';
    const maxAttr = max !== null ? `max="${max}"` : '';
    const stepAttr = step !== null ? `step="${step}"` : '';
    const valAttr = `value="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(value) : value}"`;
    const disabledAttr = disabled ? 'disabled' : '';

    return `<input type="${type}" ${idAttr} ${nameAttr} class="${fullClass}" ${valAttr} ${placeholderAttr} ${changeAttr} ${inputAttr} ${minAttr} ${maxAttr} ${stepAttr} ${styleAttr} ${disabledAttr}>`;
  }

  function createSelectHtml(props = {}) {
    const {
      value = '',
      options = [],
      onChange = '',
      id = '',
      name = '',
      disabled = false,
      style = '',
      className = '',
      placeholder = ''
    } = props;

    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames('sim-select', className) : `sim-select ${className}`;
    const idAttr = id ? `id="${id}"` : '';
    const nameAttr = name ? `name="${name}"` : '';
    const changeAttr = onChange ? `onchange="${onChange}"` : '';
    const styleAttr = style ? `style="${style}"` : '';
    const disabledAttr = disabled ? 'disabled' : '';

    const curVal = String(value || '').trim();
    let finalOptions = [...options];

    // Ensure custom existing value is preserved if not in preset list
    if (curVal && !finalOptions.some(opt => (typeof opt === 'object' ? opt.value : opt).toLowerCase() === curVal.toLowerCase())) {
      finalOptions.unshift(curVal);
    }

    const optionsHtml = finalOptions.map(opt => {
      const optVal = typeof opt === 'object' ? opt.value : opt;
      const optLabel = typeof opt === 'object' ? opt.label : opt;
      const isSelected = String(optVal).toLowerCase() === curVal.toLowerCase() ? 'selected' : '';
      return `<option value="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(optVal) : optVal}" ${isSelected}>${global.SIM_CORE ? global.SIM_CORE.escapeHtml(optLabel) : optLabel}</option>`;
    }).join('');

    const placeholderHtml = placeholder ? `<option value="" disabled ${!curVal ? 'selected' : ''}>${placeholder}</option>` : '';

    return `
      <select ${idAttr} ${nameAttr} class="${fullClass}" ${changeAttr} ${styleAttr} ${disabledAttr}>
        ${placeholderHtml}
        ${optionsHtml}
      </select>
    `.trim();
  }

  function createTextareaHtml(props = {}) {
    const {
      value = '',
      rows = 4,
      placeholder = '',
      onChange = '',
      onInput = '',
      id = '',
      name = '',
      disabled = false,
      style = '',
      className = ''
    } = props;

    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames('sim-textarea', className) : `sim-textarea ${className}`;
    const idAttr = id ? `id="${id}"` : '';
    const nameAttr = name ? `name="${name}"` : '';
    const placeholderAttr = placeholder ? `placeholder="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(placeholder) : placeholder}"` : '';
    const changeAttr = onChange ? `onchange="${onChange}"` : '';
    const inputAttr = onInput ? `oninput="${onInput}"` : '';
    const styleAttr = style ? `style="${style}"` : '';
    const disabledAttr = disabled ? 'disabled' : '';

    return `<textarea ${idAttr} ${nameAttr} rows="${rows}" class="${fullClass}" ${placeholderAttr} ${changeAttr} ${inputAttr} ${styleAttr} ${disabledAttr}>${global.SIM_CORE ? global.SIM_CORE.escapeHtml(value) : value}</textarea>`;
  }

  function createFormGroupHtml(props = {}) {
    const {
      label = '',
      hint = '',
      content = '',
      style = '',
      className = ''
    } = props;

    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames('sim-form-group', className) : `sim-form-group ${className}`;
    const styleAttr = style ? `style="${style}"` : '';

    return `
      <div class="${fullClass}" ${styleAttr}>
        ${label ? `
          <label class="sim-label">
            <span>${global.SIM_CORE ? global.SIM_CORE.escapeHtml(label) : label}</span>
            ${hint ? `<span class="sim-label-hint">${global.SIM_CORE ? global.SIM_CORE.escapeHtml(hint) : hint}</span>` : ''}
          </label>
        ` : ''}
        ${content}
      </div>
    `.trim();
  }

  function createNumberBadgeHtml(number, type = 'square') {
    return `<span class="sim-cell-no ${type === 'circle' ? 'style="border-radius: 50%;"' : ''}">${number}</span>`;
  }

  function createDynamicListHtml(props = {}) {
    const {
      id = '',
      title = '',
      hint = '',
      badgeText = '',
      badgeColor = 'blue', // blue, green, amber, purple, red
      items = [],
      placeholder = 'Tuliskan isi butir...',
      addButtonText = 'Tambah Butir',
      onUpdateItem = (idx) => '',
      onAddItem = '',
      onRemoveItem = (idx) => '',
      rows = 2,
      style = '',
      className = '',
      introHtml = ''
    } = props;

    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames('sim-dynamic-list-card', className) : `sim-dynamic-list-card ${className}`;
    const idAttr = id ? `id="${id}"` : '';
    const styleAttr = style ? `style="${style}"` : '';

    const addBtnHtml = onAddItem ? (
      global.SIM_BUTTONS ? global.SIM_BUTTONS.button({
        text: addButtonText,
        icon: 'plus',
        variant: 'outline',
        size: 'sm',
        onClick: onAddItem
      }) : `<button type="button" class="sim-btn sim-btn-outline sim-btn-sm" onclick="${onAddItem}">➕ ${addButtonText}</button>`
    ) : '';

    const itemsCount = Array.isArray(items) ? items.length : 0;
    const finalBadgeText = badgeText || `${itemsCount} Butir`;

    let itemsHtml = '';
    if (!items || items.length === 0) {
      itemsHtml = `<div class="sim-dynamic-empty">Belum ada butir data. Silakan klik tombol <strong>"+ ${addButtonText}"</strong> di atas untuk menambahkan.</div>`;
    } else {
      itemsHtml = items.map((item, idx) => {
        const updateAttr = typeof onUpdateItem === 'function' ? onUpdateItem(idx) : '';
        const removeAttr = typeof onRemoveItem === 'function' ? onRemoveItem(idx) : '';
        return `
          <div class="sim-dynamic-item">
            <span class="sim-item-number sim-number-${badgeColor}">${idx + 1}</span>
            <textarea rows="${rows}" class="sim-item-input" placeholder="${placeholder} (Butir ke-${idx + 1})..." oninput="${updateAttr}">${global.SIM_CORE ? global.SIM_CORE.escapeHtml(item) : item}</textarea>
            ${onRemoveItem ? `<button type="button" class="sim-item-delete" title="Hapus butir ke-${idx + 1}" onclick="${removeAttr}">🗑️</button>` : ''}
          </div>
        `;
      }).join('');
    }

    return `
      <div ${idAttr} class="${fullClass}" ${styleAttr}>
        <div class="sim-dynamic-list-header">
          <div class="sim-dynamic-list-title-group">
            ${title ? `<h4 class="sim-dynamic-list-title">${title}</h4>` : ''}
            <span class="sim-badge-pill sim-badge-${badgeColor}">${finalBadgeText}</span>
            ${hint ? `<span class="sim-dynamic-list-hint">${global.SIM_CORE ? global.SIM_CORE.escapeHtml(hint) : hint}</span>` : ''}
          </div>
          ${addBtnHtml}
        </div>
        ${introHtml ? `<div class="sim-dynamic-list-intro" style="margin-bottom: 0.75rem;">${introHtml}</div>` : ''}
        <div class="sim-dynamic-list-items">
          ${itemsHtml}
        </div>
      </div>
    `.trim();
  }

  global.SIM_FORMS = {
    input: createInputHtml,
    select: createSelectHtml,
    textarea: createTextareaHtml,
    formGroup: createFormGroupHtml,
    numberBadge: createNumberBadgeHtml,
    dynamicList: createDynamicListHtml,
    presets: {
      arkasSatuan: ARKAS_SATUAN_LIST
    }
  };

})(typeof window !== 'undefined' ? window : global);
