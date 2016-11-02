/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
const controllerUtils = require('../lib/controllerutils');
const userLeads = require( '../lib/userLeads' );

let contactRepository = require('../repository/contactrepository');
let companyRepository = require('../repository/companyrepository');

const REASONS_FOR_ARCHIVE = [
  'Contact has left the company',
  'Contact does not want to be contacted',
  'Contact changed role/responsibility',
  'Other'
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

      res.render('contact/contact', { term: req.query.term, contact, REASONS_FOR_ARCHIVE });
    })
    .catch((error) => {
      res.render('error', {error});
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

      res.render('contact/contact-edit', {
        term: req.query.term,
          company: null,
        contact
      });
    })
    .catch((error) => {
      res.render('error', {error});
    });
}

function add(req, res) {

  let companyId = req.query.company_id || null;
  let leadId = req.query.lead;
  let userId = req.session.userId;
  let viewModel = {
    company: null,
    contact: null
  };

  function render( data ){

    if (data) {
      Object.assign( viewModel, data );
    }

    res.render('contact/contact-edit', viewModel);
  }

  if (leadId && userId) {

    userLeads.getById( userId, leadId ).then( ( lead ) => {
      render( { lead } );
    });

  } else if (companyId) {
    companyRepository.getDitCompany(req.session.token, companyId)
      .then((company) => {
        render({company});
      });
  } else {
    render();
  }
}

function cleanErrors(errors) {
  if (errors.address_1 || errors.address_2 ||
    errors.address_town || errors.address_county ||
    errors.address_postcode || errors.address_country)
  {
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

  let leadId = req.body.contact.leadId;
  let contact = Object.assign({}, req.body.contact);

  controllerUtils.flattenIdFields(contact);
  controllerUtils.flattenAddress(contact);
  controllerUtils.nullEmptyFields(contact);

  contact.telephone_countrycode = '+44';

  contactRepository.saveContact(req.session.token, contact)
    .then((data) => {
      if (leadId){
        userLeads
          .remove( req.session.userId, leadId )
          .then(() => {
            res.json(data);
          });
      } else {
        res.json(data);
      }
    })
    .catch((error) => {

      let errors = error.error;
      cleanErrors(errors);

      res.status(400).json({errors});
    });

}

function archive(req, res) {
  contactRepository.archiveContact(req.session.token, req.params.contact_id, req.body.archived_reason)
    .then(() => {
      res.redirect(`/contact/${req.params.contact_id}/view`);
    });
}

function unarchive(req, res) {
  contactRepository.unarchiveContact(req.session.token, req.params.contact_id)
    .then(() => {
      res.redirect(`/contact/${req.params.contact_id}/view`);
    });
}


router.get('/add?', add);
router.get('/:contact_id/edit', edit);
router.get('/:contact_id/view', view);
router.post(['/'], post);
router.post('/:contact_id/archive', archive);
router.get('/:contact_id/unarchive', unarchive);


module.exports = { view, post, edit, router };
