'use strict';

const Mojular = require('mojular');

Mojular
  .use([
    require('mojular-govuk-elements'),
    require('mojular-moj-elements')
  ])
  .init();
