'use strict';

const $ = require('jquery');

class RadioHideComponent {

  constructor(element) {
    this.element = $(element);
    this.radio = this.element.find('input[type=radio]');
    this.content = this.element.find('.js-radiohide-content');
    this.radio.on('change', this.updateView);

    this.updateView();
  }

  updateView = () => {

    var value = 'no';
    for (var iPos = 0; iPos < this.radio.length; iPos += 1) {
      if (this.radio[iPos].checked === true) {
        value = this.radio[iPos].value.toLowerCase();
      }
    }

    if (value === 'no') {
      this.content.hide();
    } else {
      this.content.show();
    }
  }

}

exports.RadioHide = {

  el: '.js-radiohide',

  init: function() {
    $(this.el).each((index, element) => {
      new RadioHideComponent(element);
    });
  }
};
