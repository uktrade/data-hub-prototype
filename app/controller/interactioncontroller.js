/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
const interactionRepository = require('../repository/interactionrepository');
const controllerUtils = require('../lib/controllerutils');

function view(req, res) {
  let interaction_id = req.params.interaction_id;

  if (!interaction_id) {
    res.redirect('/');
  }

  interactionRepository.getInteraction(interaction_id)
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

  res.render('interaction/interaction-edit', {
    companyId: null,
    contactId: null,
    interactionId
  });
}

function add(req, res) {

  const companyId = req.query.company_id;
  const contactId = req.query.contact_id;

  res.render('interaction/interaction-edit', {
    companyId,
    contactId,
    interactionId: null
  });
}

function post(req, res) {

  let interaction = Object.assign({}, req.body.interaction);

  controllerUtils.flattenIdFields(interaction);
  controllerUtils.nullEmptyFields(interaction);

  interactionRepository.saveInteraction(interaction)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      let errors = error.error;
      res.status(400).json({errors});
    });
}

function getJson(req, res) {
  let id = req.params.sourceId;

  interactionRepository.getInteraction(id)
    .then((interaction) => {

      if (interaction.dit_advisor && interaction.dit_advisor.id) {
        interaction.dit_advisor.name = `${interaction.dit_advisor.first_name} ${interaction.dit_advisor.last_name}`;
      }

      res.json(interaction);
    })
    .catch((error) => {
      res.render('error', {error});
    });
}


router.get('/add?', add);
router.get('/:interaction_id/edit', edit);
router.get('/:interaction_id/view', view);
router.get('/:sourceId/json?', getJson);
router.post('/', post);

module.exports = {
  view,
  edit,
  post,
  router
};
