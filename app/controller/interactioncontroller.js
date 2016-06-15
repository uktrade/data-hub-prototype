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
  const contactId = req.params.contactId;
  const query = req.query.query || '';

  if (!companyId) {
    res.redirect('/');
  }
  const company = companyRepository.getCompanySummary(companyId);

  let interaction;
  if (req.body && Object.keys(req.body).length > 0) {
    interaction = req.body;
  } else if (interactionId) {
    interaction = companyRepository.getCompanyInteraction(companyId, interactionId);
  } else {
    interaction = {};
  }

  let contact;
  if (interaction && interaction.contactId) {
    contact = companyRepository.getCompanyContact(companyId, interaction.contactId);
  } else if (contactId) {
    contact = companyRepository.getCompanyContact(companyId, contactId);
  }

  const backUrl = getBackUrl(req);
  const contactOptions = getCompanyContactOptions(company);
  const errors = req.validationErrors();

  res.render('interaction/interaction-edit', {
    query,
    interaction,
    company,
    contact,
    backUrl,
    contactOptions,
    errors: transformErrors(errors),
    INTERACTION_TYPES,
    ADVISORS
  });

}

function post(req, res) {
  const companyId = req.params.companyId;
  const interactionId = req.params.interactionId;

  if (!companyId) {
    res.redirect('/');
  }

  sanitizeForm(req);
  let errors = validateForm(req);

  if (errors) {
    edit(req, res);
    return;
  }

  const backUrl = getBackUrl(req);
  const interaction = interactionId ? companyRepository.getCompanyInteraction(companyId, interactionId) : {};
  let updatedInteraction = applyFormFieldsToInteraction(interaction, req.body);
  companyRepository.setCompanyInteraction(companyId, updatedInteraction);
  res.redirect(backUrl);

}

function getBackUrl(req) {

  const companyId = req.params.companyId;
  const interactionId = req.params.interactionId;
  const contactId = req.params.contactId;
  const query = req.query.query || '';
  let backUrl;

  // if adding a  new interaction,
  // go back to company interactions or contact interaction
  if (!interactionId) {
    if (!contactId) {
      backUrl = `/companies/${companyId}/?query=${query}#interactions`;
    } else {
      backUrl = `/companies/${companyId}/contact/view/${contactId}?query=${query}#interactions`;
    }
  } else {
    backUrl = `/companies/${companyId}/interaction/view/${interactionId}?query=${query}`;
  }

  return backUrl;

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
    'notes': {
      notEmpty: {
        errorMessage: 'You must provide notes, describing the interaction'
      }
    },
    'date': {
      notEmpty: {
        errorMessage: 'You must provide a date the interaction took place.'
      },
      isDate: {
        errorMessage: 'You must provide a valid date.'
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
    return { label: `${contact.firstname} ${contact.lastname}`, value: contact.id };
  });
}

function sanitizeForm(req) {
  // join date parts
  try {
    req.body.date = `${req.body.date_day}/${req.body.date_month}/${req.body.date_year}`;
    delete req.body.date_day;
    delete req.body.date_month;
    delete req.body.date_year;
  } catch (err) {
    console.warn('Error handling date');
  }
}

module.exports = {
  get,
  edit,
  post
};
