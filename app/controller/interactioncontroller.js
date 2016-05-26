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
    res.render('error', {error: 'Cannot find interaction'});
  }
}

function edit(req, res) {
  let companyId = req.params.companyId;
  let interactionId = req.params.interactionId;

  let query = req.query.query || '';

  if (!interactionId || !companyId) {
    res.redirect('/');
  }

  let interaction = companyRepository.getCompanyInteraction(companyId, interactionId);

  let backUrl = `/companies/${companyId}/interaction/view/${interactionId}?query=${query}`;

  if (interaction) {
    res.render('interaction/interaction-edit', {query, interaction, backUrl});
  } else {
    res.render('error', {error: 'Cannot find interaction'});
  }
}

function editPost(req, res) {
  let companyId = req.params.companyId;
  let interactionId = req.params.interactionId;

  let query = req.query.query || '';

  if (!interactionId || !companyId) {
    res.redirect('/');
  }

  let interaction = companyRepository.getCompanyInteraction(companyId, interactionId);
  let updatedInteraction = applyFormFieldsToInteraction(interaction, req.body);

  companyRepository.setCompanyInteraction(companyId, updatedInteraction);

  res.redirect(`/companies/${companyId}/interaction/view/${interactionId}?query=${query}`);
}

function add(req, res) {
  let companyId = req.params.companyId;
  let contactId = req.params.contactId;
  let query = req.query.query || '';
  let contact;

  if (!companyId) {
    res.redirect('/');
  }

  let company = companyRepository.getCompanySummary(companyId);

  let interaction = {
    company: {
      title: company.title,
      id: companyId
    }
  };

  if (contactId) {
    contact = companyRepository.getCompanyContact(companyId, contactId);
    interaction.contact = {
      id: contactId,
      name: contact.name
    };
  }

  let referer = req.headers.referer;
  let backUrl;
  if (referer.indexOf('contact') !== -1) {
    backUrl = `/companies/${companyId}/contact/view/${contactId}?query=${query}#interactions`;
  } else {
    backUrl = `/companies/${companyId}/?query=${query}#interactions`;
  }

  res.render('interaction/interaction-add', {query, interaction, backUrl});

}

function addPost(req, res) {
  let companyId = req.params.companyId;
  let contactId = req.params.contactId;
  let query = req.query.query || '';

  if (!companyId) {
    res.redirect('/');
  }

  let updatedInteraction = applyFormFieldsToInteraction({}, req.body);
  companyRepository.setCompanyInteraction(companyId, updatedInteraction);


  // decide to go back to contact or company
  let referer = req.headers.referer;

  if (referer.indexOf('contact') !== -1) {
    res.redirect(`/companies/${companyId}/contact/view/${contactId}?query=${query}#interactions`);
  } else {
    res.redirect(`/companies/${companyId}/?query=${query}#interactions`);
  }

}


function applyFormFieldsToInteraction(interaction, formData) {

  let newInteraction = Object.assign({}, interaction);

  if (!newInteraction.contact) {
    newInteraction.contact = {};
  }

  newInteraction.type = formData.type;
  newInteraction.subject = formData.subject;
  newInteraction.date = formData.date;
  newInteraction.contact.name = formData.contactName;
  newInteraction.contact.id = formData.contactId;
  newInteraction.advisor = formData.advisor;
  newInteraction.notes = formData.notes;
  newInteraction.serviceOffer = formData.serviceOffer;
  newInteraction.serviceProvider = formData.serviceProvider;

  return newInteraction;

}



module.exports = {
  get,
  edit,
  editPost,
  add,
  addPost
};
