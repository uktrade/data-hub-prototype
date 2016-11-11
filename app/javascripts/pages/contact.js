/* globals interactions: true, company: true */
import { addClass, removeClass } from '../utils/elementstuff';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {InteractionTableComponent as InteractionTable} from '../components/interactiontable.component';
import Tabs from '../controls/tabs';
import SearchBar from '../controls/searchbar';

const archiveForm = document.getElementById('archive-details');
const archiveButton = document.getElementById('archive-reveal-button');
const cancelButton = document.getElementById('cancel-archive-button');
const archiveReasonElement = document.getElementById('archived_reason');
const archiveReasonGroup = document.getElementById('archived_reason-wrapper');

new SearchBar(document.querySelector('.searchbar'));
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
