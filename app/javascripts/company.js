/* globals interactions: true, company: true, contacts: true */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ContactTable from './components/contacttable.component';
import CompanyInteractionTable from './components/companyinteractiontable.component';


if (contacts && contacts.length > 0) {
  ReactDOM.render(
    <ContactTable contacts={contacts} company={company}/>,
    document.querySelector('#contact-table-wrapper')
  );
}

if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <CompanyInteractionTable interactions={interactions} company={company}/>,
    document.querySelector('#interaction-table-wrapper')
  );
}
