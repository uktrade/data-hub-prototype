const express = require('express');

const React = require('react');
const ReactDom = require('react-dom/server');
const Router = require('react-router');
const AsyncProps = require('async-props').default;
const loadPropsOnServer = require('async-props').loadPropsOnServer;
const interactionRepository = require('../repositorys/interactionrepository');
const controllerUtils = require('../lib/controllerutils');
const routesConfig = require('../reactrouting/interactionroutes').routesConfig;
const metadataRepository = require('../repositorys/metadatarepository');

const router = express.Router();

function index(req, res) {
  const token = req.session.token;
  const csrfToken = controllerUtils.genCSRF(req);
  const user = res.locals.user;

  Router.match({ routes: routesConfig, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      renderProps.params = Object.assign({ token, user, referrer: req.headers.referer }, req.query, renderProps.params);
      loadPropsOnServer(renderProps, {}, (err, asyncProps, scriptTag) => {
        const markup = ReactDom.renderToString(<AsyncProps {...renderProps} {...asyncProps} />);
        res.render('layouts/react', { markup, scriptTag, csrfToken, bundleName: 'interaction' });
      });
    } else {
      res.status(404).send('Not found');
    }
  });
}

function get(req, res) {
  const interactionId = req.params.interactionId;
  if (!interactionId) {
    res.redirect('/');
  }

  interactionRepository.getInteraction(req.session.token, interactionId)
    .then((contact) => {
      res.json(contact);
    })
    .catch((error) => {
      const errors = error.error;
      return res.status(error.response.statusCode).json({ errors });
    });
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
        return res.status(error.response.statusCode).json({ errors: { detail: error.response.statusMessage } });
      }

      const errors = error.error;
      return res.status(error.response.statusCode).json({ errors });
    });
}

function getAddStep1(req, res) {
  const interactionTypes = [...metadataRepository.TYPES_OF_INTERACTION, { id: 999, name: 'Service delivery', selectable: true }];

  const selectableTypes = interactionTypes
    .filter(selectableType => selectableType.selectable)
    .sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

  // Split the list into 2 to show as 2 columns
  const halfWay = Math.ceil(selectableTypes.length / 2);
  const interactionTypeColA = [];
  const interactionTypeColB = [];

  for (let pos = 0; pos < halfWay; pos += 1) {
    interactionTypeColA.push(selectableTypes[pos]);
  }

  for (let pos = halfWay; pos < selectableTypes.length; pos += 1) {
    interactionTypeColB.push(selectableTypes[pos]);
  }

  const csrfToken = controllerUtils.genCSRF(req);

  res.render('interaction/add-step-1.html', {
    query: req.query,
    csrfToken,
    interactionTypeColA,
    interactionTypeColB,
  });
}

function postAddStep1(req, res) {
  // error if no selection
  if (!req.body.interaction_type) {
    res.locals.errors = {
      interaction_type: ['You must select an interaction type'],
    };
    return getAddStep1(req, res);
  }

  // redirect to edit, passing param
  if (req.body.interaction_type === '999') {
    return res.redirect(`/servicedelivery/edit/?companyId=${req.body.companyId}&contactId=${req.body.contactId}`);
  }

  return res.redirect(`/interaction/edit/?companyId=${req.body.companyId}&contactId=${req.body.contactId}&interaction_type=${req.body.interaction_type}`);
}

function getEditInteraction(req, res) {
  if (req.id) {
    // go get the record and then figure the type
  }

  return res.render('interaction/edit-interaction.html', {
    query: req.query,
  });
}

function getEditServicedelivery(req, res) {
  if (req.id) {
    // go get the record and then figure the type
  }
  return res.render('interaction/edit-servicedelivery.html', {
    query: req.query,
  });
}

router.get('/interaction/details', index);
router.get(['/interaction/edit/:interactionId/', '/interaction/edit/'], getEditInteraction);
router.get(['/servicedelivery/edit/:interactionId/', '/servicedelivery/edit/'], getEditServicedelivery);
router.get('/interaction/add-step-1/', getAddStep1);
router.post('/interaction/add-step-1/', postAddStep1);
router.get('/api/interaction/:interactionId', get);
router.post('/api/interaction', post);

module.exports = { router };
