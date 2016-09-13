/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();

let contactRepository = require('../repository/contactrepository');
let companyRepository = require('../repository/companyrepository');

const TEAM_OPTIONS = require('../../data/teams.json');
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

  contactRepository.getContact(contact_id)
    .then((contact) => {

      if (contact.primary_contact_team && contact.primary_contact_team.length > 0) {
        contact.primary_contact_team = contact.primary_contact_team.split(',');
      }

      res.render('contact/contact', { term: req.query.term, contact, REASONS_FOR_ARCHIVE });
    })
    .catch((error) => {
      res.render('error', {error});
    });
}

function edit(req, res) {

  if (req.body && Object.keys(req.body).length > 0) {
    companyRepository.getDitCompany(req.body.company)
      .then((company) => {
        convertToFormAddress(req.body);
        res.render('contact/contact-edit', {
          company: company,
          contact: req.body,
          TEAM_OPTIONS
        });
      });
    return;
  }

  const contact_id = req.params.contact_id;

  if (!contact_id) {
    res.redirect('/');
    return;
  }

  contactRepository.getContact(contact_id)
    .then((contact) => {

      convertToFormAddress(contact);
      if (contact.primary_contact_team && contact.primary_contact_team.length > 0) {
        contact.primary_contact_team = contact.primary_contact_team.split(',');
      }

      res.render('contact/contact-edit', { contact, TEAM_OPTIONS
      });
    })
    .catch((error) => {
      res.render('error', {error});
    });
}

function add(req, res) {
  let companyId = req.query.company_id;
  if (!companyId) {
    res.redirect('/');
  }

  companyRepository.getCompany(companyId)
    .then((company) => {
      res.render('contact/contact-edit', {
        contact: {
          company: company
        },
        formData: {},
        TEAM_OPTIONS
      });
    });
}

function post(req, res) {
  sanitizeForm(req);
  convertFromFormAddress(req.body);

  contactRepository.saveContact(req.body)
    .then((savedContact) => {
      if (req.params.contact_id) {
        res.redirect(`/contact/${req.params.contact_id}/view`);
      } else {
        res.redirect(`/company/DIT/${savedContact.company}#contacts`);
      }
    })
    .catch((error) => {
      req.errors = error.response.body;
      view(req, res);
    });

}

function archive(req, res) {
  contactRepository.archiveContact(req.params.contact_id, req.body.archive_reason)
    .then(() => {
      res.redirect(`/contact/${req.params.contact_id}/view`);
    });
}

function unarchive(req, res) {
  contactRepository.unarchiveContact(req.params.contact_id)
    .then(() => {
      res.redirect(`/contact/${req.params.contact_id}/view`);
    });
}


function sanitizeForm(req) {
  req.sanitize('primaryContactTeam').joinArray();
}

function convertFromFormAddress(formData) {

  if (formData.useCompanyAddress.toLocaleLowerCase() === 'no') {
    formData.address_1 = formData['address.address1'];
    formData.address_2 = formData['address.address2'];
    formData.address_town = formData['address.city'];
    formData.address_county = formData['address.county'];
    formData.address_postcode = formData['address.postcode'];
    formData.address_country = formData['address.country'];
  }

  delete formData['address.address1'];
  delete formData['address.address2'];
  delete formData['address.city'];
  delete formData['address.county'];
  delete formData['address.postcode'];
  delete formData['address.country'];

}

function convertToFormAddress(formData) {
  formData.address = {
    address1: formData.address_1,
    address2: formData.address_2,
    city: formData.address_town,
    county: formData.address_county,
    postcode: formData.address_postcode,
    country: formData.address_country
  };

  delete formData.address_1;
  delete formData.address_2;
  delete formData.address_town;
  delete formData.address_county;
  delete formData.address_postcode;
  delete formData.address_country;
}

router.get('/add?', add);
router.get('/:contact_id/edit', edit);
router.get('/:contact_id/view', view);
router.post(['/add', '/:contact_id/edit'], post);
router.post('/:contact_id/archive', archive);
router.get('/:contact_id/unarchive', unarchive);


module.exports = { view, post, edit, router };
