/* globals interactions: true, company: true */
import { addClass, removeClass } from '../utils/classtuff';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ContactInteractionTable from '../components/contactinteractiontable.component';

const archiveForm = document.getElementById('archive-details');
const archiveButton = document.getElementById('archive-reveal-button');
const cancelButton = document.getElementById('cancel-archive-button');
const archiveReasonElement = document.getElementById('archive_reason');
const archiveReasonGroup = document.getElementById('archive_reason-wrapper');


if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <ContactInteractionTable interactions={interactions} company={company} />,
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
