'use strict';

import $ from 'jquery';
const ACTIVECLASS = 'autosuggest__suggestion--active';


class CompanyAutocomplete {

  constructor(element, options) {
    this.sourceField = $(element);
    this.options = options || this.sourceField.data('options');
    this.setupDisplayField();
    this.shown = false;
    this.$menu = $('<ul class="autosuggest__suggestions"></ul>');
    this.item = '<li class="autosuggest__suggestion"><a href="#"></a></li>';
    this.maxItems = 8;
    this.minLength = 1;
    this.listen();
    this.optionsUrl = this.sourceField.data('options-url');
    this.sourceField.parent().css({
      position: 'relative'
    });
    this.displayField.attr('autocomplete', 'off');
    this.indentedSuggestion = $(this.sourceField.parent().find('.indented-info'));
    this.suggestionLink = this.indentedSuggestion.find('.indented-info__link');
    this.suggestion = this.indentedSuggestion.find('.indented-info__description');
  }

  setupDisplayField() {
    this.displayField = this.sourceField.clone();
    this.displayField.attr('id', this.sourceField.attr('id') + '-x').attr('name', '');
    this.displayField.insertAfter(this.sourceField);
    this.sourceField.addClass('hidden');

    let value;

    // Display the value if the list if an object.
    if (this.options && !Array.isArray(this.options)) {
      value = this.options[this.sourceField.val()];
    } else {
      value = this.sourceField.val();
    }
    this.displayField.val(value);
  }

  select() {
    const selectedOption = this.$menu.find(`.${ACTIVECLASS}`);
    const val = selectedOption.attr('data-value');
    const display = selectedOption.text();
    this.sourceField.val(val).change();
    this.displayField.val(display).change();

    const source = selectedOption.attr('data-result_source');
    const id = selectedOption.attr('data-source_id');

    this.getSuggestionDetail(source, id);

    return this.hide();
  }

