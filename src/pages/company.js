/* globals interactions: true, company: true, contacts: true, document: true */

require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');

const CompanyForm = require('../forms/companyform');
const ContactTable = require('../components/contacttable.component');
const InteractionTable = require('../components/interactiontable.component');
const { addClass, removeClass } = require('../lib/elementstuff');
const Edit = require('../controls/edit');
const Tabs = require('../controls/tabs');

new Edit(document.querySelector('.js-hidden-edit'));
new Tabs(document.querySelector('.js-tabs'));

const archiveForm = document.getElementById('archive-details');
const archiveButton = document.getElementById('archive-reveal-button');
const cancelButton = document.getElementById('cancel-archive-button');
const archiveReasonElement = document.getElementById('archived_reason');
const archiveReasonGroup = document.getElementById('archived_reason-wrapper');


if (contacts && contacts.length > 0) {
  const validContacts = contacts.filter(contact => !contact.archived);
  const archivedContacts = contacts.filter(contact => contact.archived);

  ReactDOM.render(
    <ContactTable contacts={validContacts} />,
    document.querySelector('#contact-table-wrapper'),
  );

  ReactDOM.render(
    <ContactTable contacts={archivedContacts} archived />,
    document.querySelector('#archived-contact-table-wrapper'),
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
    <InteractionTable interactions={interactions} />,
    document.querySelector('#interaction-table-wrapper'),
  );
}


function revealArchive(event) {
  event.preventDefault();
  removeClass(archiveForm, 'hidden');
  addClass(archiveButton, 'hidden');
  archiveForm.scrollIntoView();
}

function hideArchive(event) {
  event.preventDefault();
  addClass(archiveForm, 'hidden');
  removeClass(archiveButton, 'hidden');
}

function showArchiveError() {
  addClass(archiveReasonGroup, 'error');
}

function submitArchiveForm(event) {
  const reason = archiveReasonElement.options[archiveReasonElement.selectedIndex].value;
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


ReactDOM.render(<CompanyForm company={company} />, document.getElementById('company-edit'));
