'use strict';

let companyRepository = require('../lib/companyrepository');

function get(req, res) {

  let contactId = req.params.contactId;
  let companyId = req.params.companyId;

  let query = req.query.query || '';

  if (!contactId || !companyId) {
    res.redirect('/');
  }

  let contact = companyRepository.getCompanyContact(companyId, contactId);

  if (contact) {
    res.render('contact/contact', {query, contact});
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

  res.render('contact/contact-add', {query, contact});

}

function addPost(req, res) {
  let companyId = req.params.companyId;
  let query = req.query.query || '';

  if (!companyId) {
    res.redirect('/');
  }

  let updatedContact = applyFormFieldsToContact({}, req.body);
  companyRepository.setCompanyContact(companyId, updatedContact);
  res.redirect(`/companies/${companyId}/?query=${query}#contacts`);

}



function applyFormFieldsToContact(contact, formData){

  let newContact = Object.assign({}, contact);

  newContact.title = formData.title;
  newContact.name = formData.name;
  newContact.occupation = formData.occupation;
  newContact.telephonenumber = formData.telephonenumber;
  newContact.emailaddress = formData.emailaddress;
  newContact.streetaddress = formData.streetaddress;
  newContact.city = formData.city;
  newContact.zipcode = formData.zipcode;
  newContact.alternativeTelephonenumber = formData.alternativeTelephonenumber;
  newContact.alternativeEmailaddress = formData.alternativeEmailaddress;
  newContact.notes = formData.notes;

  return newContact;

}


module.exports = {
  get,
  edit,
  add,
  addPost,
  editPost
};
