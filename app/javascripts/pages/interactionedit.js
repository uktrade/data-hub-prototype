import React from 'react';
import ReactDOM from 'react-dom';
import {InteractionForm} from '../forms/interactionform';
import axios from 'axios';


const editElement = document.getElementById('interaction-form');
const companyId = editElement.getAttribute('data-company-id');
const contactId = editElement.getAttribute('data-contact-id');
const interactionId = editElement.getAttribute('data-interaction-id');

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
  } else if (opts.interaction) {
    return {
      url: `/interaction/${opts.interaction.id}/view`,
      title: 'interaction'
    };
  }

  return {url: '/', title: 'home'};
}

function render( opts = {} ){

  const heading = ( opts.heading || 'Add new interaction' );
  const back = getBackLink(opts);

  ReactDOM.render(
    <div>
      {back &&
        <a className="back-link" href={back.url}>Back to {back.title}</a>
      }
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
    .get(`/company/company_company/${companyId}/json`)
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
