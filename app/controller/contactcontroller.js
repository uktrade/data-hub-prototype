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

  applyFormFieldsToContact(contact, req.body).
  then((updatedContact) => {
    companyRepository.setCompanyContact(companyId, updatedContact);
    res.redirect(`/companies/${companyId}/contact/view/${contactId}?query=${query}`);
  })
    .catch((updatedContact, errors) => {
      res.render('contact/contact-add', {query, updatedContact, errors});
    });

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

  applyFormFieldsToContact({}, req.body).
    then((newContact) => {
      companyRepository.setCompanyContact(companyId, newContact);
      res.redirect(`/companies/${companyId}/?query=${query}#contacts`);
    })
    .catch(({newContact, errors}) => {
      let company = companyRepository.getCompanySummary(companyId);
      res.render('contact/contact-add', {query, company, contact: newContact, errors});
    });

}



function applyFormFieldsToContact(contact, formData){

  let newContact = Object.assign({}, contact);
  let errors = {};

  return new Promise((accept, reject) => {

    newContact.title = formData.title;

    if (!formData.name || formData.name.length === 0) {
      errors.name = 'You must enter the contact name';
    } else {
      newContact.name = formData.name;
    }

    if (!formData.occupation || formData.occupation.length === 0) {
      errors.occupation = 'You must enter the contact occupation';
    } else {
      newContact.occupation = formData.occupation;
    }

    newContact.primaryContact = formData.primaryContact === 'Yes';

    if (!formData.telephonenumber || formData.telephonenumber.length === 0) {
      errors.telephonenumber = 'You must enter a phone number for the contact.'
    } else {
      newContact.telephonenumber = formData.telephonenumber;
    }

    if (!formData.emailaddress || formData.emailaddress.length === 0) {
      errors.emailaddress = 'You must provide an email address for this contact';
    } else {
      newContact.emailaddress = formData.emailaddress;
    }

    if (!formData.streetaddress || formData.streetaddress.length === 0) {
      errors.streetaddress = 'You must provide an address for this contact';
    } else {
      newContact.streetaddress = formData.streetaddress;
    }

    newContact.city = formData.city;
    newContact.zipcode = formData.zipcode;
    newContact.alternativeTelephonenumber = formData.alternativeTelephonenumber;
    newContact.alternativeEmailaddress = formData.alternativeEmailaddress;
    newContact.notes = formData.notes;

    if (Object.keys(errors).length > 0) {
      reject({newContact, errors});
    } else {
      accept(newContact);
    }
  });

}


module.exports = {
  get,
  edit,
  add,
  addPost,
  editPost
};
