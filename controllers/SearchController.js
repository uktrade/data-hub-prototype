'use strict';

const rp = require('request-promise');
const config = require('../config');

const KEY = config.companiesHouseApiKey;
const COMPANY_BASE = config.companySearchUrl;
const OFFICER_BASE = config.officerSearchUrl;

function returnError(res, message) {
  if (!message) {
    message = 'error processing request';
  }
  res.status(500).send({ error: message });
}

function search(req, res, url) {

  // Get the search query
  if (!req.query.hasOwnProperty('q')) {
    returnError(res, 'No query specified');
    return;
  }

  const query = req.query.q;

  const options = {
    url: url,
    qs: { q: query },
    json: true,
    auth: {
      user: KEY
    }
  };

  rp(options)
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      returnError(res, err.message);
    });
}

function findCompany(req, res) {
  search(req, res, COMPANY_BASE);
}

function findPerson(req, res) {
  search(req, res, OFFICER_BASE);
}

module.exports = {
  findCompany,
  findPerson
};
