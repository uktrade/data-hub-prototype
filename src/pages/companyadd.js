require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const CompanyForm = require('../forms/companyform');

ReactDOM.render(
   <CompanyForm />,
  document.getElementById('company-form')
);
