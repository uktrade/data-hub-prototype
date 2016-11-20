const express = require('express');
const interactionRepository = require('../repositorys/interactionrepository');
const contactRepository = require('../repositorys/contactrepository');
const companyRepository = require('../repositorys/companyrepository');
const controllerUtils = require('../lib/controllerutils');
const React = require('react');
const ReactDom = require('react-dom/server');
const InteractionForm = require('../forms/interactionform');
const router = express.Router();

function view(req, res) {
  const interaction_id = req.params.interaction_id;
  const csrfToken = controllerUtils.genCSRF(req);

  if (!interaction_id) {
    res.redirect('/');
  }

  interactionRepository.getInteraction(req.session.token, interaction_id)
    .then((interaction) => {
      res.render('interaction/interaction-details', {
        interaction,
        csrfToken,
      });
    })
    .catch((error) => {
      res.render('error', { error });
    });
}

function edit(req, res) {
  const interactionId = req.params.interaction_id || null;
  const csrfToken = controllerUtils.genCSRF(req);

  interactionRepository.getInteraction(req.session.token, interactionId)
    .then((interaction) => {
      if (interaction.dit_advisor && !interaction.name) {
        interaction.dit_advisor.name = `${interaction.dit_advisor.first_name || ''} ${interaction.dit_advisor.last_name || ''}`;
      }
      const markup = ReactDom.renderToString(<InteractionForm interaction={ interaction } />);
      res.render('interaction/interaction-edit', {
        company: null,
        contact: null,
        interaction: (interaction || null),
        csrfToken,
        markup
      });
    });
}

function add(req, res) {
  const companyId = req.query.company_id;
  const contactId = req.query.contact_id;
  const csrfToken = controllerUtils.genCSRF(req);

  if (contactId && contactId.length > 0) {
    contactRepository.getContact(req.session.token, contactId)
      .then((contact) => {
        const markup = ReactDom.renderToString(<InteractionForm contact={contact} company={contact.company} />);

        res.render('interaction/interaction-edit', {
          company: contact.company,
          contact,
          interactionId: null,
          interaction: null,
          csrfToken,
          markup,
        });
      });
  } else if (companyId && companyId.length > 0) {
    companyRepository.getDitCompany(req.session.token, companyId)
      .then((company) => {
        const markup = ReactDom.renderToString(<InteractionForm company={contact.company} />);
        res.render('interaction/interaction-edit', {
          company,
          contact: null,
          interactionId: null,
          interaction: null,
          csrfToken,
          markup,
        });
      });
  } else {
    res.redirect('/');
  }
}

function post(req, res) {
  const interaction = Object.assign({ }, req.body.interaction);

  controllerUtils.flattenIdFields(interaction);
  controllerUtils.nullEmptyFields(interaction);
  controllerUtils.genCSRF(req, res);

  interactionRepository.saveInteraction(req.session.token, interaction)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      if (typeof error.error === 'string') {
        return res.status(error.response.statusCode).json({ errors: [{ error: error.response.statusMessage }] });
      }

      const errors = error.error;
      return res.status(400).json({ errors });
    });
}


router.get('/add?', add);
router.get('/:interaction_id/edit', edit);
router.get('/:interaction_id/view', view);
router.post('/', post);

module.exports = {
  view,
  edit,
  post,
  router,
};
