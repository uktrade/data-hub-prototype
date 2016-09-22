/* globals interactions: true, company: true, contacts: true */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ContactTable from './components/contacttable.component';
import CompanyInteractionTable from './components/companyinteractiontable.component';
import { addClass, removeClass } from './utils/classtuff';

const addedCountElement = document.getElementById('added-count');
const archiveForm = document.getElementById('archive-details');
const archiveButton = document.getElementById('archive-reveal-button');
const cancelButton = document.getElementById('cancel-archive-button');
const archiveReasonElement = document.getElementById('archive_reason');
const archiveReasonGroup = document.getElementById('archive_reason-wrapper');

if (contacts && contacts.length > 0) {
  ReactDOM.render(
    <ContactTable contacts={contacts} company={company} archived={false} />,
    document.querySelector('#contact-table-wrapper')
  );

  ReactDOM.render(
    <ContactTable contacts={contacts} company={company} archived />,
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
