import { addClass, removeClass } from './utils/classtuff';
import CompanyAutocomplete from './companyautocomplete';


const isUKBasedRadios = document.querySelectorAll('[name="uk_based"]');
const regionFormGroup = document.getElementById('region-wrapper');
const ltdElement = document.querySelector('[value="Private limited company"]');
const plcElement = document.querySelector('[value="Public limited company"]');
const countryElement = document.getElementById('registered_address-country');
const countryWrapper = document.getElementById('registered_address.country-wrapper');

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

handleCountryChangeUK();

new CompanyAutocomplete(document.getElementById('registered_name'));
