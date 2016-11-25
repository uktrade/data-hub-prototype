/* eslint new-cap: 0 */
const express = require('express');
const winston = require('winston');
const React = require('react');
const ReactDom = require('react-dom/server');
const Router = require('react-router');
const AsyncProps = require('async-props').default;
const loadPropsOnServer = require('async-props').loadPropsOnServer;
const controllerUtils = require('../lib/controllerutils');
const companyRepository = require('../repositorys/companyrepository');
const routesConfig = require('../reactrouting/companyroutes').routesConfig;


const router = express.Router();

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

function post(req, res) {
  // Flatten selected fields
  const company = Object.assign({}, req.body.company);
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
  controllerUtils.genCSRF(req, res);

  companyRepository.archiveCompany(req.session.token, req.body.id, req.body.reason)
    .then((company) => {
      res.json(company);
    })
    .catch((error) => {
      winston.log('error', error);
      if (typeof error.error === 'string') {
        return res.status(error.response.statusCode).json({ errors: [{ error: error.response.statusMessage }] });
      }
      const errors = error.error;
      cleanErrors(errors);
      return res.status(400).json({ errors });
    });
}

function unarchive(req, res) {
  controllerUtils.genCSRF(req, res);

  companyRepository.unarchiveCompany(req.session.token, req.body.id)
    .then((company) => {
      res.json(company);
    })
    .catch((error) => {
      winston.error('error', error);
      if (typeof error.error === 'string') {
        return res.status(error.response.statusCode).json({ errors: [{ error: error.response.statusMessage }] });
      }
      const errors = error.error;
      cleanErrors(errors);
      return res.status(400).json({ errors });
    });
}

function index(req, res) {
  const token = req.session.token;
  const csrfToken = controllerUtils.genCSRF(req);

  Router.match({ routes: routesConfig, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      renderProps.params.token = token;
      loadPropsOnServer(renderProps, {}, (err, asyncProps, scriptTag) => {
        const markup = ReactDom.renderToString(<AsyncProps {...renderProps} {...asyncProps} />);
        res.render('company/company-react', { markup, scriptTag, csrfToken });
      });
    } else {
      res.status(404).send('Not found');
    }
  });
}

router.get('*', index);
router.post('/archive', archive);
router.post('/unarchive', unarchive);

router.post('/', post);


module.exports = { router };
