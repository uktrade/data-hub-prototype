import React from 'react';
import ReactDOM from 'react-dom';
import {InteractionForm} from '../forms/interactionForm';
import axios from 'axios';


const editElement = document.getElementById('interaction-form');
const companyId = editElement.getAttribute('data-company-id');
const contactId = editElement.getAttribute('data-contact-id');
const interactionId = editElement.getAttribute('data-contact-id');



if (interactionId && interactionId.length > 0) {
  axios
    .get(`/interaction/${interactionId}/json`)
    .then(result => {
      let interaction = result.data;

      ReactDOM.render(
        <div>
          <a className="back-link" href='/'>Back to home</a>
          <h1 className="heading-xlarge">
            Edit interaction
          </h1>
          <InteractionForm interaction={interaction}/>
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
            Add new interaction
          </h1>
          <InteractionForm company={company}/>
        </div>,
        editElement
      );
    });
} else if (contactId && contactId.length > 0) {
  axios
    .get(`/contact/${contactId}/json`)
    .then(result => {
      let contact = result.data;

      ReactDOM.render(
        <div>
          <a className="back-link" href='/'>Back to home</a>
          <h1 className="heading-xlarge">
            Add new interaction
          </h1>
          <InteractionForm contact={contact}/>
        </div>,
        editElement
      );
    });
} else {
  ReactDOM.render(
    <div>
      <a className="back-link" href='/'>Back to home</a>
      <h1 className="heading-xlarge">
        Add new interaction
      </h1>
      <InteractionForm/>
    </div>,
    editElement
  );
}
