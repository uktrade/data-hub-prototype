'use strict';

import React from 'react';
import {render} from 'react-dom';
import CompaniesList from './components/CompaniesList';
import Mojular from 'mojular';

const companiesElement = document.getElementById('companies');

if (companiesElement) {
  render(
    <CompaniesList />,
    companiesElement
  );
}

Mojular
  .use([
    require('mojular-govuk-elements'),
    require('mojular-moj-elements')
  ])
  .init();
