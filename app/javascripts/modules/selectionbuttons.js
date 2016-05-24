/* globals require, exports */
'use strict';

const $ = require('jquery');

exports.SelectionButtons = {

  el: '.form-group__checkbox-group :radio',

  init: function() {
    this.selectedClass = 'selected';
    this.focusedClass = 'focused';
    this.$elms = $(this.el);

    this.selector = this.el;
    this.setInitialState($(this.el));

    this.addEvents();
  },

  addEvents: function() {
    if (typeof this.$elms !== 'undefined') {
      this.addElementLevelEvents();
    } else {
      this.addDocumentLevelEvents();
    }
  },

  setInitialState: function($elms) {
    $elms.each(function(idx, elm) {
      var $elm = $(elm);

      if ($elm.is(':checked')) {
        this.markSelected($elm);
      }
    }.bind(this));
  },

  markFocused: function($elm, state) {
    if (state === 'focused') {
      $elm.parent('label').addClass(this.focusedClass);
    } else {
      $elm.parent('label').removeClass(this.focusedClass);
    }
  },

  markSelected: function($elm) {
    var radioName;

    if ($elm.attr('type') === 'radio') {
      radioName = $elm.attr('name');
      $($elm[0].form).find('input[name="' + radioName + '"]')
        .parent('label')
        .removeClass(this.selectedClass);
      $elm.parent('label').addClass(this.selectedClass);
    } else if ($elm.is(':checked')) {
        $elm.parent('label').addClass(this.selectedClass);
      } else {
        $elm.parent('label').removeClass(this.selectedClass);
      }
  },

  addElementLevelEvents: function() {
    this.clickHandler = this.getClickHandler();
    this.focusHandler = this.getFocusHandler({ 'level': 'element' });

    this.$elms
      .on('click', this.clickHandler)
      .on('focus blur', this.focusHandler);
  },

  addDocumentLevelEvents: function() {
    this.clickHandler = this.getClickHandler();
    this.focusHandler = this.getFocusHandler({ 'level': 'document' });

    $(document)
      .on('click', this.selector, this.clickHandler)
      .on('focus blur', this.selector, this.focusHandler);
  },

  getClickHandler: function() {
    return function(e) {
      this.markSelected($(e.target));
    }.bind(this);
  },

  getFocusHandler: function(opts) {
    var focusEvent = (opts.level === 'document') ? 'focusin' : 'focus';

    return function(e) {
      var state = (e.type === focusEvent) ? 'focused' : 'blurred';

      this.markFocused($(e.target), state);
    }.bind(this);
  },

  destroy: function() {
    if (typeof this.selector !== 'undefined') {
      $(document)
        .off('click', this.selector, this.clickHandler)
        .off('focus blur', this.selector, this.focusHandler);
    } else {
      this.$elms
        .off('click', this.clickHandler)
        .off('focus blur', this.focusHandler);
    }
  }

};
