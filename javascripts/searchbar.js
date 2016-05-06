'use strict';

import {addClass, removeClass} from '../lib/classhelpers';


class SearchBar {

  constructor(element) {
    this.element = document.querySelector(element);

    if (this.element) {
      this.input = this.element.querySelector('.searchbar-main');

      this.input.addEventListener('focus', this.selectInput);
      this.input.addEventListener('blur', this.blurInput);

      if (this.input.value !== '') {
        this.hideLabel();
      }
    }
  }

  hideLabel = () => {
    addClass(this.element, 'searchbar--state-hidelabel');
  }

  showLabel = () => {
    removeClass(this.element, 'searchbar--state-hidelabel');
  }

  selectInput = () => {
    this.hideLabel();
  }

  blurInput = () => {
    if (this.input.value === '') {
      this.showLabel();
    }
  }

}

export default SearchBar;
