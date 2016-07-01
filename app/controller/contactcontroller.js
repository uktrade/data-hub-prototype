'use strict';

const companyRepository = require('../lib/companyrepository');
const transformErrors = require('../lib/controllerutils').transformErrors;
const TEAM_OPTIONS = require('../../data/teams.json');

function get(req, res) {

  let contactId = req.params.contactId;
  let companyId = req.params.companyId;

  let query = req.query.query || '';

  if (!contactId || !companyId) {
    res.redirect('/');
  }

  let company = companyRepository.getCompanySummary(companyId);
  let contact = companyRepository.getCompanyContact(companyId, contactId);
  let interactions = companyRepository.getInteractionsForContact(companyId, contactId);

  if (contact) {
    res.render('contact/contact', {query, contact, company, interactions});
  } else {
    res.render('error', {error: 'Cannot find contact'});
  }

}

function edit(req, res) {
  let contactId = req.params.contactId;
  let companyId = req.params.companyId;

  let query = req.query.query || '';

  if (!companyId) {
    res.redirect('/');
  }

  let company = companyRepository.getCompanySummary(companyId);

  let contact;

  if (req.body && Object.keys(req.body).length > 0) {
    contact = req.body;
  } else if (contactId) {
    contact = companyRepository.getCompanyContact(companyId, contactId);

  } else {
    contact = {};
  }

  const errors = req.validationErrors();

  res.render('contact/contact-edit', {
    query,
    contact,
    company,
    TEAM_OPTIONS,
    errors: transformErrors(errors)
  });

}

function post(req, res) {
  let contactId = req.params.contactId;
  let companyId = req.params.companyId;

  let query = req.query.query || '';

  if (!companyId) {
    res.redirect('/');
  }

  sanitizeForm(req);
  let errors = validateForm(req);

  convertAddress(req.body);

  if (errors) {
    edit(req, res);
    return;
  }


  let contact = contactId ? companyRepository.getCompanyContact(companyId, contactId) : {};
  let updatedContact = applyFormFieldsToContact(contact, req.body);
  updatedContact = companyRepository.setCompanyContact(companyId, updatedContact);
  res.redirect(`/companies/${companyId}/contact/view/${updatedContact.id}?query=${query}`);

}

function sanitizeForm(req) {
  req.sanitize('primaryContactTeam').trimArray();
}

function validateForm(req) {

  req.checkBody({
    'firstname': {
      notEmpty: {
        errorMessage: 'You must enter a first name for this contact.'
      }
    },
    'lastname': {
      notEmpty: {
        errorMessage: 'You must enter a last name for this contact.'
      }
    },
    'occupation': {
      notEmpty: {
        errorMessage: 'Please provide a role for this contact'
      }
    },
    'telephonenumber': {
      notEmpty: {
        errorMessage: 'You must enter a telephone number for this contact.'
      }
    },
    'emailaddress': {
      notEmpty: {
        errorMessage: 'Please provide an email address for the contact'
      },
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    'address.address1': {
      notEmpty: {
        errorMessage: 'You must enter an address for this contact.'
      }
    }
  });

  if (req.body.primaryContact.toLocaleLowerCase() === 'yes') {
    req.check('primaryContactTeam', 'You must select a team for primary contact').notEmpty();
  }

  return transformErrors(req.validationErrors());

}

function convertAddress(formData) {
  let address = {
    address1: formData['address.address1'],
    address2: formData['address.address2'],
    city: formData['address.city'],
    county: formData['address.county'],
    postcode: formData['address.postcode'],
    country: formData['address.country']
  };

  delete formData['address.address1'];
  delete formData['address.address2'];
  delete formData['address.city'];
  delete formData['address.county'];
  delete formData['address.postcode'];
  delete formData['address.country'];

  formData.address = address;
}

function applyFormFieldsToContact(contact, formData){
  formData.primaryContact = formData.primaryContact === 'Yes';
  return Object.assign(contact, formData);
}


module.exports = {
  get,
  edit,
  post
};
