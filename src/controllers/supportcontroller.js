const express = require('express');
const axios = require('axios');
const Sniffr = require('sniffr');
const winston = require('winston');

const config = require('../config');
const controllerUtils = require('../lib/controllerutils');

const router = express.Router();

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function postToZen(ticket) {
  return axios.post(config.zenUrl,
    { ticket },
    {
      auth: {
        username: `${config.zenEmail}/token`,
        password: config.zenToken,
      },
    },
  );
}

function postBug(req, res) {
  const ticket = {
    requester: {
      name: req.body.name,
    },
    subject: req.body.subject,
    comment: {
      body: `Steps to reproduce:\n${req.body.description}\n\nWhat happens?\n${req.body.happens}`,
    },
    custom_fields: [
      { id: 33995605, value: req.body.browser },
      { id: 33883629, value: req.body.impact },
    ],
  };

  postToZen(ticket)
    .then(({ data }) => {
      req.flash('success-message', `Created new bug, reference number ${data.ticket.id}`);
      res.redirect('/support/thank');
    })
    .catch((error) => {
      winston.error(error);
      res.redirect('/error');
    });
}

function getBug(req, res) {
  const data = (req.body && req.body.length > 0) ? req.body : {};

  if (res.locals && res.locals.user && res.locals.user.name) {
    data.name = res.locals.user.name;
  } else {
    data.name = '';
  }

  const sniffr = new Sniffr();
  sniffr.sniff(req.headers['user-agent']);
  data.browser = `${capitalize(sniffr.browser.name)} ${sniffr.browser.version[0]}.${sniffr.browser.version[1]} - ${capitalize(sniffr.os.name)} ${sniffr.os.version[0]}.${sniffr.os.version[1]}`;
  data.csrfToken = controllerUtils.genCSRF(req);

  res.render('support/bug', { data });
}

function thank(req, res) {
  res.render('support/thank');
}


router.get('/bug', getBug);
router.post('/bug', postBug);
router.get('/thank', thank);

module.exports = { router };
