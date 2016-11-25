/* global dh:true, document: true */
require('babel-polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const ContactForm = require('../forms/contactform');

const editElement = document.getElementById('contact-form');
const contact = dh.data.contact;
const company = dh.data.company;

ReactDOM.render(
  <ContactForm contact={contact} company={company} />,
  editElement,
);
