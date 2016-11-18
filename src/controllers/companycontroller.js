const express = require('express');
const controllerUtils = require('../lib/controllerutils');
const metadataRepository = require('../repositorys/metadatarepository');
const companyRepository = require('../repositorys/companyrepository');
const itemCollectionService = require('../services/itemcollectionservice');
const React = require('react');
const ReactDom = require('react-dom/server');
const CompanyForm = require('../forms/companyform');
const router = express.Router();

function cleanErrors(errors) {
  const formattedErrors = errors;

  if (formattedErrors.registered_address_1 || formattedErrors.registered_address_2 ||
    formattedErrors.registered_address_town || formattedErrors.registered_address_county ||
    formattedErrors.registered_address_postcode || formattedErrors.registered_address_country) {
    formattedErrors.registered_address = ['Invalid address'];
    delete formattedErrors.registered_address_1;
    delete formattedErrors.registered_address_2;
    delete formattedErrors.registered_address_town;
    delete formattedErrors.registered_address_county;
    delete formattedErrors.registered_address_postcode;
    delete formattedErrors.registered_address_country;
  }

  if (formattedErrors.trading_address_1 || formattedErrors.trading_address_2 ||
    formattedErrors.trading_address_town || formattedErrors.trading_address_county ||
    errors.trading_address_postcode || errors.trading_address_country) {
    formattedErrors.trading_address = ['Invalid address'];
    delete formattedErrors.trading_address_1;
    delete formattedErrors.trading_address_2;
    delete formattedErrors.trading_address_town;
    delete formattedErrors.trading_address_county;
    delete formattedErrors.trading_address_postcode;
    delete formattedErrors.trading_address_country;
  }

  return formattedErrors;
}


// Add some extra default info into the company to make it easier to edit
function postProcessCompany(company) {
  const updatedCompany = company;

  if (!updatedCompany.export_to_countries || updatedCompany.export_to_countries.length === 0) {
    updatedCompany.export_to_countries = [{ id: null, name: '' }];
  }
  if (!updatedCompany.future_interest_countries || updatedCompany.future_interest_countries.length === 0) {
    updatedCompany.future_interest_countries = [{ id: null, name: '' }];
  }

  if (updatedCompany.trading_address && !updatedCompany.trading_address.address_country) {
    updatedCompany.trading_address = {
      address_1: '',
      address_2: '',
      address_town: '',
      address_county: '',
      address_postcode: '',
      address_country: null,
    };
  }

  return updatedCompany;
}

function add(req, res) {
  const markup = ReactDom.renderToString(<CompanyForm />);
  res.render('company/company-add', { markup });
}

function view(req, res) {
  const id = req.params.sourceId;
  const source = req.params.source;

  if (!id) {
    res.redirect('/');
    return;
  }

  companyRepository.getCompany(req.session.token, id, source)
    .then((company) => {
      const updatedCompany = postProcessCompany(company);
      let formData;

      if (!req.body || Object.keys(req.body).length === 0) {
        formData = Object.assign({}, company);
        delete formData.contact;
        delete formData.interaction;
      } else {
        formData = req.body;
      }

      const timeSinceNewContact = itemCollectionService.getTimeSinceLastAddedItem(updatedCompany.contacts);
      const timeSinceNewInteraction = itemCollectionService.getTimeSinceLastAddedItem(updatedCompany.interactions);
      const contactsInLastYear = itemCollectionService.getItemsAddedSince(updatedCompany.contacts);
      const interactionsInLastYear = itemCollectionService.getItemsAddedSince(updatedCompany.interactions);

      let title;
      if (!updatedCompany.name && updatedCompany.companies_house_data.name) {
        title = updatedCompany.companies_house_data.name;
      } else {
        title = updatedCompany.name;
      }

      res.render('company/company', {
        company: updatedCompany,
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

  companyRepository.saveCompany(req.session.token, company)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      if (typeof error.error === 'string') {
        return res.status(error.response.statusCode)
          .json({ errors: [{ error: error.response.statusMessage }] });
      }
      const errors = cleanErrors(error.error);
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

function index(req, res) {
  res.render('company/company');
}

router.get('/company/add', add);
router.get('/company/*', index);
router.post('/company', post);
router.get('/api/company/:source/:sourceId', getJson);

module.exports = { view, post, router };
