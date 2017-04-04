const express = require('express')
const axios = require('axios')
const Sniffr = require('sniffr')
const winston = require('winston')

const config = require('../config')
const controllerUtils = require('../lib/controllerutils')

const router = express.Router()

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function postToZen (ticket) {
  return axios.post(config.zenUrl,
    { ticket },
    {
      auth: {
        username: `${config.zenEmail}/token`,
        password: config.zenToken
      }
    },
  )
}

function getBug (req, res) {
  const data = (req.body && req.body.length > 0) ? req.body : {}

  const sniffr = new Sniffr()
  sniffr.sniff(req.headers['user-agent'])
  data.browser = `${capitalize(sniffr.browser.name)} ${sniffr.browser.version[0]}.${sniffr.browser.version[1]} - ${capitalize(sniffr.os.name)} ${sniffr.os.version[0]}.${sniffr.os.version[1]}`
  data.csrfToken = controllerUtils.genCSRF(req)

  res.render('support/bug', {
    data,
    errors: req.errors
  })
}

function postBug (req, res) {
  req.checkBody({
    email: {
      optional: {
        options: { checkFalsy: true }
      },
      isEmail: {
        errorMessage: 'Invalid Email'
      }
    },
    title: {
      notEmpty: true
    },
    type: {
      notEmpty: true,
      errorMessage: 'You must select a type'
    }
  })

  req.getValidationResult()
    .then((validationResult) => {
      if (!validationResult.isEmpty()) {
        req.errors = controllerUtils.transformErrors(validationResult.array())
        return getBug(req, res)
      }

      const ticket = {
        requester: {
          email: (req.body.email && req.body.email.length > 0) ? req.body.email : 'Anonymous'
        },
        subject: req.body.title,
        comment: {
          body: (req.body.description && req.body.description.length > 0) ? req.body.description : 'N/A'
        },
        custom_fields: [
          { id: config.zenBrowser, value: req.body.browser },
          { id: config.zenService, value: 'datahub_export' }
        ],
        tags: [req.body.type]
      }

      return postToZen(ticket)
        .then(({ data }) => {
          req.flash('success-message', `Created new bug, reference number ${data.ticket.id}`)
          res.redirect('/support/thank')
        })
    })
    .catch((error) => {
      winston.error(error)
      req.errors = { error: 'Error posting feedback' }
      getBug(req, res)
    })
}

function thank (req, res) {
  res.render('support/thank')
}

router.get('/bug', getBug)
router.post('/bug', postBug)
router.get('/thank', thank)

module.exports = { router }
