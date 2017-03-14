/* eslint new-cap: 0 */
'use strict'

const express = require('express')
const router = express.Router()

function myAccount (req, res) {
  res.render('myaccount/index')
}

router.get('/', myAccount)

module.exports = {router}
