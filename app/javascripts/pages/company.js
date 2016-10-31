/* globals interactions: true, company: true, contacts: true */

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {CompanyForm} from '../forms/companyform';
import ContactTable from '../components/contacttable.component';
import CompanyInteractionTable from '../components/companyinteractiontable.component';
import { addClass, removeClass } from '../utils/classtuff';

const addedCountElement = document.getElementById('added-count');
const archiveForm = document.getElementById('archive-details');
const archiveButton = document.getElementById('archive-reveal-button');
const cancelButton = document.getElementById('cancel-archive-button');
const archiveReasonElement = document.getElementById('archive_reason');
const archiveReasonGroup = document.getElementById('archive_reason-wrapper');
import axios from 'axios';



if (contacts && contacts.length > 0) {
  ReactDOM.render(
    <ContactTable contacts={contacts} company={company} archived={false} />,
    document.querySelector('#contact-table-wrapper')
  );

  ReactDOM.render(
    <ContactTable contacts={contacts} company={company} archived />,
    document.querySelector('#archived-contact-table-wrapper')
  );

  let validContacts = contacts.filter((contact) => !contact.archived_on);
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

import $ from 'jquery';
import Edit from '../edit';
import SearchBar from '../searchbar';
import Tabs from '../tabs';

$('.js-hidden-edit').each((index, element) => {
  new Edit(element);
});


new SearchBar('js-searchbar');
$('.searchbar').each((index, element) => {
  new SearchBar(element);
});
new Tabs('.js-tabs');


const editElement = document.getElementById('company-edit');


function postProcessCompany(company) {
  if (!company.export_to_countries || company.export_to_countries.length === 0) {
    company.export_to_countries = [{id: null, name: ''}];
  }
  if (!company.future_interest_countries || company.future_interest_countries.length === 0) {
    company.future_interest_countries = [{id: null, name: ''}];
  }

  if (company.trading_address && !company.trading_address.address_country) {
    company.trading_address = {
      address_1: '',
      address_2: '',
      address_town: '',
      address_county: '',
      address_postcode: '',
      address_country: null
    };
  }

}

const companyId = editElement.getAttribute('data-company-id');

axios
  .get(`/company/company_company/${companyId}/json`)
  .then(result => {
    let company = result.data;
    postProcessCompany(company);
    ReactDOM.render(<CompanyForm company={company}/>, editElement);
  });
