import { addClass, removeClass } from './utils/classtuff';
import CompanyAutocomplete from './companyautocomplete';

const isUKBasedRadios = document.querySelectorAll('[name="uk_based"]');
const regionFormGroup = document.getElementById('uk_region-wrapper');
const countryElement = document.getElementById('address-country');
const countryWrapper = document.getElementById('address.country-wrapper');
const options = document.querySelectorAll('#business_type option');

let ltdElement;
let plcElement;

for (let option of options) {
  if (option.innerText === 'Private limited company') {
    ltdElement = option;
  } else if (option.innerText === 'Public limited company') {
    plcElement = option;
  }
}

function getSelectedRadio() {
  for (const radio of isUKBasedRadios) {
    if (radio.checked === true) {
      return radio.value.toLocaleLowerCase();
    }
  }
  return null;
}

function setCountry(value) {
  countryElement.value = value;

  if ('createEvent' in document) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    countryElement.dispatchEvent(evt);
  } else {
    countryElement.fireEvent('onchange');
  }
}

function setUKCompany() {
  ltdElement.disabled = true;
  ltdElement.hidden = true;
  plcElement.disabled = true;
  plcElement.hidden = true;
  setCountry('United Kingdom');

  addClass(countryWrapper, 'hidden');
  removeClass(regionFormGroup, 'hidden');
}

function setNoneUKCompany() {
  ltdElement.disabled = false;
  ltdElement.hidden = false;
  plcElement.disabled = false;
  plcElement.hidden = false;

  if (countryElement.value == 'United Kingdom') {
    setCountry('');
  }

  addClass(regionFormGroup, 'hidden');
  removeClass(countryWrapper, 'hidden');
}

function handleCountryChangeUK() {
  const isUkBusiness = getSelectedRadio();

  if (isUkBusiness === 'yes') {
    setUKCompany();
  } else {
    setNoneUKCompany();
  }
}

for (const radio of isUKBasedRadios) {
  radio.addEventListener('click', handleCountryChangeUK);
}


new CompanyAutocomplete(document.getElementById('name'));
