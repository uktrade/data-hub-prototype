'use strict';

import 'babel-polyfill';
import SearchBar from '../controls/searchbar';
import Facets from '../controls/facets';

document.addEventListener(
  'DOMContentLoaded',
  function() {
    new Facets(document.getElementById('facets'), document.getElementById('result-summary'));
    new SearchBar(document.querySelector('.searchbar'));
  },
  false
);
