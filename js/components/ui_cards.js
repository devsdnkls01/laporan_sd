/**
 * SIM-UI Section Card Component
 * SDN Kalisalak 01 Component Engine
 */
(function (global) {
  'use strict';

  function createSectionCardHtml(props = {}) {
    const {
      id = '',
      badge = '',
      badgeColor = 'blue', // blue, green, purple, amber, red
      title = '',
      description = '',
      actions = [],        // array of button HTML strings or single HTML string
      content = '',
      className = '',
      style = ''
    } = props;

    const fullClass = global.SIM_CORE ? global.SIM_CORE.classNames('sim-card', className) : `sim-card ${className}`;
    const idAttr = id ? `id="${id}"` : '';
    const styleAttr = style ? `style="${style}"` : '';

    const actionsHtml = Array.isArray(actions) ? actions.join('') : (actions || '');

    return `
      <div ${idAttr} class="${fullClass}" ${styleAttr}>
        <div class="sim-card-header">
          <div class="sim-card-title-group">
            ${badge ? `<span class="sim-badge-pill sim-badge-${badgeColor}">${global.SIM_CORE ? global.SIM_CORE.escapeHtml(badge) : badge}</span>` : ''}
            ${title ? `<h3 class="sim-card-title">${title}</h3>` : ''}
            ${description ? `<p class="sim-card-desc">${description}</p>` : ''}
          </div>
          ${actionsHtml ? `<div class="sim-card-actions">${actionsHtml}</div>` : ''}
        </div>
        <div class="sim-card-body">
          ${content}
        </div>
      </div>
    `.trim();
  }

  global.SIM_CARDS = {
    sectionCard: createSectionCardHtml
  };

})(typeof window !== 'undefined' ? window : global);
