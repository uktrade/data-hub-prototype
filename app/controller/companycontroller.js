/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
const metadata = require('../lib/metadata');
const companyRepository = require('../repository/companyrepository');

function sanitizeForm(req) {
  req.sanitize('currently_exporting_to').joinArray();
  req.sanitize('countries_of_interest').joinArray();
  req.sanitize('connections').joinArray();
  req.sanitize('uk_based').yesNoToBoolean();
}

function add(req, res) {

  if (req.body.currently_exporting_to && req.body.currently_exporting_to.length > 0) {
    req.body.currently_exporting_to = req.body.currently_exporting_to.split(',');
  }

  if (req.body.countries_of_interest && req.body.countries_of_interest.length > 0) {
    req.body.countries_of_interest = req.body.countries_of_interest.split(',');
  }

  if (req.body.connections && req.body.connections.length > 0) {
    req.body.connections = req.body.connections.split(',');
  }

  res.render('company/company-add', {
    formData: req.body,
    SECTOR_OPTIONS: metadata.SECTOR_OPTIONS,
    REGION_OPTIONS: metadata.REGION_OPTIONS,
    ADVISOR_OPTIONS: metadata.ADVISOR_OPTIONS,
    EMPLOYEE_OPTIONS: metadata.EMPLOYEE_OPTIONS,
    TURNOVER_OPTIONS: metadata.TURNOVER_OPTIONS,
    TYPES_OF_BUSINESS: metadata.TYPES_OF_BUSINESS,
    COUNTRYS: metadata.COUNTRYS,
    errors: req.errors
  });
}

function renderCompany(req, res, company, formData) {

  if (formData.currently_exporting_to && formData.currently_exporting_to.length > 0) {
    formData.currently_exporting_to = formData.currently_exporting_to.split(',');
  }

  if (company.currently_exporting_to && company.currently_exporting_to.length > 0) {
    company.currently_exporting_to = company.currently_exporting_to.split(',');
  }

  if (company.countries_of_interest && company.countries_of_interest.length > 0) {
    company.countries_of_interest = company.countries_of_interest.split(',');
  }

  if (formData.countries_of_interest && formData.countries_of_interest.length > 0) {
    formData.countries_of_interest = formData.countries_of_interest.split(',');
  }

  if (company.connections && company.connections.length > 0) {
    company.connections = company.connections.split(',');
  }

  if (formData.connections && formData.connections.length > 0) {
    formData.connections = formData.connections.split(',');
  }


  let title;
  if (!company.name && company.ch.name) {
    title = company.ch.name;
  } else {
    title = company.name;
  }

  res.render('company/company', {
    company,
    title,
    SECTOR_OPTIONS: metadata.SECTOR_OPTIONS,
    REGION_OPTIONS: metadata.REGION_OPTIONS,
    ADVISOR_OPTIONS: metadata.ADVISOR_OPTIONS,
    EMPLOYEE_OPTIONS: metadata.EMPLOYEE_OPTIONS,
    TURNOVER_OPTIONS: metadata.TURNOVER_OPTIONS,
    TYPES_OF_BUSINESS: metadata.TYPES_OF_BUSINESS,
    REASONS_FOR_ARCHIVE: metadata.REASONS_FOR_ARCHIVE,
    COUNTRYS: metadata.COUNTRYS,
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

      renderCompany(req, res, company, formData);
    })
    .catch((error) => {
      res.render('error', {error});
    });
}

function post(req, res) {
  sanitizeForm(req);

  companyRepository.saveCompany(req.body)
    .then((data) => {
      res.redirect(`/company/COMBINED/${data.id}`);
    })
    .catch((error) => {
      req.errors = error.response.body;
      if (req.params.sourceId) {
        view(req, res);
      } else {
        add(req, res);
      }
    });
}

function archive(req, res) {
  companyRepository.archiveCompany(req.params.company_id, req.body.archive_reason)
    .then(() => {
      res.redirect(`/company/COMBINED/${req.params.company_id}`);
    });
}

function unarchive(req, res) {
  companyRepository.unarchiveCompany(req.params.company_id)
    .then(() => {
      res.redirect(`/company/COMBINED/${req.params.company_id}`);
    });
}


router.get('/add', add);
router.get('/:company_id/unarchive', unarchive);
router.get('/:source/:sourceId?', view);
router.post('/:company_id/archive', archive);
router.post(['/', '/add', '/:source/:sourceId?'], post);


module.exports = { view, post, router };
