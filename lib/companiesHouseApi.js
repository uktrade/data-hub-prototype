'use strict';

const rp = require('request-promise');
const config = require('../config');

const KEY = config.companiesHouseApiKey;
const COMPANY_BASE = config.companySearchUrl;
const OFFICER_BASE = config.officerSearchUrl;

function search(url, query) {
  const options = {
    url: url,
    qs: { q: query },
    json: true,
    auth: {
      user: KEY
    }
  };

  return new Promise(function(fulfill, reject) {
    if (!query) {
      reject('No query specified');
    }

    rp(options)
      .then(fulfill)
      .catch(reject);
  });
}

function findCompanies(q) {
  return search(COMPANY_BASE, q);
}

function findOfficers(q) {
  return search(OFFICER_BASE, q);
}

module.exports = {
  findCompanies,
  findOfficers
};
