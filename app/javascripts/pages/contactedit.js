/* eslint-disable max-len */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {ContactForm} from '../forms/contactform';

const editElement = document.getElementById('contact-form');
const contact = dh.data.contact;
const company = dh.data.company;
const lead = dh.data.lead;
let backUrl, backTitle, title;


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
  <div>
    <a className="back-link" href={backUrl}>Back to {backTitle}</a>
    <h1 className="heading-xlarge">{ title }</h1>
    <ContactForm contact={contact} company={company} lead={lead}/>
  </div>,
  editElement
);
