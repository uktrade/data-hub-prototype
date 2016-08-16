'use strict';

let companyRepository = require('../lib/companyrepository');
const transformErrors = require('../lib/controllerutils').transformErrors;
const SECTOR_OPTIONS = require('../../data/sectors.json');
const REGION_OPTIONS = require('../../data/regions.json');
const ADVISOR_OPTIONS = require('../../data/advisors.json');
const countryKeysValues = require('../../data/countrys.json');
const searchService = require('../lib/searchservice');

const EMPLOYEE_OPTIONS = [
  '1 to 9',
  '10 to 49',
  '50 to 249',
  '250 to 499',
  '500+'
];
const TURNOVER_OPTIONS = [
  '£0 to £1.34M',
  '£1.34M to £6.7M',
  '£6.7M to £33.5M',
  '£33.5M +'
];

let countrys = [];
for (let country in countryKeysValues) {
  countrys.push(countryKeysValues[country]);
}

function sanitizeForm(req) {
  req.sanitize('sectors').trimArray();
  req.sanitize('exportingMarkets').trimArray();
  req.sanitize('countryOfInterest').trimArray();
  req.sanitize('connections').trimArray();
}

function validateForm(req) {

  req.check('sectors', 'You must provide at least one sector').hasOneOrMoreValues();
  req.check('region', 'You must provide the region for this company').notEmpty();

  if (req.body.useCompaniesHouseAddress === 'No') {
    req.check('operatingAddress.country', 'Provide the company operating address').notEmpty();

    if (req.body['operatingAddress.country'] && req.body['operatingAddress.country'].toLocaleLowerCase() === 'united kingdom') {
      req.check('operatingAddress.address1', 'Provide the company operating address').notEmpty();
      req.check('operatingAddress.city', 'Provide the company operating address').notEmpty();
    }
  }

  if (req.body.hasAccountManager === 'Yes') {
    req.check('accountManager', 'Enter the name of the UKTI Account manager for this company').notEmpty();
  }

  if (req.body.isCurrentlyExporting === 'Yes') {
    req.check('exportingMarkets', 'Provide at least one value for current exporting markets.').hasOneOrMoreValues();
  }

  return transformErrors(req.validationErrors());

}

function convertAddress(formData) {
  let address = {
    address1: formData['operatingAddress.address1'],
    address2: formData['operatingAddress.address2'],
    city: formData['operatingAddress.city'],
    county: formData['operatingAddress.county'],
    postcode: formData['operatingAddress.postcode'],
    country: formData['operatingAddress.country']
  };

  delete formData['operatingAddress.address1'];
  delete formData['operatingAddress.address2'];
  delete formData['operatingAddress.city'];
  delete formData['operatingAddress.county'];
  delete formData['operatingAddress.postcode'];
  delete formData['operatingAddress.country'];

  formData.operatingAddress = address;
}

function expandInteractions(company) {

  if (!company.interactions) {
    return null;
  }

  return company.interactions.map((interaction) => {
    let contact = company.contacts.find((companyContact) => companyContact.id === interaction.contactId);
    return Object.assign({}, interaction, { contact });
  });

}

function transformAddressErrors(convertedErrors) {
  if (convertedErrors && convertedErrors.hasOwnProperty('operatingAddress.country') ||
    convertedErrors && convertedErrors.hasOwnProperty('operatingAddress.address1') ||
    convertedErrors && convertedErrors.hasOwnProperty('operatingAddress.city')) {

    convertedErrors.tradingAddress = {
      message: 'Incomplete address'
    };

    if (convertedErrors['operatingAddress.country']) {
      convertedErrors.tradingAddress.country = convertedErrors['operatingAddress.country'];
      delete convertedErrors['operatingAddress.country'];
    }

    if (convertedErrors['operatingAddress.address1']) {
      convertedErrors.tradingAddress.address1 = convertedErrors['operatingAddress.address1'];
      delete convertedErrors['operatingAddress.address1'];
    }

    if (convertedErrors['operatingAddress.city']) {
      convertedErrors.tradingAddress.city = convertedErrors['operatingAddress.city'];
      delete convertedErrors['operatingAddress.city'];
    }
  }
}

function get(req, res) {
  let companyId = req.params.id;
  let query = req.query.query;

  if (!companyId) {
    res.redirect('/');
  }

  companyRepository.getCompany(companyId)
    .then((company) => {
      let expandedInteractions = expandInteractions(company);
      let formData;

      if (req.body && Object.keys(req.body).length > 0) {
        formData = req.body;
      } else {
        formData = Object.assign({}, company);
      }

      const errors = req.validationErrors();
      let convertedErrors = transformErrors(errors);
      transformAddressErrors(convertedErrors);

      res.render('company/company', {
        query,
        company,
        expandedInteractions,
        formData,
        SECTOR_OPTIONS,
        REGION_OPTIONS,
        ADVISOR_OPTIONS,
        EMPLOYEE_OPTIONS,
        TURNOVER_OPTIONS,
        countrys,
        errors: convertedErrors
      });
    })
    .catch((error) => {
      res.render('error', {error});
    });
}

function post(req, res) {
  let companyNum = req.params.id;
  let query = req.query.query;

  sanitizeForm(req);
  let errors = validateForm(req);
  convertAddress(req.body);

  if (errors) {
    get(req, res);
    return;
  }

  companyRepository.getCompany(companyNum)
    .then((currentCompany) => {
      let updatedCompany = Object.assign({}, currentCompany, req.body);
      updatedCompany.uktidata = true;
      companyRepository.updateCompany(updatedCompany);
      searchService.removeCHRecord(updatedCompany);
      searchService.indexCHRecord(updatedCompany);
      res.redirect(`/companies/${companyNum}?query=${query}`);
    });

}

module.exports = { get, post };
