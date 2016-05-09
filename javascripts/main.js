'use strict';

import Mojular from 'mojular';

Mojular
  .use([
    require('mojular-govuk-elements'),
    require('mojular-moj-elements'),
    require('./modules/tabs'),
    require('./modules/edit'),
    require('./modules/addanother'),
  ])
  .init();
