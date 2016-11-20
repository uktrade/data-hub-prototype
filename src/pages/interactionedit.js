/* global dh:true */

require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const InteractionForm = require('../forms/interactionform');

const editElement = document.getElementById('interaction-form');
const contact = dh.data.contact;
const company = dh.data.company;
const interaction = dh.data.interaction;


ReactDOM.render(
  <InteractionForm
    company={company}
    contact={contact}
    interaction={interaction}
  />,
  editElement
);
