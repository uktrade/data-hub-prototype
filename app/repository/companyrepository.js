'use strict';
const authorisedRequest = require( '../lib/authorisedRequest' );
const config = require('../../config');
const moment = require('moment');
const interactionRepository = require('../repository/interactionrepository');
const contactRepository = require('../repository/contactrepository');
const metadata = require('../lib/metadata');


// Get a company and then go back and get further detail for each company contact
// and interaction, so the company detail page can give the detail required.
function getDitCompany(token, id) {
  let result;

  return authorisedRequest(token, {
    url: `${config.apiRoot}/company/${id}/`,
    json: true
  })
  .then((company) => {
    result = company;

    let promises = [];
    for (const interaction of result.interactions) {
      promises.push(interactionRepository.getInteraction(token, interaction.id));
    }

    return Promise.all(promises);
  })
  .then((interactions) => {
    result.interactions = interactions;

    let promises = [];
    for (const contact of result.contacts) {
      promises.push(contactRepository.getBriefContact(token, contact.id));
    }

    return Promise.all(promises);
  })
  .then((contacts) => {
    result.contacts = contacts;
    return result;
  });
}

function getCHCompany(token, id) {
  return authorisedRequest(token, { url: `${config.apiRoot}/ch-company/${id}/`, json: true });
}

function getCompany(token, id, source) {

  return new Promise((fulfill, reject) => {
    // Get DIT Company
    if (source === 'company_companieshousecompany') {
      getCHCompany(token, id)
        .then((companies_house_data) => {
          fulfill({
            company_number: id,
            companies_house_data,
            contacts: [],
            interactions: []
          });
        })
        .catch((error) => {
          reject(error);
        });

      return;
    }

    getDitCompany(token, id)
      .then((company) => {
        fulfill(company);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function setCHDefaults(token, company) {
  return new Promise((resolve) => {

    if (company.company_number) {
      getCHCompany(token, company.company_number)
        .then((ch) => {

          if (!company.name) company.name = ch.name;
          if (!company.registered_address_1) company.registered_address_1 = ch.registered_address_1;
          if (!company.registered_address_2) company.registered_address_2 = ch.registered_address_2;
          if (!company.registered_address_town) company.registered_address_town = ch.registered_address_town;
          if (!company.registered_address_county) company.registered_address_county = ch.registered_address_county;
          if (!company.registered_address_postcode) company.registered_address_postcode = ch.registered_address_postcode;
          if (!company.registered_address_country) company.registered_address_country = ch.registered_address_country.id;

          company.uk_based = true;

          // Business type
          const businessTypes = metadata.TYPES_OF_BUSINESS;
          for (const businessType of businessTypes) {
            if (businessType.name.toLowerCase() === ch.company_category.toLowerCase()) {
              company.business_type = businessType.id;
            }
          }
          resolve(company);

        });
    } else {
      resolve(company);
    }
  });

}

function saveCompany(token, company) {
  delete company.companies_house_data;
  delete company.contacts;
  delete company.interactions;

  if (company.id && company.id.length > 0) {
    return authorisedRequest(token, {
      url: `${config.apiRoot}/company/${company.id}/`,
      method: 'PUT',
      json: true,
      body: company
    });
  } else {
    return setCHDefaults(token, company)
      .then(parsedCompany => {
        return authorisedRequest(token, {
          url: `${config.apiRoot}/company/`,
          method: 'POST',
          json: true,
          body: parsedCompany
        });
      });
  }
}

function archiveCompany(token, companyId, reason) {

  let options = {
    json: true,
    body: {
      'archived_on': moment().format('YYYY-MM-DD'),
      'archive_reason': reason,
      'archived_by': 'Lee Smith',
    },
    url: `${config.apiRoot}/company/${companyId}/`,
    method: 'PATCH'
  };

  return authorisedRequest(token, options);

}

function unarchiveCompany(token, companyId) {
  let options = {
    json: true,
    body: {
      'archived_on': null,
      'archive_reason': null,
      'archived_by': null,
    },
    url: `${config.apiRoot}/company/${companyId}/`,
    method: 'PATCH'
  };

  return authorisedRequest(token, options);
}

module.exports = {getCompany, saveCompany, getDitCompany, getCHCompany, archiveCompany, unarchiveCompany};
