'use strict';

const api = require('../lib/companiesHouseApi');
let companiesData = require('../data/companies.json');

function get(req, res) {
  let companyNum = req.params.id;

  if (!companyNum) {
    res.redirect('/');
  }

  api
    .findCompany(companyNum)
    .then(function(result) {
      res.render('company', {
        company: result
      });
    })
    .catch(function(error) {
      res.render('company', {
        error
      });
    });
}

module.exports = {
  get: get
};
