import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ContactTable from './components/contacttable.component';
import InteractionTable from './components/interactiontable.component';


if (company.contacts && company.contacts.length > 0) {
  ReactDOM.render(
    <ContactTable contacts={company.contacts} company={company} query={query}/>,
    document.querySelector('#contact-table-wrapper')
  );
}

if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <InteractionTable interactions={interactions} company={company} query={query}/>,
    document.querySelector('#interaction-table-wrapper')
  );
}
