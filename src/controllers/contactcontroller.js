/* eslint new-cap: 0 */
const express = require('express');
const winston = require('winston');
const controllerUtils = require('../lib/controllerutils');
const contactRepository = require('../repositorys/contactrepository');
const companyRepository = require('../repositorys/companyrepository');
const itemCollectionService = require('../services/itemcollectionservice');
const React = require('react');
const ReactDom = require('react-dom/server');
const ContactForm = require('../forms/contactform');

const router = express.Router();
const REASONS_FOR_ARCHIVE = [
  'Contact has left the company',
  'Contact does not want to be contacted',
  'Contact changed role/responsibility',
  'Other',
];

function view(req, res) {
  const contact_id = req.params.contact_id;

  if (!contact_id) {
    res.redirect('/');
  }

  contactRepository.getContact(req.session.token, contact_id)
    .then((contact) => {
      if (!contact.interactions) {
        contact.interactions = [];
      }

      const timeSinceNewInteraction = itemCollectionService.getTimeSinceLastAddedItem(contact.interactions);
      const interactionsInLastYear = itemCollectionService.getItemsAddedSince(contact.interactions);
      const csrfToken = controllerUtils.genCSRF(req);

      res.render(
        'contact/contact', {
          term: req.query.term,
          contact,
          REASONS_FOR_ARCHIVE,
          timeSinceNewInteraction,
          interactionsInLastYear,
          csrfToken,
        });
    })
    .catch((error) => {
      res.render('error', { error });
    });
}

function edit(req, res) {
  const contact_id = req.params.contact_id;

  if (!contact_id) {
    res.redirect('/');
  }

  contactRepository.getContact(req.session.token, contact_id)
    .then((contact) => {
      if (!contact.interactions) {
        contact.interactions = [];
      }

      const csrfToken = controllerUtils.genCSRF(req);
      const markup = ReactDom.renderToString(<ContactForm contact={contact} company={null} />);

      res.render('contact/contact-edit', {
        term: req.query.term,
        company: null,
        contact,
        csrfToken,
        markup
      });
    })
    .catch((error) => {
      res.render('error', { error });
    });
}

function add(req, res) {
  const companyId = req.query.company_id || null;
  const csrfToken = controllerUtils.genCSRF(req);

  if (companyId) {
    companyRepository.getDitCompany(req.session.token, companyId)
      .then((company) => {
        const markup = ReactDom.renderToString(<ContactForm company={company} />);
        res.render('contact/contact-edit', {
          contact: null,
          company,
          csrfToken,
          markup,
        });
      });
  } else {
    const markup = ReactDom.renderToString(<ContactForm />);
    res.render('contact/contact-edit', {
      contact: null,
      company: null,
      csrfToken,
      markup,
    });
  }
}

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

function post(req, res) {
  // Flatten selected fields
  const contact = Object.assign({}, req.body.contact);

  controllerUtils.flattenAddress(contact);
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
  contactRepository.archiveContact(req.session.token, req.params.contact_id, req.body.archived_reason)
    .then(() => {
      res.redirect(`/contact/${req.params.contact_id}/view`);
    })
    .catch((error) => {
      winston.log('error', error.error);
      res.render('error', { error: 'Unable to archive contact' });
    });
}

function unarchive(req, res) {
  contactRepository.unarchiveContact(req.session.token, req.params.contact_id)
    .then(() => {
      res.redirect(`/contact/${req.params.contact_id}/view`);
    })
    .catch((error) => {
      winston.log('error', error.error);
      res.render('error', { error: 'Unable to unarchive contact' });
    });
}


router.get('/add?', add);
router.get('/:contact_id/edit', edit);
router.get('/:contact_id/view', view);
router.post(['/'], post);
router.post('/:contact_id/archive', archive);
router.get('/:contact_id/unarchive', unarchive);


module.exports = { view, post, edit, router };
