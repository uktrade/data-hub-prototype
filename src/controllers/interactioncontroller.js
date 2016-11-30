const express = require('express');

const React = require('react');
const ReactDom = require('react-dom/server');
const Router = require('react-router');
const AsyncProps = require('async-props').default;
const loadPropsOnServer = require('async-props').loadPropsOnServer;
const interactionRepository = require('../repositorys/interactionrepository');
const controllerUtils = require('../lib/controllerutils');
const routesConfig = require('../reactrouting/interactionroutes').routesConfig;


const router = express.Router();

function index(req, res) {
  const token = req.session.token;
  const csrfToken = controllerUtils.genCSRF(req);

  Router.match({ routes: routesConfig, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      renderProps.params = Object.assign({ token }, req.query, renderProps.params);
      loadPropsOnServer(renderProps, {}, (err, asyncProps, scriptTag) => {
        const markup = ReactDom.renderToString(<AsyncProps {...renderProps} {...asyncProps} />);
        res.render('interaction/interaction-react', { markup, scriptTag, csrfToken });
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
      res.render('error', { error });
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
        return res.status(error.response.statusCode).json({ errors: [{ error: error.response.statusMessage }] });
      }

      const errors = error.error;
      return res.status(400).json({ errors });
    });
}


router.get('/interaction/*', index);
router.get('/api/interaction/:interactionId', get);
router.post('/api/interaction', post);

module.exports = { router };
