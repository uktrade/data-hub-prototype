/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();

const companyRepository = require('../repository/companyrepository');
const controllerUtils = require('../lib/controllerutils');

const SECTOR_OPTIONS = require('../../data/sectors.json');
const REGION_OPTIONS = require('../../data/regions.json');
const ADVISOR_OPTIONS = require('../../data/advisors.json');
const countryKeysValues = require('../../data/countrys.json');

const EMPLOYEE_OPTIONS = [
  '1 to 9',
  '10 to 49',
  '50 to 249',
  '250 to 499',
  '500+'
];
const TURNOVER_OPTIONS = [
  '£0 to £1.34M',
  '£1.34M to £6.7M',
  '£6.7M to £33.5M',
  '£33.5M +'
];
const TYPES_OF_BUSINESS = [
  'Business partnership',
  'Private limited company',
  'Public limited company',
  'Sole trader'
];

let countrys = [];
for (let country in countryKeysValues) {
  countrys.push(countryKeysValues[country]);
}

function sanitizeForm(req) {
  req.sanitize('sectors').joinArray();
  req.sanitize('currently_exporting_to').joinArray();
  req.sanitize('countries_of_interest').joinArray();
  req.sanitize('connections').joinArray();
}

function add(req, res) {
  let formData;

  if (req.body && Object.keys(req.body).length > 0) {
    formData = req.body;
  } else {
    formData = {
      ukbased: 'Yes'
    };
  }

  res.render('company/company-add', {
    formData,
    SECTOR_OPTIONS,
    REGION_OPTIONS,
    ADVISOR_OPTIONS,
    EMPLOYEE_OPTIONS,
    TURNOVER_OPTIONS,
    TYPES_OF_BUSINESS,
    countrys,
    errors: req.errors
  });
}

function renderCompany(req, res, company, formData) {

  if (formData.sectors && formData.sectors.length > 0) {
    formData.sectors = formData.sectors.split(',');
  }

  if (company.sectors && company.sectors.length > 0) {
    company.sectors = company.sectors.split(',');
  }

  if (company.currently_exporting_to && company.currently_exporting_to.length > 0) {
    company.currently_exporting_to = company.currently_exporting_to.split(',');
  }

  if (company.countries_of_interest && company.countries_of_interest.length > 0) {
    company.countries_of_interest = company.countries_of_interest.split(',');
  }

  if (company.connections && company.connections.length > 0) {
    company.connections = company.connections.split(',');
  }

  let title;
  if (company.ch && company.ch.company_name) {
    title = company.ch.company_name;
  } else if (company.registered_name) {
    title = company.registered_name;
  } else {
    title = company.trading_name;
  }


  res.render('company/company', {
    company,
    title,
    SECTOR_OPTIONS,
    REGION_OPTIONS,
    ADVISOR_OPTIONS,
    EMPLOYEE_OPTIONS,
    TURNOVER_OPTIONS,
    TYPES_OF_BUSINESS,
    countrys,
    errors: req.errors,
    formData
  });
}

function view(req, res) {
  let id = req.params.sourceId;
  let source = req.params.source;

  if (!id) {
    res.redirect('/');
    return;
  }

  companyRepository.getCompany(id, source)
    .then((company) => {
      let formData;

      if (!req.body || Object.keys(req.body).length === 0) {
        formData = Object.assign({}, company);
        delete formData.contact;
        delete formData.interaction;
      } else {
        formData = req.body;
      }

      controllerUtils.convertToFormAddress(formData, 'trading_address');

      renderCompany(req, res, company, formData);
    })
    .catch((error) => {
      res.render('error', {error});
    });
}

function post(req, res) {
  let term = req.query.term;

  sanitizeForm(req);
  controllerUtils.convertFromFormAddress(req.body, 'trading_address');

  companyRepository.saveCompany(req.body)
    .then((data) => {
      res.redirect(`/company/COMBINED/${data.id}?term=${term}`);
    })
    .catch((error) => {
      req.errors = error.response.body;
      view(req, res);
    });

}

router.get('/:source/:sourceId?', view);
router.post(['/', '/add', '/:source/:sourceId?'], post);
router.get('/add', add);

module.exports = { view, post, router };
