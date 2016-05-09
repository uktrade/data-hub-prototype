'use strict';

const $ = require('jquery');
exports.AddAnother = {

  el: '.add-another',

  init: function() {
    this.cacheEls();
    this.bindEvents();
  },

  cacheEls: function() {
    this.element = $(this.el);
    const fieldGroups = this.element.find('.form-group');

    this.fieldCount = fieldGroups.length;
    this.firstGroup = fieldGroups.filter(':first');
    this.originalField = this.firstGroup.find('input.form-control');
    this.fieldName = this.originalField.attr('name');
    this.buttonElement = this.element.find('.add-another-button');
  },

  bindEvents: function() {
    this.buttonElement.on('click', $.proxy(this.addField, this));
  },

  addField: function(event) {
    event.preventDefault();

    this.fieldCount += 1;

    // Create a new copy of the field
    const newFormGroup = this.firstGroup.clone();
    const newInput = newFormGroup.find(`input[name='${this.fieldName}']`);

    // Give the field a new ID and the label point to it too
    const newId = `${this.fieldName}-${this.fieldCount}`;
    newInput.val('').attr('id', newId);
    newFormGroup.find('label').attr('for', newId);

    const lastField = this.element.find(`input[name='${this.fieldName}']`)
      .filter(':last')
      .parent();

    newFormGroup.insertAfter(lastField);

    newInput.focus();
  }

};
