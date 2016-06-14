'use strict';

let companyRepository = require('../lib/companyrepository');
const transformErrors = require('../lib/controllerutils').transformErrors;
const SECTOR_OPTIONS = require('../../data/sectors.json');
const REGION_OPTIONS = require('../../data/regions.json');
const ADVISOR_OPTIONS = require('../../data/advisors.json');
const countryKeysValues = require('../../data/countrys.json');

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
  req.check('website', 'Enter the company website address, e.g. http://www.test.com').isURL();
  req.check('region', 'You must provide the region for this company').notEmpty();

  if (req.body.hasOperatingAddress === 'Yes') {
    req.check('operatingAddress_address1', 'Provide the company operating address').notEmpty();
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
    address1: formData.operatingAddress_address1,
    address2: formData.operatingAddress_address2,
    city: formData.operatingAddress_city,
    postcode: formData.operatingAddress_postcode
  };

  delete formData.operatingAddress_address1;
  delete formData.operatingAddress_address1;
  delete formData.operatingAddress_city;
  delete formData.operatingAddress_postcode;

  formData.operatingAddress = address;
}

function applyFormFieldsToCompany(company, formData) {
  return Object.assign({}, company, formData);
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

function populateFormDataWithCompany(company){
  return {
    sectors: company.sectors,
    website: company.website,
    businessDescription: company.businessDescription,
    region: company.region,
    operatingAddress: company.operatingAddress,
    accountManager: company.accountManager,
    exportingMarkets: company.exportingMarkets,
    countryOfInterest: company.countryOfInterest,
    connections: company.connections
  };
}

function get(req, res) {
  let companyNum = req.params.id;
  let query = req.query.query;

  if (!companyNum) {
    res.redirect('/');
  }

  companyRepository.getCompany(companyNum)
    .then((company) => {
      let expandedInteractions = expandInteractions(company);
      let formData;

      if (req.body && Object.keys(req.body).length > 0) {
        formData = req.body;
      } else {
        formData = populateFormDataWithCompany(company);
      }

      const errors = req.validationErrors();

      res.render('company/company', {
        query,
        company,
        expandedInteractions,
        formData,
        SECTOR_OPTIONS,
        REGION_OPTIONS,
        ADVISOR_OPTIONS,
        countrys,
        errors: transformErrors(errors)
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
      let updatedCompany = applyFormFieldsToCompany(currentCompany, req.body);
      companyRepository.updateCompany(updatedCompany);
      res.redirect(`/companies/${companyNum}?query=${query}`);
    });

}

module.exports = { get, post, applyFormFieldsToCompany };


// todo
// in the get method, look for req.body and if it is there, set formData to that
// When you post and it fails then before you would have called the applyform fields method
// call the get method instead, with the req and res
