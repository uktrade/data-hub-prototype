import React from 'react';
import ReactDOM from 'react-dom';
import {ContactForm} from './sections/contactform';
import axios from 'axios';


const editElement = document.getElementById('contact-form');
const companyId = editElement.getAttribute('data-company-id');
const contactId = editElement.getAttribute('data-contact-id');

if (contactId && contactId.length > 0) {
  axios
    .get(`/contact/${contactId}/json`)
    .then(result => {
      let contact = result.data;

      ReactDOM.render(
        <div>
          <a className="back-link" href='/'>Back to home</a>
          <h1 className="heading-xlarge">
            Edit contact
          </h1>
          <ContactForm contact={contact}/>
        </div>,
        editElement
      );
    });
} else if (companyId && companyId.length > 0) {
  axios
    .get(`/company/${companyId}/json`)
    .then(result => {
      let company = result.data;

      ReactDOM.render(
        <div>
          <a className="back-link" href='/'>Back to home</a>
          <h1 className="heading-xlarge">
            Add new contact
          </h1>
          <ContactForm company={company}/>
        </div>,
        editElement
      );
    });
} else {
    ReactDOM.render(
      <div>
        <a className="back-link" href='/'>Back to home</a>
        <h1 className="heading-xlarge">
          Add new contact
        </h1>
        <ContactForm/>
      </div>,
      editElement
    );
}
