require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');

const CompanyForm = require('../forms/companyform');

ReactDOM.render(
  <div>
    <a className="back-link" href='/'>Back to home</a>
    <h1 className="heading-xlarge">
      Add new company
    </h1>
    <CompanyForm/>
  </div>,
  document.getElementById('company-forms')
);
