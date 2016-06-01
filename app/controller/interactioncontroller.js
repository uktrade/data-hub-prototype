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
  applyFormFieldsToInteraction(interaction, req.body)
    .then((updatedInteraction) => {
      companyRepository.setCompanyInteraction(companyId, updatedInteraction);
      res.redirect(`/companies/${companyId}/interaction/view/${interactionId}?query=${query}`);
    })
    .catch(({updatedInteraction, errors}) => {
      let backUrl = `/companies/${companyId}?query=${query}`;
      res.render('interaction/interaction-edit', {query, interaction: updatedInteraction, backUrl, errors});
    });

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
  let referer = req.headers.referer;

  if (!companyId) {
    res.redirect('/');
  }

  let backUrl;
  if (referer.indexOf('contact') !== -1) {
    backUrl = `/companies/${companyId}/contact/view/${contactId}?query=${query}#interactions`;
  } else {
    backUrl = `/companies/${companyId}/?query=${query}#interactions`;
  }

  applyFormFieldsToInteraction({}, req.body)
    .then((updatedInteraction) => {
      companyRepository.setCompanyInteraction(companyId, updatedInteraction);

      if (referer.indexOf('contact') !== -1) {
        res.redirect(backUrl);
      } else {
        res.redirect(backUrl);
      }

    })
    .catch(({updatedInteraction, errors}) => {
      res.render('interaction/interaction-edit', {query, interaction: updatedInteraction, backUrl, errors});
    });

}


function applyFormFieldsToInteraction(interaction, formData) {

  let updatedInteraction = Object.assign({}, interaction);
  let errors = {};

  return new Promise((accept, reject) => {

    if (!updatedInteraction.contact) {
      updatedInteraction.contact = {};
    }

    if (!formData.type || formData.type.length === 0) {
      errors.type = 'You must enter an interaction type';
    } else {
      updatedInteraction.type = formData.type;
    }

    if (!formData.subject || formData.subject.length === 0) {
      errors.subject = 'You must provide a subject for this interaction';
    } else {
      updatedInteraction.subject = formData.subject;
    }

    if (!formData.date || formData.date === 0) {
      errors.date = 'You must enter the date of the interaction';
    } else {
      updatedInteraction.date = formData.date;
    }

    if (!formData.contactName || formData.contactName.length === 0) {
      errors.contactName = 'Enter a contact name at the company';
    } else {
      updatedInteraction.contact.name = formData.contactName;
      updatedInteraction.contact.id = formData.contactId;
    }

    if (!formData.advisor || formData.advisor.length === 0) {
      errors.advisor = 'Enter the name of the advisor working for UKTI';
    } else {
      updatedInteraction.advisor = formData.advisor;
    }

    updatedInteraction.notes = formData.notes;

    if (!formData.serviceOffer || formData.serviceOffer.length === 0) {
      errors.serviceOffer = 'You must enter a service offer for this interaction';
    } else {
      updatedInteraction.serviceOffer = formData.serviceOffer;
    }

    if (!formData.serviceProvider || formData.serviceProvider.length === 0) {
      errors.serviceProvider = 'You must enter the service provider';
    } else {
      updatedInteraction.serviceProvider = formData.serviceProvider;
    }

    if (Object.keys(errors).length > 0) {
      reject({updatedInteraction, errors});
    } else {
      accept(updatedInteraction);
    }

  });

}



module.exports = {
  get,
  edit,
  editPost,
  add,
  addPost
};
