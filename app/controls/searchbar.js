'use strict';

import {addClass, removeClass} from '../lib/elementstuff';

class SearchBar {

  constructor(element) {
    this.element = element;

    this.input = this.element.querySelector('.searchbar__input');
    this.label = this.element.querySelector('.searchbar__label');

    this.bindEvents();
    this.inputBlurHandler();
  }

  bindEvents() {
    this.input.addEventListener('focus', this.inputFocusHandler, false);
    this.input.addEventListener('blur', this.inputBlurHandler, false);
  }

  inputFocusHandler = () => {
    addClass(this.label, 'hidden');
  };

  inputBlurHandler = () => {
    if (this.input.value === '') {
      removeClass(this.label, 'hidden');
    } else {
      addClass(this.label, 'hidden');
    }
  };

}

export default SearchBar;
