'use strict';
const rp = require('request-promise');
const authorisedRequest = require( '../lib/authorisedRequest' );
const config = require('../../config');
const moment = require('moment');
const interactionRepository = require('../repository/interactionrepository');
const contactRepository = require('../repository/contactrepository');

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
      promises.push(interactionRepository.getInteraction(interaction.id));
    }

    return Promise.all(promises);
  })
  .then((interactions) => {
    result.interactions = interactions;

    let promises = [];
    for (const contact of result.contacts) {
      promises.push(contactRepository.getContact(contact.id));
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
        .then((ch) => {
          fulfill({
            company_number: id,
            ch,
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

function saveCompany(company) {
  let options = {
    json: true,
    body: company
  };

  if (company.id && company.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/company/${company.id}/`;
    options.method = 'PUT';
  } else {
    options.url = `${config.apiRoot}/company/`;
    options.method = 'POST';
  }

  return rp(options);
}

function archiveCompany(companyId, reason) {

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

  return rp(options);

}

function unarchiveCompany(companyId) {
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

  return rp(options);
}

module.exports = {getCompany, saveCompany, getDitCompany, getCHCompany, archiveCompany, unarchiveCompany};
