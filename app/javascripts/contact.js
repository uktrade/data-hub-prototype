/* globals interactions: true, company: true */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ContactInteractionTable from './components/contactinteractiontable.component';

if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <ContactInteractionTable interactions={interactions} company={company}/>,
    document.querySelector('#interaction-table-wrapper')
  );
}
