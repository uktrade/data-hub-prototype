'use strict';
const rp = require('request-promise');
const config = require('../../config');

function getContact(contactId) {
  return rp({
    url: `${config.apiRoot}/contact/${contactId}/`,
    json: true
  });
}

function getContactsForCompany(companyId) {
  return new Promise((fulfill) => {
    rp({
      url: `${config.apiRoot}/contact/?company=${companyId}`,
      json: true
    })
      .then((data) => {
        fulfill(data.results);
      });
  });
}

function saveContact(contact) {
  let options = {
    json: true,
    body: contact
  };

  if (contact.id && contact.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/contact/${contact.id}/`;
    options.method = 'PUT';
  } else {
    options.url = `${config.apiRoot}/contact/`;
    options.method = 'POST';
  }

  return rp(options);
}

module.exports = { getContact, saveContact, getContactsForCompany };
