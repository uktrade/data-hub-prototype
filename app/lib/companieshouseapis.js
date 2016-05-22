'use strict';

const rp = require('request-promise');
const companiesHouseConfig = require('../../config').companiesHouse;

function search(endpoint, params) {
  const options = {
    url: `${companiesHouseConfig.baseUrl}${endpoint}`,
    qs: params,
    json: true,
    auth: {
      user: companiesHouseConfig.apiKey
    }
  };

  return new Promise(function(fulfill, reject) {
    rp(options)
      .then(fulfill)
      .catch((error) => {
        reject(error);
      });
  });
}

function findCompanies(q) {
  return search('search/companies', {
    q
  });
}

function findCompany(companyNumber) {
  return search(`company/${companyNumber}`, {});
}

function findOfficers(q) {
  return search('search/officers', {
    q
  });
}

module.exports = {
  findCompanies,
  findCompany,
  findOfficers,
};
