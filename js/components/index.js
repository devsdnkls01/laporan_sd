/**
 * SIM-UI Main Bundle & Component Registry
 * SDN Kalisalak 01 Component Library
 * Unified namespace: window.SIM_UI
 */
(function (global) {
  'use strict';

  const SIM_UI = {
    // Buttons
    button: function (props) {
      return (global.SIM_BUTTONS && global.SIM_BUTTONS.button) ? global.SIM_BUTTONS.button(props) : '';
    },

    // Form Controls
    input: function (props) {
      return (global.SIM_FORMS && global.SIM_FORMS.input) ? global.SIM_FORMS.input(props) : '';
    },
    select: function (props) {
      return (global.SIM_FORMS && global.SIM_FORMS.select) ? global.SIM_FORMS.select(props) : '';
    },
    textarea: function (props) {
      return (global.SIM_FORMS && global.SIM_FORMS.textarea) ? global.SIM_FORMS.textarea(props) : '';
    },
    formGroup: function (props) {
      return (global.SIM_FORMS && global.SIM_FORMS.formGroup) ? global.SIM_FORMS.formGroup(props) : '';
    },
    numberBadge: function (number, type) {
      return (global.SIM_FORMS && global.SIM_FORMS.numberBadge) ? global.SIM_FORMS.numberBadge(number, type) : '';
    },
    dynamicList: function (props) {
      return (global.SIM_FORMS && global.SIM_FORMS.dynamicList) ? global.SIM_FORMS.dynamicList(props) : '';
    },

    // Data Tables
    table: function (props) {
      return (global.SIM_TABLES && global.SIM_TABLES.table) ? global.SIM_TABLES.table(props) : '';
    },

    // Section Cards
    sectionCard: function (props) {
      return (global.SIM_CARDS && global.SIM_CARDS.sectionCard) ? global.SIM_CARDS.sectionCard(props) : '';
    },

    // Modals & Dialogs
    modal: function (props) {
      return (global.SIM_MODALS && global.SIM_MODALS.modal) ? global.SIM_MODALS.modal(props) : '';
    },
    openModal: function (id) {
      if (global.SIM_MODALS && global.SIM_MODALS.openModal) global.SIM_MODALS.openModal(id);
    },
    closeModal: function (id) {
      if (global.SIM_MODALS && global.SIM_MODALS.closeModal) global.SIM_MODALS.closeModal(id);
    },
    confirm: function (props) {
      if (global.SIM_MODALS && global.SIM_MODALS.confirm) return global.SIM_MODALS.confirm(props);
    },
    alert: function (props, title, icon) {
      if (global.SIM_MODALS && global.SIM_MODALS.alert) return global.SIM_MODALS.alert(props, title, icon);
    },
    prompt: function (props) {
      if (global.SIM_MODALS && global.SIM_MODALS.prompt) return global.SIM_MODALS.prompt(props);
    },

    // Feedback, Toast & Loading Overlay
    toast: function (message, variant, duration) {
      if (global.SIM_FEEDBACK && global.SIM_FEEDBACK.toast) global.SIM_FEEDBACK.toast(message, variant, duration);
    },
    badge: function (text, variant) {
      return (global.SIM_FEEDBACK && global.SIM_FEEDBACK.badge) ? global.SIM_FEEDBACK.badge(text, variant) : '';
    },
    showLoading: function (title, desc) {
      if (global.SIM_FEEDBACK && global.SIM_FEEDBACK.showLoading) {
        return global.SIM_FEEDBACK.showLoading(title, desc);
      }
    },
    hideLoading: function () {
      if (global.SIM_FEEDBACK && global.SIM_FEEDBACK.hideLoading) {
        global.SIM_FEEDBACK.hideLoading();
      }
    },

    // Presets
    presets: {
      arkasSatuan: (global.SIM_FORMS && global.SIM_FORMS.presets) ? global.SIM_FORMS.presets.arkasSatuan : []
    },

    // RKT Narratives & Long Texts Component
    rktNarratives: function () {
      return global.RKT_NARRATIVES || null;
    },

    // RKT Tabs Renderers Component
    rktTabs: function () {
      return global.SIM_RKT_TABS || null;
    },

    // Sidebar Navigation Component
    sidebar: function () {
      return global.SIM_SIDEBAR || null;
    },

    // Version
    version: '1.0.0'
  };

  global.SIM_UI = SIM_UI;

})(typeof window !== 'undefined' ? window : global);
