'use strict';

require('babel-polyfill');
const SearchBar = require('../controls/searchbar');
const Facets = require('../controls/facets');

document.addEventListener(
  'DOMContentLoaded',
  function() {
    new Facets(document.getElementById('facets'), document.getElementById('result-summary'));
    new SearchBar(document.querySelector('.searchbar'));
  },
  false
);
