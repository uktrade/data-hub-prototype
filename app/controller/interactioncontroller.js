'use strict';

let companyRepository = require('../lib/companyrepository');

function get(req, res) {
  let companyId = req.params.companyId;
  let interactionId = req.params.interactionId;

  let query = req.query.query || '';

  if (!interactionId || !companyId) {
    res.redirect('/');
  }

  let interaction = companyRepository.getCompanyInteraction(companyId, interactionId);

  if (interaction) {
    res.render('interaction/interaction-details', {query, interaction});
  } else {
    res.render('error', {error: 'Cannot find contact'});
  }
}

module.exports = {
  get
};
