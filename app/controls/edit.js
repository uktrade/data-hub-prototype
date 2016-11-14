'use strict';
const {addClass, removeClass, hasClass} = require('../lib/elementstuff');


class Edit {

  constructor(element) {
    this.cacheEls(element);
    this.bindEvents();
    if (hasClass(this.wrapper, 'js-hidden-edit-open')) {
      this.showEditView();
    } else {
      this.showDataView();
    }
  }

  cacheEls(element) {
    this.wrapper = element;
    this.dataView = this.wrapper.querySelector('.js-view-data');
    this.editView = this.wrapper.querySelector('.js-view-edit');
    this.editbutton = this.wrapper.querySelector('.js-button-edit');
    this.cancelButton = this.wrapper.querySelector('.js-button-cancel');
  }

  bindEvents() {
    this.editbutton.addEventListener('click', this.showEditView, false);
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', this.showDataView, false);
    }
  }

  showDataView = (event) => {
    if (event) event.preventDefault();
    addClass(this.editView, 'hidden');
    removeClass(this.dataView, 'hidden');
    document.querySelector('body').scrollIntoView();
  };

  showEditView = (event) => {
    if (event) event.preventDefault();
    removeClass(this.editView, 'hidden');
    addClass(this.dataView, 'hidden');
    this.editView.querySelectorAll('.forms-controls')[0].focus();
  };

}

export default Edit;
