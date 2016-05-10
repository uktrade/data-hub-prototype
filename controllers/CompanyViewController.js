'use strict';

const _ = require('lodash');
const api = require('../lib/companiesHouseApi');
const contactsData = require('../data/contacts.json');
const interactionsData = require('../data/interactions.json');
const sicCodes = require('../data/sic-codes.json');

let uktiCompanyData = {};
const defaultExtraData = {
  website: '',
  businessDescription: '',
  countryOfInterest: ['Agentina', 'Greece']
};


function get(req, res) {
  let companyNum = req.params.id;
  let query = req.query.query;
  let contacts = _.shuffle(contactsData);

  if (!companyNum) {
    res.redirect('/');
  }

  api
    .findCompany(companyNum)
    .then((company) => {
      return addUktiDataToCompany(company);
    })
    .then((company) => {
      res.render('company', {
        query,
        company: company,
        contacts: _.slice(contacts, 0, 5),
        interactions: _.slice(interactionsData, 0, 5),
        sicLookup: function sicLookup(code) {
          let sicCode = _.find(sicCodes, { code });

          if (!sicCode) {
            return code;
          }
          return `${code} - ${sicCode.description}`;
        }
      });
    })
    .catch((error) => {
      res.render('company', {
        error
      });
    });
}

function post(req, res) {
  let companyNum = req.params.id;

  uktiCompanyData[companyNum] = {
    website: req.body.website,
    businessDescription: req.body.businessDescription,
    countryOfInterest: req.body.countryOfInterest
  };

  let query = req.query.query || '';

  res.redirect(`/companies/${companyNum}?query=${query}`);

}

function addUktiDataToCompany(company) {
  const exportExperience = [
    {
      year: '2012',
      country: 'Arentina'
    },
    {
      year: '2010',
      country: 'Brazil'
    }
  ];
  const extraData = uktiCompanyData[company.company_number] || defaultExtraData;
  return _.extend({exportExperience}, extraData, company)
}

module.exports = {
  get: get,
  post: post
};
