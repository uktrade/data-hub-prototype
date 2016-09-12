/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
const contactRepository = require('../repository/contactrepository');
const companyRepository = require('../repository/companyrepository');
const interactionRepository = require('../repository/interactionrepository');
const INTERACTION_TYPES = require('../../data/interactiontypes.json');
const ADVISORS = require('../../data/advisors.json');


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
  const interactionId = req.params.interaction_id;

  interactionRepository.getInteraction(interactionId)
    .then((interaction) => {
      // Convert YYYY-MM-DD format to dd/mm/yyyy format expected by date control.
      if (interaction.date_of_interaction && interaction.date_of_interaction.length > 0) {
        let splitDate = interaction.date_of_interaction.split('-');
        interaction.date_of_interaction = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
      }

      contactRepository.getContactsForCompany(interaction.company.id)
        .then((contacts) => {
          res.render('interaction/interaction-edit', {
            interaction: interaction,
            contactOptions: getCompanyContactOptions(contacts),
            errors: req.errors,
            INTERACTION_TYPES,
            ADVISORS
          });
        });
    });
}

function add(req, res) {

  const companyId = req.query.company_id;
  const contactId = req.query.contact_id;

  if (contactId) {
    let result = {};
    contactRepository.getContact(contactId)
      .then((contact) => {
        result.contact = contact;
        result.company = contact.company;
        return contactRepository.getContactsForCompany(contact.company.id);
      })
      .then((contacts) => {
        result.contacts = contacts;
        res.render('interaction/interaction-edit', {
          interaction: {
            contact: result.contact,
            company: result.company
          },
          contactOptions: getCompanyContactOptions(contacts),
          errors: req.errors,
          INTERACTION_TYPES,
          ADVISORS
        });
      });
  } else if (companyId) {
    companyRepository.getDitCompany(companyId)
      .then((company) => {
        res.render('interaction/interaction-edit', {
          interaction: {
            company: company,
            contact: {
              id: null
            }
          },
          contactOptions: getCompanyContactOptions(company.contacts),
          errors: req.errors,
          INTERACTION_TYPES,
          ADVISORS
        });
      });
  }
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

function sanitizeForm(req) {
  // join date parts
  try {

    if (req.body.date_of_interaction_day && req.body.date_of_interaction_day.length === 1) {
      req.body.date_of_interation_day = `0${req.body.date_of_interaction_day}`;
    }

    if (req.body.date_of_interaction_month && req.body.date_of_interaction_month.length === 1) {
      req.body.date_of_interaction_month = `0${req.body.date_of_interaction_month}`;
    }

    req.body.date_of_interaction =
      `${req.body.date_of_interaction_year}-${req.body.date_of_interaction_month}-${req.body.date_of_interaction_day}`;

    delete req.body.date_of_interaction_day;
    delete req.body.date_of_interaction_month;
    delete req.body.date_of_interaction_year;
  } catch (err) {
    // console.warn('Error handling date');
  }
}

function getCompanyContactOptions(contacts) {
  let result = {};

  for (let contact of contacts) {
    result[contact.id] = `${contact.first_name} ${contact.last_name}`;
  }

  return result;
}

router.get('/add?', add);
router.get('/:interaction_id/edit', edit);
router.get('/:interaction_id/view', view);
router.post(['/add', '/:interaction_id/edit'], post);

module.exports = {
  view,
  edit,
  post,
  router
};
