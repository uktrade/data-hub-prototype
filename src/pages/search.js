/* eslint no-new: 0 */
require('babel-polyfill')
const Facets = require('../controls/facets')

document.addEventListener(
  'DOMContentLoaded',
  function () {
    new Facets(document.getElementById('facets'), document.getElementById('result-summary'))
  },
  false
)
