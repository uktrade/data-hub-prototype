'use strict';

let companyRepository = require('../lib/companyrepository');

function get(req, res) {
  let companyNum = req.params.id;
  let query = req.query.query;

  if (!companyNum) {
    res.redirect('/');
  }

  companyRepository.getCompany(companyNum)
    .then((company) => {
      res.render('company/company', {query, company, searchSearch: true});
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
    .then((newCompany) => {
      return companyRepository.updateCompany(newCompany);
    })
    .then(() => {
      res.redirect(`/companies/${companyNum}?query=${query}`);
    })
    .catch((error) => {
      res.render('company/company', {
        query: query,
        company: error.company || {},
        searchSearch: true,
        errors: error.errors || {}
      });
    });

}


function applyFormFieldsToCompany(company, formData) {

  return new Promise((fulfill) => {

    let newCompany = Object.assign({}, company);

    if (Array.isArray(formData.sectors)) {
      newCompany.sectors = formData.sectors;
    } else {
      newCompany.sectors = [formData.sectors];
    }

    newCompany.website = formData.website;
    newCompany.businessDescription = formData.businessDescription;
    newCompany.region = formData.region;

    if (formData.hasOperatingAddress === 'Yes') {
      newCompany.operatingAddress = {
        address1: formData.operatingAddress_address1,
        address2: formData.operatingAddress_aaddress2,
        city: formData.operatingAddress_city,
        postcode: formData.operatingAddress_postcode
      };
    } else if (newCompany.operatingAddress) {
      delete newCompany.operatingAddress;
    }

    if (formData.hasAccountManager === 'Yes' && formData.accountManager != '') {
      newCompany.accountManager = formData.accountManager;
    } else if (newCompany.accountManager) delete newCompany.accountManager;

    newCompany.currentlyExporting = formData.currentlyExporting === 'Yes';

    if (Array.isArray(formData.countryOfInterest)) {
      newCompany.countryOfInterest = formData.countryOfInterest;
    } else {
      newCompany.countryOfInterest = [formData.countryOfInterest];
    }

    if (Array.isArray(formData.connections)) {
      newCompany.connections = formData.connections;
    } else {
      newCompany.connections = [formData.connections];
    }

    fulfill(newCompany);

  });

}


module.exports = {
  get: get,
  post: post,
  applyFormFieldsToCompany: applyFormFieldsToCompany,
};
