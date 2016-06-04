'use strict';

let companyRepository = require('../lib/companyrepository');
const transformErrors = require('../lib/controllerutils').transformErrors;

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

  if (!contactId || !companyId) {
    res.redirect('/');
  }

  let contact = companyRepository.getCompanyContact(companyId, contactId);

  if (contact) {
    res.render('contact/contact-edit', {query, contact});
  } else {
    res.render('error', {error: 'Cannot find contact'});
  }
}

function editPost(req, res) {
  let contactId = req.params.contactId;
  let companyId = req.params.companyId;

  let query = req.query.query || '';

  if (!contactId || !companyId) {
    res.redirect('/');
  }

  let contact = companyRepository.getCompanyContact(companyId, contactId);

  let errors = validateForm(req);

  if (errors) {
    let company = companyRepository.getCompanySummary(companyId);
    res.render('contact/contact-edit', {query, company, contact: req.body, errors});
    return;
  }

  let updatedContact = applyFormFieldsToContact(contact, req.body);
  companyRepository.setCompanyContact(companyId, updatedContact);
  res.redirect(`/companies/${companyId}/contact/view/${contactId}?query=${query}`);

}

function add(req, res) {
  let companyId = req.params.companyId;

  let query = req.query.query || '';

  if (!companyId) {
    res.redirect('/');
  }

  let company = companyRepository.getCompanySummary(companyId);
  let contact = {
    company: {
      title: company.title,
      id: company.id
    }
  };

  res.render('contact/contact-add', {query, contact, company});

}

function addPost(req, res) {
  let companyId = req.params.companyId;
  let query = req.query.query || '';

  if (!companyId) {
    res.redirect('/');
  }

  let errors = validateForm(req);

  if (errors) {
    let company = companyRepository.getCompanySummary(companyId);
    res.render('contact/contact-add', {query, company, contact: req.body, errors});
    return;
  }

  let updatedContact = applyFormFieldsToContact({}, req.body);
  companyRepository.setCompanyContact(companyId, updatedContact);
  res.redirect(`/companies/${companyId}/?query=${query}#contacts`);

}


function validateForm(req) {

  req.checkBody({
    'name': {
      notEmpty: {
        errorMessage: 'You must enter a name for this contact.'
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
    'address_address1': {
      notEmpty: {
        errorMessage: 'You must enter an address for this contact.'
      }
    }
  });

  return transformErrors(req.validationErrors());

}

function applyFormFieldsToContact(contact, formData){
  let address = {
    address1: formData.address_address1,
    address2: formData.address_address2,
    city: formData.address_city,
    postcode: formData.address_postcode
  };

  delete formData.address_address1;
  delete formData.address_address2;
  delete formData.address_city;
  delete formData.address_postcode;

  formData.primaryContact = formData.primaryContact === 'Yes';

  let newContact = Object.assign(contact, formData);
  newContact.address = address;
  return newContact;
}


module.exports = {
  get,
  edit,
  add,
  addPost,
  editPost
};
