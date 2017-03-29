/* eslint no-new: 0 */
const Facets = require('../controls/facets')

document.addEventListener(
  'DOMContentLoaded',
  function () {
    new Facets(document.getElementById('facets'), document.getElementById('result-summary'))
  },
  false
)
