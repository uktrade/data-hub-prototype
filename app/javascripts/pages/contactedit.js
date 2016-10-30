import React from 'react';
import ReactDOM from 'react-dom';
import {ContactForm} from '../forms/contactform';
import axios from 'axios';

const editElement = document.getElementById('contact-form');
const contactId = editElement.getAttribute('data-contact-id');
const companyId = editElement.getAttribute('data-company-id');

function getBackLink(opts) {

  // if called with a company id, go back to company
  if (opts.company) {
    return {
      url: `/company/company_company/${opts.company.id}#contacts`,
      title: 'company'
    };
  } else if (opts.contact) {
    return {
      url: `/contact/${opts.contact.id}/view`,
      title: 'contact'
    };
  } else if (opts.lead) {
    return null;
  }

  return {url: '/', title: 'home'};
}


function render( opts = {} ){

  const heading = ( opts.heading || 'Add new contact' );
  const lead = editElement.getAttribute( 'data-lead' );
  const back = getBackLink(opts);


  ReactDOM.render(
    <div>
      {back &&
        <a className="back-link" href={back.url}>Back to {back.title}</a>
      }
      <h1 className="heading-xlarge">
        { heading }
      </h1>
      <ContactForm contact={opts.contact} company={opts.company} lead={lead}/>
    </div>,
    editElement
  );
}

if (contactId && contactId.length > 0) {
  axios
    .get(`/contact/${contactId}/json`)
    .then(result => {
      render({ heading: 'Edit contact', contact: result.data });
    });
} else if (companyId && companyId.length > 0) {
  axios
    .get(`/company/${companyId}/json`)
    .then(result => {
      render({ company: result.data });
    });
} else {
    render();
}
