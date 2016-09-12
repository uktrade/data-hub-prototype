'use strict';
const rp = require('request-promise');
const config = require('../../config');

function getDitCompany(id) {
  return rp({
    url: `${config.apiRoot}/company/${id}/`,
    json: true
  });
}

function getCHCompany(id) {
  let chOptions = {
    url: `${config.apiRoot}/ch/${id}/`,
    json: true
  };

  return rp(chOptions);
}

function getCompany(id, source) {

  return new Promise((fulfill, reject) => {
    // Get DIT Company
    if (source === 'CH') {
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

module.exports = {getCompany, saveCompany, getDitCompany, getCHCompany};
