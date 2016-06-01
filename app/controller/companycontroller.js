'use strict';

let companyRepository = require('../lib/companyrepository');

function clearEmptyLists(formData) {

  let keys = Object.keys(formData);

  for (let key of keys) {
    if (Array.isArray(formData[key])) {
      formData[key] = formData[key].filter((item) => item.length > 0);
    }
  }

}

function applyFormFieldsToCompany(company, formData) {
  return new Promise((fulfill, reject) => {

    let updatedCompany = Object.assign({}, company);
    let errors = {};

    clearEmptyLists(formData);

    if (!formData.sectors || formData.sectors.length === 0) {
      errors.sectors = 'You must provide at least one sector for this company';
      updatedCompany.sectors = [];
    } else if (Array.isArray(formData.sectors)) {
      updatedCompany.sectors = formData.sectors;
    } else {
      updatedCompany.sectors = [formData.sectors];
    }

    if (!formData.website || formData.website.length === 0) {
      errors.website = 'Please provide the url for the company website.';
    } else {
      updatedCompany.website = formData.website;
    }

    updatedCompany.businessDescription = formData.businessDescription;

    if (!formData.region || formData.region.length === 0) {
      errors.region = 'Enter the correct region for the company';
    } else {
      updatedCompany.region = formData.region;
    }

    if (formData.hasOperatingAddress === 'Yes') {
      if (!formData.operatingAddress_address1 || formData.operatingAddress_address1.length === 0) {
        errors.operatingAddress_address1 = 'Provide the company operating address';
        updatedCompany.operatingAddress_address1 = '';
      } else {
        updatedCompany.operatingAddress = {
          address1: formData.operatingAddress_address1,
          address2: formData.operatingAddress_aaddress2,
          city: formData.operatingAddress_city,
          postcode: formData.operatingAddress_postcode
        };
      }
    } else if (updatedCompany.operatingAddress) {
      delete updatedCompany.operatingAddress;
    }

    if (formData.hasAccountManager === 'Yes') {
      if (!formData.accountManager || formData.accountManager.length === 0) {
        errors.accountManager = 'Enter the name of the UKTI Account manager for this compamy';
      }
      updatedCompany.accountManager = formData.accountManager;
    } else if (updatedCompany.accountManager) delete updatedCompany.accountManager;

    if (formData.isCurrentlyExporting == 'Yes') {
      if (!formData.exportingMarkets || formData.exportingMarkets.length === 0) {
        errors.exportingMarkets = 'Provide at least one value or current exporting markets.';
      } else if (Array.isArray(formData.exportingMarkets)) {
        updatedCompany.exportingMarkets = formData.exportingMarkets;
      } else {
        updatedCompany.exportingMarkets = [formData.exportingMarkets];
      }
    } else {
      delete updatedCompany.exportingMarkets;
    }

    if (Array.isArray(formData.countryOfInterest)) {
      updatedCompany.countryOfInterest = formData.countryOfInterest;
    } else {
      updatedCompany.countryOfInterest = [formData.countryOfInterest];
    }

    if (Array.isArray(formData.connections)) {
      updatedCompany.connections = formData.connections;
    } else {
      updatedCompany.connections = [formData.connections];
    }

    if (Object.keys(errors).length > 0) {
      reject({updatedCompany, errors});
    } else {
      fulfill({updatedCompany});
    }

  });
}

function get(req, res) {
  let companyNum = req.params.id;
  let query = req.query.query;

  if (!companyNum) {
    res.redirect('/');
  }

  companyRepository.getCompany(companyNum)
    .then((company) => {
      res.render('company/company', {query, company});
    })
    .catch((error) => {
      res.render('error', {error});
    });

}

function post(req, res) {
  let companyNum = req.params.id;
  let data = req.body;
  let query = req.query.query || '';

  companyRepository.getCompany(companyNum)
    .then((currentCompany) => {
      return applyFormFieldsToCompany(currentCompany, data);
    })
    .then(({updatedCompany}) => {
      return companyRepository.updateCompany(updatedCompany);
    })
    .then(() => {
      res.redirect(`/companies/${companyNum}?query=${query}`);
    })
    .catch(({updatedCompany, errors}) => {
      res.render('company/company', {
        query: query,
        company: updatedCompany || {},
        errors: errors || {}
      });
    });

}

module.exports = { get, post, applyFormFieldsToCompany };
