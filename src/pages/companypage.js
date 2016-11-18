/* global document: tru */
require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');

const Company = require('./company');

ReactDOM.render(
  <Company />,
  document.getElementById('main'),
);
