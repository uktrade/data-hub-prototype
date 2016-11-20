/* eslint new-cap: 0 */
const express = require('express');
const controllerUtils = require('../lib/controllerutils');
const metadataRepository = require('../repositorys/metadatarepository');
const companyRepository = require('../repositorys/companyrepository');
const itemCollectionService = require('../services/itemcollectionservice');
const React = require('react');
const ReactDom = require('react-dom/server');
const CompanyForm = require('../forms/companyform');

const router = express.Router();

// Add some extra default info into the company to make it easier to edit
function postProcessCompany(company) {
  if (!company.export_to_countries || company.export_to_countries.length === 0) {
    company.export_to_countries = [{ id: null, name: '' }];
  }
  if (!company.future_interest_countries || company.future_interest_countries.length === 0) {
    company.future_interest_countries = [{ id: null, name: '' }];
  }

  if (company.trading_address && !company.trading_address.address_country) {
    company.trading_address = {
      address_1: '',
      address_2: '',
      address_town: '',
      address_county: '',
      address_postcode: '',
      address_country: null,
    };
  }
}

function cleanErrors(errors) {
  if (errors.registered_address_1 || errors.registered_address_2 ||
    errors.registered_address_town || errors.registered_address_county ||
    errors.registered_address_postcode || errors.registered_address_country) {
    errors.registered_address = ['Invalid address'];
    delete errors.registered_address_1;
    delete errors.registered_address_2;
    delete errors.registered_address_town;
    delete errors.registered_address_county;
    delete errors.registered_address_postcode;
    delete errors.registered_address_country;
  }

  if (errors.trading_address_1 || errors.trading_address_2 ||
    errors.trading_address_town || errors.trading_address_county ||
    errors.trading_address_postcode || errors.trading_address_country) {
    errors.trading_address = ['Invalid address'];
    delete errors.trading_address_1;
    delete errors.trading_address_2;
    delete errors.trading_address_town;
    delete errors.trading_address_county;
    delete errors.trading_address_postcode;
    delete errors.trading_address_country;
  }
}

function add(req, res) {
  const csrfToken = controllerUtils.genCSRF(req);
  const markup = ReactDom.renderToString(<CompanyForm />);
  res.render('company/company-add', { markup, csrfToken });
}

function view(req, res) {
  const id = req.params.sourceId;
  const source = req.params.source;
  const csrfToken = controllerUtils.genCSRF(req);

  if (!id) {
    res.redirect('/');
    return;
  }

  companyRepository.getCompany(req.session.token, id, source)
    .then((company) => {
      postProcessCompany(company);
      let formData;

      if (!req.body || Object.keys(req.body).length === 0) {
        formData = Object.assign({}, company);
        delete formData.contact;
        delete formData.interaction;
      } else {
        formData = req.body;
      }

      const timeSinceNewContact = itemCollectionService.getTimeSinceLastAddedItem(company.contacts);
      const timeSinceNewInteraction = itemCollectionService.getTimeSinceLastAddedItem(company.interactions);
      const contactsInLastYear = itemCollectionService.getItemsAddedSince(company.contacts);
      const interactionsInLastYear = itemCollectionService.getItemsAddedSince(company.interactions);

      let title;
      if (!company.name && company.companies_house_data.name) {
        title = company.companies_house_data.name;
      } else {
        title = company.name;
      }

      res.render('company/company', {
        company,
        title,
        SECTOR_OPTIONS: metadataRepository.SECTOR_OPTIONS,
        REGION_OPTIONS: metadataRepository.REGION_OPTIONS,
        EMPLOYEE_OPTIONS: metadataRepository.EMPLOYEE_OPTIONS,
        TURNOVER_OPTIONS: metadataRepository.TURNOVER_OPTIONS,
        TYPES_OF_BUSINESS: metadataRepository.TYPES_OF_BUSINESS,
        REASONS_FOR_ARCHIVE: metadataRepository.REASONS_FOR_ARCHIVE,
        COUNTRYS: metadataRepository.COUNTRYS,
        errors: req.errors,
        formData,
        timeSinceNewContact,
        timeSinceNewInteraction,
        contactsInLastYear,
        interactionsInLastYear,
        csrfToken,
      });
    })
    .catch((error) => {
      res.render('error', { error });
    });
}

function post(req, res) {
  // Flatten selected fields
  const company = Object.assign({}, req.body.company);

  controllerUtils.flattenAddress(company, 'registered');
  controllerUtils.flattenAddress(company, 'trading');
  controllerUtils.flattenIdFields(company);
  controllerUtils.nullEmptyFields(company);

  if (company.export_to_countries === null) company.export_to_countries = [];
  if (company.future_interest_countries === null) company.future_interest_countries = [];

  controllerUtils.genCSRF(req, res);

  companyRepository.saveCompany(req.session.token, company)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      if (typeof error.error === 'string') {
        return res.status(error.response.statusCode).json({ errors: [{ error: error.response.statusMessage }] });
      }
      const errors = error.error;
      cleanErrors(errors);
      return res.status(400).json({ errors });
    });
}

function archive(req, res) {
  companyRepository.archiveCompany(req.session.token, req.params.company_id, req.body.archived_reason)
    .then(() => {
      res.redirect(`/company/COMBINED/${req.params.company_id}`);
    });
}

function unarchive(req, res) {
  companyRepository.unarchiveCompany(req.session.token, req.params.company_id)
    .then(() => {
      res.redirect(`/company/COMBINED/${req.params.company_id}`);
    });
}

function getJson(req, res) {
  const id = req.params.sourceId;
  const source = req.params.source;

  companyRepository.getCompany(req.session.token, id, source)
    .then((company) => {
      res.json(company);
    })
    .catch((error) => {
      res.render('error', { error });
    });
}


router.get('/add', add);
router.get('/json/:company_id', getJson);
router.get('/:company_id/unarchive', unarchive);
router.get('/:source/:sourceId/json?', getJson);
router.get('/:source/:sourceId?', view);
router.post('/:company_id/archive', archive);
router.post(['/'], post);


module.exports = { view, post, router };
