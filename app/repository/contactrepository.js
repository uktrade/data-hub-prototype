'use strict';
const rp = require('request-promise');
const config = require('../../config');
const moment = require('moment');
const interactionRepository = require('../repository/interactionrepository');


function getContact(contactId) {
  let result;

  return rp({
    url: `${config.apiRoot}/contact/${contactId}/`,
    json: true
  })
  .then((data) => {
    result = data;
    let promises = [];
    for (const interaction of result.interactions) {
      promises.push(interactionRepository.getInteraction(interaction.id));
    }

    return Promise.all(promises);
  })
  .then((interactions) => {
    result.interactions = interactions;
    return result;
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

function archiveContact(contactId, reason) {

  let options = {
    json: true,
    body: {
      'archived_on': moment().format('YYYY-MM-DD'),
      'archive_reason': reason,
      'archived_by': 'Lee Smith',
    },
    url: `${config.apiRoot}/contact/${contactId}/`,
    method: 'PATCH'
  };

  return rp(options);

}

function unarchiveContact(contactId) {
  let options = {
    json: true,
    body: {
      'archived_on': null,
      'archive_reason': null,
      'archived_by': null,
    },
    url: `${config.apiRoot}/contact/${contactId}/`,
    method: 'PATCH'
  };

  return rp(options);
}

module.exports = { getContact, saveContact, getContactsForCompany, archiveContact, unarchiveContact };
