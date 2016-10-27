/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
const interactionRepository = require('../repository/interactionrepository');


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

  sanitizeForm(req);

  interactionRepository.saveInteraction(req.body)
    .then((savedInteraction) => {

      // If the url has a contact id query param, we added a
      // interaction from the contact screen, likewise for company id
      if (req.query.contact_id) {
        res.redirect(`/contact/${req.query.contact_id}/view#interactions`);
        return;
      } else if (req.query.company_id) {
        res.redirect(`/company/DIT/${req.query.company_id}#interactions`);
        return;
      }

      // otherwise we editing the interaction so go back to that screen.
      res.redirect(`/interaction/${savedInteraction.id}/view`);
    })
    .catch((error) => {
      req.errors = error.response.body;
      view(req, res);
    });
}

function getJson(req, res) {
  let id = req.params.sourceId;

  interactionRepository.getInteraction(id)
    .then((interaction) => {
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
router.post(['/'], post);

module.exports = {
  view,
  edit,
  post,
  router
};