  getSuggestionDetail(source, id) {
    this.indentedSuggestion.addClass('hidden');
    const xmlhttp = new XMLHttpRequest();
    const showSuggestionDetail = this.showSuggestionDetail;

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        const myDetail = JSON.parse(xmlhttp.responseText);
        showSuggestionDetail(myDetail, source, id);
      }
    };

    xmlhttp.open('GET', `/api/company/${source}/${id}/`, true);
    xmlhttp.send();
  }

  showSuggestionDetail = (company, source, id) => {

    let address = '';
    let title = '';

    if (source === 'DIT') {
      title = company.registered_name;

      if (company.registered_address_1 && company.registered_address_1.length > 0) {
        address = company.registered_address_1 + ',';
      }
      if (company.registered_address_address_2 && company.registered_address_2.length > 0) {
        address += company.registered_address_2 + ',';
      }
      if (company.registered_address_town && company.registered_address_town.length > 0) {
        address += company.registered_address_town + ',';
      }
      if (company.registered_address_postcode && company.registered_address_postcode.length > 0) {
        address += company.registered_address_postcode;
      }
    } else {
      title = company.ch.company_name;
      address = company.ch.sic_code_1 + '<br/>';


      if (company.ch.registered_address_address_1 && company.ch.registered_address_address_1.length > 0) {
        address += company.ch.registered_address_address_1 + ',';
      }
      if (company.ch.registered_address_address_2 && company.ch.registered_address_address_2.length > 0) {
        address += company.ch.registered_address_address_2 + ',';
      }
      if (company.ch.registered_address_town && company.ch.registered_address_town.length > 0) {
        address += company.ch.registered_address_town + ',';
      }

      if (company.ch.registered_address_postcode && company.ch.registered_address_postcode.length > 0) {
        address += company.ch.registered_address_postcode;
      }
    }

    this.suggestionLink
      .attr('href', `/company/${source}/${id}`)
      .text(title);

    this.suggestion.html(address);
    this.indentedSuggestion.removeClass('hidden');
  };

  show() {

    var pos = $.extend({}, this.displayField.position(), {
      height: this.displayField[0].offsetHeight
    });

    this.$menu
      .insertAfter(this.displayField)
      .css({
        top: pos.top + pos.height,
        left: pos.left
      })
      .show();

    this.shown = true;
    return this;
  }

  hide() {
    this.$menu.hide();
    this.shown = false;
    return this;
  }

  lookup() {
    const term = this.term = this.displayField.val();

    const xmlhttp = new XMLHttpRequest();
    const handleAjaxResult = this.handleAjaxResult;

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        const myArr = JSON.parse(xmlhttp.responseText);
        handleAjaxResult(myArr);
      }
    };

    xmlhttp.open('GET', `${this.optionsUrl}${term}`, true);
    xmlhttp.send();
  }

  handleAjaxResult = (result) => {
    if (result.length > 0) {
      result = result.sort((a, b) => { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()); });
      this.render(result).show();
    } else {
      this.hide();
    }
  };

  highlighter = (item) => {
    const term = this.term.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    return item.replace(new RegExp('(' + term + ')', 'ig'), ($1, match) => {
      return '<strong>' + match + '</strong>';
    });
  };

  render(items) {

    let itemMarkup = this.item;
    let highlighter = this.highlighter;

    let suggestionElements = items.slice(0, this.maxItems).map((item) => {
      let suggestionElement = $(itemMarkup)
        .attr('data-result_source', item.result_source)
        .attr('data-source_id', item.source_id);
      suggestionElement.find('a').html(highlighter(item.title));
      return suggestionElement[0];
    });

    suggestionElements[0].className += ' ' + ACTIVECLASS;
    this.$menu.html(suggestionElements);
    return this;
  }

  next() {
    var active = this.$menu.find(`.${ACTIVECLASS}`).removeClass(ACTIVECLASS)
      , next = active.next();

    if (!next.length) {
      next = $(this.$menu.find('li')[0]);
    }

    next.addClass(ACTIVECLASS);
  }

  prev() {
    var active = this.$menu.find(`.${ACTIVECLASS}`).removeClass(ACTIVECLASS)
      , prev = active.prev();

    if (!prev.length) {
      prev = this.$menu.find('li').last();
    }

    prev.addClass(ACTIVECLASS);
  }

  listen() {
    this.displayField
      .on('focus', this.focus)
      .on('blur', this.blur)
      .on('keypress', this.keypress)
      .on('keyup', this.keyup);

    this.sourceField
      .on('change', this.sourceChange);

    if (this.eventSupported('keydown')) {
      this.displayField.on('keydown', this.keydown);
    }

    this.$menu
      .on('click', this.click)
      .on('mouseenter', 'li', this.mouseenter)
      .on('mouseleave', 'li', this.mouseleave);
  }

  eventSupported(eventName) {
    var isSupported = eventName in this.displayField;
    if (!isSupported) {
      this.displayField.setAttribute(eventName, 'return;');
      isSupported = typeof this.displayField[eventName] === 'function';
    }
    return isSupported;
  }

  move = (event) => {
    if (!this.shown) return;

    switch (event.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // escape
        event.preventDefault();
        break;

      case 38: // up arrow
        event.preventDefault();
        this.prev();
        break;

      case 40: // down arrow
        event.preventDefault();
        this.next();
        break;
    }

    event.stopPropagation();
  };

  keydown = (event) => {
    this.suppressKeyPressRepeat = ~$.inArray(event.keyCode, [40, 38, 9, 13, 27]);
    this.move(event);
  };

  keypress = (event) => {
    if (this.suppressKeyPressRepeat) return;
    this.move(event);
  };

  keyup = (event) => {
    switch (event.keyCode) {
      case 40: // down arrow
      case 38: // up arrow
      case 16: // shift
      case 17: // ctrl
      case 18: // alt
        break;

      case 9: // tab
      case 13: // enter
        if (!this.shown) return;
        this.select();
        break;

      case 27: // escape
        if (!this.shown) return;
        this.hide();
        break;

      default:
        this.lookup();
    }

    event.stopPropagation();
    event.preventDefault();
  };

  focus = () => {
    this.focused = true;
  };

  blur = () => {
    this.focused = false;
    if (!this.mousedover && this.shown) this.hide();
    this.sourceField.val(this.displayField.val());
  };

  click = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.select();
    this.displayField.focus();
  };

  mouseenter = (event) => {
    this.mousedover = true;
    this.$menu.find(`.${ACTIVECLASS}`).removeClass(ACTIVECLASS);
    $(event.currentTarget).addClass(ACTIVECLASS);
  };

  mouseleave = () => {
    this.mousedover = false;
    if (!this.focused && this.shown) this.hide();
  };

  sourceChange = () => {
    this.displayField.val(this.sourceField.val());
  }

}

export default CompanyAutocomplete;
