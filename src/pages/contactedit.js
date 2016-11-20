/* global dh:true, document: true */
require('babel-polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const ContactForm = require('../forms/contactform');

const editElement = document.getElementById('contact-form');
const contact = dh.data.contact;
const company = dh.data.company;
let backUrl;
let backTitle;
let title;

if (company) {
  backUrl = `/company/company_company/${company.id}#contacts`;
  backTitle = 'company';
  title = 'Add new contact';
} else if (contact) {
  backUrl = `/contact/${contact.id}/view`;
  backTitle = 'contact';
  title = 'Edit contact';
} else {
  backUrl = '/';
  backTitle = 'home';
  title = 'Add contact';
}


ReactDOM.render(
  <ContactForm contact={contact} company={company} />,
  editElement,
);
