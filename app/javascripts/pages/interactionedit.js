import React from 'react';
import ReactDOM from 'react-dom';
import {InteractionForm} from '../forms/interactionForm';
import axios from 'axios';


const editElement = document.getElementById('interaction-form');
const companyId = editElement.getAttribute('data-company-id');
const contactId = editElement.getAttribute('data-contact-id');
const interactionId = editElement.getAttribute('data-interaction-id');

function render( opts = {} ){

  const heading = ( opts.heading || 'Add new interaction' );

  ReactDOM.render(
    <div>
      <a className="back-link" href='/'>Back to home</a>
      <h1 className="heading-xlarge">
        { heading }
      </h1>
      <InteractionForm
        company={opts.company}
        contact={opts.contact}
        interaction={opts.interaction}
      />

    </div>,
    editElement
  );
}


if (interactionId && interactionId.length > 0) {
  axios
    .get(`/interaction/${interactionId}/json`)
    .then(result => {
      render({heading: 'Edit interaction', interaction: result.data});
    });
} else if (companyId && companyId.length > 0) {
  axios
    .get(`/company/${companyId}/json`)
    .then(result => {
      render({heading: 'Add interaction', company: result.data});
    });
} else if (contactId && contactId.length > 0) {
  axios
    .get(`/contact/${contactId}/json`)
    .then(result => {
      render({heading: 'Add interaction', contact: result.data});
    });
} else {
  render();
}
