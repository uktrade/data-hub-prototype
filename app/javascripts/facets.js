import 'babel-polyfill';
import { addClass, removeClass, toggleClass } from './utils/classtuff';
import { getQueryParam } from './utils/urlstuff';

const term = getQueryParam('term');

class Facets {

  constructor(targetElement, resultSummaryElement) {
    this.initElements(targetElement, resultSummaryElement);
    this.addEventHandlers();
    this.renderFilterList();
  }

  initElements(targetElement, resultSummaryElement) {
    this.element = targetElement;
    this.companyCheckbox = this.element.querySelector('input[value="Company"]');
    this.contactCheckbox = this.element.querySelector('input[value="Contact"]');
    this.resultSummaryElement = resultSummaryElement;
    this.nonCategoryFacetElements = Array.prototype.slice.call(this.element.querySelectorAll('.govuk-option-select'));
    this.nonCategoryFacetElements.splice(0, 1);
    this.statusFacetsElement = this.nonCategoryFacetElements[1];
    this.clearButtons = this.element.querySelectorAll('.clear-filter-js');
    this.collapseButtons = this.element.querySelectorAll('.collapse-filter-js');
  }

  addEventHandlers() {
    this.element.addEventListener('click', this.selectOptionHandler, false);

    for (const clearButton of this.clearButtons) {
      clearButton.addEventListener('click', this.clearFacetSelection);
    }

    for (const collapseButton of this.collapseButtons) {
      collapseButton.addEventListener('click', this.toggleFacet);
    }

  }

  selectOptionHandler = (event) => {
    if (event.target.tagName !== 'INPUT') return;

    this.renderFilterList();
    this.renderSearchSummary();
  };

  renderFilterList() {
    removeClass(this.element, 'hidden');
    const contacts = document.querySelectorAll('.result-list__contact');
    const companies = document.querySelectorAll('.result-list__ch');


    this.hideNoneCategoryFacets();

    if (this.companyCheckbox.checked || this.contactCheckbox.checked) {
      this.showStatusFacets();

      for (const contact of contacts) {
        addClass(contact, 'hidden');
      }
      for (const company of companies) {
        addClass(company, 'hidden');
      }

      if (this.companyCheckbox.checked) {
        for (const company of companies) {
          removeClass(company, 'hidden');
        }
      }

      if (this.contactCheckbox.checked) {
        for (const contact of contacts) {
          removeClass(contact, 'hidden');
        }
      }
    }

    if (!this.companyCheckbox.checked && !this.contactCheckbox.checked) {
      this.clearStatusOptions();

      for (const contact of contacts) {
        removeClass(contact, 'hidden');
      }
      for (const company of companies) {
        removeClass(company, 'hidden');
      }
    }

    if (this.companyCheckbox.checked) {
      this.showCompanyFacets();
    } else {
      this.clearNoneStatusOptions();
    }

  }

  clearNoneStatusOptions() {
    for (var pos = 0; pos < this.nonCategoryFacetElements.length; pos += 1) {
      if (pos !== 1) {
        const checkedInputs = this.nonCategoryFacetElements[pos].querySelectorAll('input[type=checkbox]:checked');
        for (const input of checkedInputs) {
          input.checked = false;
        }
      }
    }
  }

  clearStatusOptions() {
    const checkedInputs = this.statusFacetsElement.querySelectorAll('input[type=checkbox]:checked');
    for (const input of checkedInputs) {
      input.checked = false;
    }
  }

  renderSearchSummary() {
    let summary;

    if (this.companyCheckbox.checked && !this.contactCheckbox.checked) {
      summary = `<strong><span class="result-summary--result-count">10</span> company</strong> records found containing <strong>${term}</strong>`;
    } else if (!this.companyCheckbox.checked && this.contactCheckbox.checked) {
      summary = `<strong><span class="result-summary--result-count">10</span> contact</strong> records found containing <strong>${term}</strong> `;
    } else {
      summary = `<strong><span class="result-summary--result-count">10</span></strong> records found containing <strong>${term}</strong> `;
    }
    var subTitle = '';

    var checkedFilters = this.element.querySelectorAll('input[type=checkbox]:checked');
    for (let filter of checkedFilters) {
      subTitle += filter.parentElement.innerText + ', ';
    }

    if (subTitle.length > 0) {
      summary += ` which are <strong>${subTitle.substring(0, subTitle.length - 2)}</strong>.`;
    }

    this.resultSummaryElement.innerHTML = summary;
  }

  showCompanyFacets() {
    for (const facetElement of this.nonCategoryFacetElements) {
      removeClass(facetElement, 'hidden');
    }
  }

  showStatusFacets() {
    removeClass(this.statusFacetsElement, 'hidden');
  }

  hideNoneCategoryFacets() {
    for (const facetElement of this.nonCategoryFacetElements) {
      addClass(facetElement, 'hidden');
    }
  }

  clearFacetSelection = (event) => {
    const facetWrapper = event.target.parentElement.parentElement.parentElement;
    const checkedInputs = facetWrapper.querySelectorAll('input[type=checkbox]:checked');
    for (const input of checkedInputs) {
      input.checked = false;
    }
  };

  toggleFacet = (event) => {
    const facetWrapper = event.target.parentElement.parentElement.parentElement;
    toggleClass(facetWrapper, 'collapse');

    const control = facetWrapper.querySelector('.collapse-filter-js');
    toggleClass(control, 'fa-chevron-up');
    toggleClass(control, 'fa-chevron-down');
  }

}

document.addEventListener(
  'DOMContentLoaded',
  function() {
    new Facets(document.getElementById('facets'), document.getElementById('result-summary'));
  },
  false
);

