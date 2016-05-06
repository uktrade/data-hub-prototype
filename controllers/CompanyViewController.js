'use strict';

const _ = require('lodash');
const api = require('../lib/companiesHouseApi');
const contactsData = require('../data/contacts.json');

function get(req, res) {
  let companyNum = req.params.id;
  let contacts = _.shuffle(contactsData);

  if (!companyNum) {
    res.redirect('/');
  }

  api
    .findCompany(companyNum)
    .then(function(result) {
      res.render('company', {
        company: result,
        contacts: _.slice(contacts, 0, 5)
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
