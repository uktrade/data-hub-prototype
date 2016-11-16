/* globals interactions: true */
require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const { addClass, removeClass } = require('../lib/elementstuff');
const InteractionTable = require('../components/interactiontable.component');
const Tabs = require('../controls/tabs');

const archiveForm = document.getElementById('archive-details');
const archiveButton = document.getElementById('archive-reveal-button');
const cancelButton = document.getElementById('cancel-archive-button');
const archiveReasonElement = document.getElementById('archived_reason');
const archiveReasonGroup = document.getElementById('archived_reason-wrapper');

new Tabs(document.querySelector('.js-tabs'));

if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <InteractionTable interactions={interactions} />,
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
