'use strict';
const rp = require('request-promise');
const config = require('../../config');
const moment = require('moment');

function getDitCompany(id) {
  return rp({
    url: `${config.apiRoot}/company/${id}/`,
    json: true
  });
}

function getCHCompany(id) {
  return rp({ url: `${config.apiRoot}/ch-company/${id}/`, json: true });
}

function getCompany(id, source) {

  return new Promise((fulfill, reject) => {
    // Get DIT Company
    if (source === 'company_companieshousecompany') {
      getCHCompany(id)
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

    getDitCompany(id)
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
