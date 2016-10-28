import React from 'react';
import ReactDOM from 'react-dom';
import {ContactForm} from '../forms/contactform';
import axios from 'axios';

const editElement = document.getElementById('contact-form');
const contactId = editElement.getAttribute('data-contact-id');
const companyId = editElement.getAttribute('data-company-id');

function render( opts = {} ){

  const heading = ( opts.heading || 'Add new contact' );
  const lead = editElement.getAttribute( 'data-lead' );

  ReactDOM.render(
    <div>
      <a className="back-link" href='/'>Back to home</a>
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
