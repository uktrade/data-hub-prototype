'use strict';

const _ = require('lodash');
const api = require('../lib/companiesHouseApi');
const contactsData = require('../data/contacts.json');
const sicCodes = require('../data/sic-codes.json');

function get(req, res) {
  let companyNum = req.params.id;
  let query = req.query.query;
  let contacts = _.shuffle(contactsData);

  if (!companyNum) {
    res.redirect('/');
  }

  api
    .findCompany(companyNum)
    .then(function(result) {
      res.render('company', {
        query,
        company: result,
        contacts: _.slice(contacts, 0, 5),
        sicLookup: function sicLookup(code) {
          let sicCode = _.find(sicCodes, { code });

          if (!sicCode) {
            return code;
          }
          return `${code} - ${sicCode.description}`;
        }
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
