/* globals require, exports */
'use strict';

const $ = require('jquery');

exports.SearchBar = {

  el: '.js-searchbar',

  init: function() {
    this.cacheEls();
    this.bindEvents();

    this.inputBlurHandler();
  },

  cacheEls: function() {
    var element = $(this.el);
    this.input = element.find('.searchbar__input');
    this.label = element.find('.searchbar__label');
  },

  bindEvents: function() {
    this.input.on('focus', $.proxy(this.inputFocusHandler, this));
    this.input.on('blur', $.proxy(this.inputBlurHandler, this));
  },

  inputFocusHandler: function() {
    this.label.hide();
  },

  inputBlurHandler: function() {
    if (this.input.val() === '') {
      this.label.show();
    } else {
      this.label.hide();
    }
  }

};
