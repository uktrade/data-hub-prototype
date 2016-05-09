'use strict';

const $ = require('jquery');

exports.Edit = {
  el: '.hidden-edit',

  init: function() {
    this.cacheEls();
    this.bindEvents();
    this.showDataView();
    console.log('done');
  },

  cacheEls: function() {
    this.wrapper = $(this.el);
    this.dataView = this.wrapper.find('.data-view');
    this.editView = this.wrapper.find('.edit-view');
    this.editbutton = this.wrapper.find('.edit-button');
    this.cancelButton = this.wrapper.find('.cancel-button');
  },

  bindEvents: function() {
    this.editbutton.on('click', (event) => {
      event.preventDefault();
      this.showEditView();
    });

    this.cancelButton.on('click', (event) => {
      event.preventDefault();
      this.showDataView();
    });
  },

  showDataView: function() {
    this.editView.hide();
    this.dataView.show();
  },

  showEditView: function() {
    this.dataView.hide();
    this.editView.show();
    this.editView.find('.form-control:first').focus();
  }

};

