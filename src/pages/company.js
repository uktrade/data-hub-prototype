require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const Routes = require('./company/routes');

console.log('aha');

ReactDOM.render(
  <Routes />,
  document.getElementById('company'),
);
