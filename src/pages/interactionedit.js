/* eslint-disable max-len */

require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const InteractionForm = require('../forms/interactionform');
const SearchBar = require('../controls/searchbar');

const editElement = document.getElementById('interaction-form');
const contact = dh.data.contact;
const company = dh.data.company;
const interaction = dh.data.interaction;
let backUrl, backTitle, title;

if (contact) {
  backUrl = `/contact/${contact.id}/view#interactions`;
  backTitle = 'contact';
  title = 'Add new interaction';
} else if (company) {
  backUrl = `/company/company_company/${company.id}#interactions`;
  backTitle = 'company';
  title = 'Add new interaction';
} else if (interaction) {
  backUrl = `/interaction/${interaction.id}/view`;
  backTitle = 'interaction';
  title = 'Edit interaction';
} else {
  backUrl = '/';
  backTitle = 'home';
  title = 'Add contact';
}

ReactDOM.render(
  <div>
    <a className="back-link" href={backUrl}>Back to {backTitle}</a>
    <h1 className="heading-xlarge">{title}</h1>
    <InteractionForm
      company={company}
      contact={contact}
      interaction={interaction}
    />
  </div>,
  editElement
);

new SearchBar(document.querySelector('.searchbar'));
