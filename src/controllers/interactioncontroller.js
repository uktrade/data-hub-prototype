/* eslint new-cap: 0 */
'use strict';

const express = require('express');
const router = express.Router();
const interactionRepository = require('../repositorys/interactionrepository');
const contactRepository = require('../repositorys/contactrepository');
const companyRepository = require('../repositorys/companyrepository');

const controllerUtils = require('../lib/controllerutils');

function view(req, res) {
  let interaction_id = req.params.interaction_id;

  if (!interaction_id) {
    res.redirect('/');
  }

  interactionRepository.getInteraction( req.session.token, interaction_id)
    .then((interaction) => {
      res.render('interaction/interaction-details', {
        interaction
      });

    })
    .catch((error) => {
      res.render('error', {error});
    });

}

function edit(req, res) {
  let interactionId = req.params.interaction_id || null;

  interactionRepository.getInteraction( req.session.token, interactionId)
    .then((interaction) => {
      res.render('interaction/interaction-edit', {
        company: null,
        contact: null,
        interaction: ( interaction || null )
      });
    });
}

function add(req, res) {

  const companyId = req.query.company_id;
  const contactId = req.query.contact_id;

  if (contactId && contactId.length > 0) {
    contactRepository.getContact(req.session.token, contactId)
      .then((contact) => {
        res.render('interaction/interaction-edit', {
          company: contact.company,
          contact,
          interactionId: null,
          interaction: null
        });
      });
  } else if (companyId && companyId.length > 0) {
    companyRepository.getDitCompany(req.session.token, companyId)
      .then((company) => {
        res.render('interaction/interaction-edit', {
          company,
          contact: null,
          interactionId: null,
          interaction: null
        });
      });
  } else {
    res.redirect('/');
  }

}

function post(req, res) {

  let interaction = Object.assign({}, req.body.interaction);

  controllerUtils.flattenIdFields(interaction);
  controllerUtils.nullEmptyFields(interaction);

  interactionRepository.saveInteraction(req.session.token, interaction)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      if (typeof error.error === 'string') {
        return res.status(error.response.statusCode).json({errors: [{'error': error.response.statusMessage}]});
      }

      let errors = error.error;
      return res.status(400).json({errors});
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
  router
};
