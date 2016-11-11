/* globals interactions: true, company: true, contacts: true */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {CompanyForm} from '../forms/companyform';
import ContactTable from '../components/contacttable.component';
import CompanyInteractionTable from '../components/companyinteractiontable.component';
import { addClass, removeClass } from '../utils/elementstuff';
import Edit from '../controls/edit';
import SearchBar from '../controls/searchbar';
import Tabs from '../controls/tabs';

const archiveForm = document.getElementById('archive-details');
const archiveButton = document.getElementById('archive-reveal-button');
const cancelButton = document.getElementById('cancel-archive-button');
const archiveReasonElement = document.getElementById('archived_reason');
const archiveReasonGroup = document.getElementById('archived_reason-wrapper');


if (contacts && contacts.length > 0) {
  const validContacts = contacts.filter((contact) => !contact.archived);
  const archivedContacts = contacts.filter((contact) => contact.archived);

  ReactDOM.render(
    <ContactTable contacts={validContacts}/>,
    document.querySelector('#contact-table-wrapper')
  );

  ReactDOM.render(
    <ContactTable contacts={archivedContacts} archived />,
    document.querySelector('#archived-contact-table-wrapper')
  );

  if (archivedContacts.length === 0) {
    addClass(document.getElementById('archived-section'), 'hidden');
  }
  if (validContacts.length === 0) {
    addClass(document.getElementById('contact-table-wrapper'), 'hidden');
  }

} else {
  const section = document.getElementById('archived-section');
  if (section) {
    addClass(section, 'hidden');
  }
}

if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <CompanyInteractionTable interactions={interactions} company={company}/>,
    document.querySelector('#interaction-table-wrapper')
  );
}


function revealArchive(event) {
  event.preventDefault();
  removeClass(document.getElementById('archive-details'), 'hidden');
  addClass(archiveButton, 'hidden');
}

function hideArchive(event) {
  event.preventDefault();
  addClass(document.getElementById('archive-details'), 'hidden');
  removeClass(archiveButton, 'hidden');
}

function showArchiveError() {
  addClass(archiveReasonGroup, 'error');
}

function submitArchiveForm(event) {
  let reason = archiveReasonElement.options[archiveReasonElement.selectedIndex].value;
  if (!reason) {
    event.preventDefault();
    showArchiveError();
  }
}

if (archiveButton) {
  archiveButton.addEventListener('click', revealArchive);
  cancelButton.addEventListener('click', hideArchive);
  archiveForm.addEventListener('submit', submitArchiveForm);
}



new Edit(document.querySelector('.js-hidden-edit'));
new SearchBar(document.querySelector('.searchbar'));
new Tabs(document.querySelector('.js-tabs'));

ReactDOM.render(<CompanyForm company={company}/>, document.getElementById('company-edit'));
