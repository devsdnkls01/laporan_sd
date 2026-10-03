/**
 * SIM-UI Buttons Component
 * SDN Kalisalak 01 Component Engine
 */
(function (global) {
  'use strict';

  function createButtonHtml(props = {}) {
    const {
      text = '',
      icon = '',
      variant = 'primary', // primary, success, danger, outline, outline-danger, secondary, ghost
      size = 'md',        // xs, sm, md, lg
      onClick = '',
      title = '',
      id = '',
      type = 'button',
      disabled = false,
      style = '',
      className = ''
    } = props;

    const iconHtml = icon ? (global.SIM_CORE ? global.SIM_CORE.getIcon(icon) || icon : icon) : '';
    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames(
      'sim-btn',
      `sim-btn-${variant}`,
      `sim-btn-${size}`,
      className
    ) : `sim-btn sim-btn-${variant} sim-btn-${size} ${className}`;

    const idAttr = id ? `id="${id}"` : '';
    const titleAttr = title ? `title="${global.SIM_CORE ? global.SIM_CORE.escapeHtml(title) : title}"` : '';
    const clickAttr = onClick ? `onclick="${onClick}"` : '';
    const styleAttr = style ? `style="${style}"` : '';
    const disabledAttr = disabled ? 'disabled' : '';

    return `
      <button ${idAttr} type="${type}" class="${fullClass}" ${titleAttr} ${clickAttr} ${styleAttr} ${disabledAttr}>
        ${iconHtml ? `<span class="sim-btn-icon" style="display: inline-flex; align-items: center;">${iconHtml}</span>` : ''}
        ${text ? `<span>${global.SIM_CORE ? global.SIM_CORE.escapeHtml(text) : text}</span>` : ''}
      </button>
    `.trim();
  }

  global.SIM_BUTTONS = {
    button: createButtonHtml
  };

})(typeof window !== 'undefined' ? window : global);
