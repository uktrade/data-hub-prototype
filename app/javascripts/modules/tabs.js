/* If the current page shows errors, set the focus to the error messages */
/* globals require, exports */

'use strict';

const $ = require('jquery');

exports.Tabs = {
  el: '.js-tabs',

  init: function() {
    this.cacheEls();
    this.bindEvents();

    this.toggleTab(this.$tabs.filter('.is-selected'));
  },

  bindEvents: function() {
    this.$tabs.on('click', $.proxy(this.clickTab, this));
  },

  clickTab: function(e) {
    e.preventDefault();
    this.toggleTab($(e.target));
  },

  toggleTab: function($tab) {
    $tab
      .parents('.tabs-nav')
      .find('a')
      .removeClass('is-selected');
    $tab
      .addClass('is-selected');

    this.$panels.hide();

    if ($tab.length < 1) {
      return;
    }

    let activePanelId = $tab.attr('href').split('#')[1];
    $('#' + activePanelId).addClass('is-selected').show();
  },

  cacheEls: function() {
    this.$el = $(this.el);
    this.$tabs = this.$el.find('.tabs-nav a');
    this.$panels = this.$el.find('.tabs-panel');
  }
};
