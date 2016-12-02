/* eslint new-cap: 0 */
const express = require('express');
const winston = require('winston');
const React = require('react');
const ReactDom = require('react-dom/server');
const Router = require('react-router');
const AsyncProps = require('async-props').default;
const loadPropsOnServer = require('async-props').loadPropsOnServer;
const controllerUtils = require('../lib/controllerutils');
const contactRepository = require('../repositorys/contactrepository');
const routesConfig = require('../reactrouting/contactroutes').routesConfig;

const router = express.Router();

function cleanErrors(errors) {
  if (errors.address_1 || errors.address_2 ||
    errors.address_town || errors.address_county ||
    errors.address_postcode || errors.address_country) {
    errors.registered_address = ['Invalid address'];
    delete errors.address_1;
    delete errors.address_2;
    delete errors.address_town;
    delete errors.address_county;
    delete errors.address_postcode;
    delete errors.address_country;
  }
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
      renderProps.params = Object.assign({ token }, renderProps.params, req.query);
      loadPropsOnServer(renderProps, {}, (err, asyncProps, scriptTag) => {
        const markup = ReactDom.renderToString(<AsyncProps {...renderProps} {...asyncProps} />);
        res.render('layouts/react', { markup, scriptTag, csrfToken, bundleName: 'contact' });
      });
    } else {
      res.status(404).send('Not found');
    }
  });

}

function get(req, res) {
  const contactId = req.params.contactId;

  if (!contactId) {
    res.redirect('/');
  }

  contactRepository.getContact(req.session.token, contactId)
    .then((contact) => {
      res.json(contact);
    })
    .catch((error) => {
      const errors = error.error;
      return res.status(400).json({ errors });
    });
}

function post(req, res) {
  // Flatten selected fields
  const contact = Object.assign({}, req.body.contact);

  controllerUtils.flattenIdFields(contact);
  controllerUtils.nullEmptyFields(contact);

  contact.telephone_countrycode = '+44';

  controllerUtils.genCSRF(req, res);

  contactRepository.saveContact(req.session.token, contact)
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

  contactRepository.archiveContact(req.session.token, req.body.id, req.body.reason)
    .then((contact) => {
      res.json(contact);
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

  contactRepository.unarchiveContact(req.session.token, req.body.id)
    .then((contact) => {
      res.json(contact);
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

router.get('/contact/*', index);
router.get('/api/contact/:contactId', get);
router.post('/api/contact', post);
router.post('/api/contact/archive', archive);
router.post('/api/contact/unarchive', unarchive);

module.exports = { router };
