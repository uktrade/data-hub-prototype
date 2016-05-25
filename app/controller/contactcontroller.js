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

module.exports = {
  get: get
};
