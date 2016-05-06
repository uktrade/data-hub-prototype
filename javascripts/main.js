'use strict';

import Mojular from 'mojular';
import SearchBar from './searchbar';

Mojular
  .use([
    require('mojular-govuk-elements'),
    require('mojular-moj-elements'),
    require('./modules/tabs')
  ])
  .init();

new SearchBar('.searchbar');
