'use strict';

let companyRepository = require('../lib/companyrepository');
const transformErrors = require('../lib/controllerutils').transformErrors;
const INTERACTION_TYPES = require('../../data/interactiontypes.json');
const ADVISORS = require('../../data/advisors.json');

function get(req, res) {
  let companyId = req.params.companyId;
  let interactionId = req.params.interactionId;

  let query = req.query.query || '';

  if (!interactionId || !companyId) {
    res.redirect('/');
  }

  const interaction = companyRepository.getCompanyInteraction(companyId, interactionId);
  const contact = companyRepository.getCompanyContact(companyId, interaction.contactId);
  const company = companyRepository.getCompanySummary(companyId);

  if (interaction) {
    res.render('interaction/interaction-details', {query, interaction, contact, company});
  } else {
    res.render('error', {error: 'Cannot find interaction'});
  }
}

function edit(req, res) {
  const companyId = req.params.companyId;
  const interactionId = req.params.interactionId;

  const query = req.query.query || '';

  if (!interactionId || !companyId) {
    res.redirect('/');
  }

  const company = companyRepository.getCompanySummary(companyId);
  const interaction = companyRepository.getCompanyInteraction(companyId, interactionId);
  const backUrl = `/companies/${companyId}/interaction/view/${interactionId}?query=${query}`;
  const contactOptions = getCompanyContactOptions(company);

  if (interaction) {
    res.render('interaction/interaction-edit', {
      query,
      interaction,
      company,
      backUrl,
      contactOptions,
      INTERACTION_TYPES,
      ADVISORS
    });
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
  let errors = validateForm(req);

  if (errors) {
    const company = companyRepository.getCompanySummary(companyId);
    const contactOptions = getCompanyContactOptions(company);
    let backUrl = `/companies/${companyId}?query=${query}`;
    res.render('interaction/interaction-edit', {
      query,
      interaction: req.body,
      company,
      backUrl,
      contactOptions,
      INTERACTION_TYPES,
      ADVISORS,
      errors
    });

    return;
  }

  let updatedInteraction = applyFormFieldsToInteraction(interaction, req.body);
  companyRepository.setCompanyInteraction(companyId, updatedInteraction);
  res.redirect(`/companies/${companyId}/interaction/view/${interactionId}?query=${query}`);

}

function add(req, res) {
  const companyId = req.params.companyId;
  const contactId = req.params.contactId;
  const query = req.query.query || '';
  const referer = req.headers.referer;

  if (!companyId) {
    res.redirect('/');
  }

  const company = companyRepository.getCompanySummary(companyId);
  const interaction = { companyId, contactId };

  let backUrl;
  if (referer.indexOf('contact') !== -1) {
    backUrl = `/companies/${companyId}/contact/view/${contactId}?query=${query}#interactions`;
  } else {
    backUrl = `/companies/${companyId}/?query=${query}#interactions`;
  }

  console.log(INTERACTION_TYPES);

  res.render('interaction/interaction-add', {
    query,
    interaction,
    company,
    backUrl,
    INTERACTION_TYPES,
    ADVISORS
  });
}

function addPost(req, res) {
  let companyId = req.params.companyId;
  let contactId = req.params.contactId;
  let query = req.query.query || '';
  let referer = req.headers.referer;

  if (!companyId) {
    res.redirect('/');
  }
  let company = companyRepository.getCompanySummary(companyId);

  let backUrl;
  if (referer.indexOf('contact') !== -1) {
    backUrl = `/companies/${companyId}/contact/view/${contactId}?query=${query}#interactions`;
  } else {
    backUrl = `/companies/${companyId}/?query=${query}#interactions`;
  }

  let errors = validateForm(req);

  if (errors) {
    const contactOptions = getCompanyContactOptions(company);
    res.render('interaction/interaction-add', {
      query,
      interaction: req.body,
      company,
      backUrl,
      contactOptions,
      INTERACTION_TYPES,
      ADVISORS,
      errors
    });
    return;
  }

  let updatedInteraction = applyFormFieldsToInteraction({}, req.body);
  companyRepository.setCompanyInteraction(companyId, updatedInteraction);
  res.redirect(backUrl);

}

function validateForm(req) {

  req.checkBody({
    'type': {
      notEmpty: {
        errorMessage: 'You must provide the type for this interaction'
      }
    },
    'subject': {
      notEmpty: {
        errorMessage: 'Please provide a brief subject for this interaction'
      }
    },
    'date': {
      notEmpty: {
        errorMessage: 'You must provide a date the interaction took place.'
      }
    },
    'contactId': {
      notEmpty: {
        errorMessage: 'Please provide the name of the company contact for this interaction'
      }
    },
    'advisor': {
      notEmpty: {
        errorMessage: 'Provide the UKTI advisor involved in this interaction'
      }
    },
    'serviceOffer': {
      notEmpty: {
        errorMessage: 'Please provide service offer for the interaction'
      }
    },
    'serviceProvider': {
      notEmpty: {
        errorMessage: 'Please provide the service provider for the interaction'
      }
    }
  });

  return transformErrors(req.validationErrors());
}

function applyFormFieldsToInteraction(interaction, formData) {
  return Object.assign(interaction, formData);
}

function getCompanyContactOptions(company) {
  return company.contacts.map((contact) => {
    return { label: contact.name, value: contact.id };
  });
}


module.exports = {
  get,
  edit,
  editPost,
  add,
  addPost
};
