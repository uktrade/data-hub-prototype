/* globals interactions: true, company: true, contacts: true */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ContactTable from './components/contacttable.component';
import CompanyInteractionTable from './components/companyinteractiontable.component';
import { addClass } from './utils/classtuff';

const addedCountElement = document.getElementById('added-count');

if (contacts && contacts.length > 0) {
  ReactDOM.render(
    <ContactTable contacts={contacts} company={company} archived={false} />,
    document.querySelector('#contact-table-wrapper')
  );

  ReactDOM.render(
    <ContactTable contacts={contacts} company={company} archived={true} />,
    document.querySelector('#archived-contact-table-wrapper')
  );

  let validContacts = contacts.filter((contact) => !contact.archive_date);
  let archivedContacts = contacts.length - validContacts.length;

  addedCountElement.innerHTML = validContacts.length;

  if (archivedContacts === 0) {
    addClass(document.getElementById('archived-section'), 'hidden');
  }
  if (validContacts.length === 0) {
    addClass(document.getElementById('contact-table-wrapper'), 'hidden');
  }

} else {
  addClass(document.getElementById('archived-section'), 'hidden');
}

if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <CompanyInteractionTable interactions={interactions} company={company}/>,
    document.querySelector('#interaction-table-wrapper')
  );
}
