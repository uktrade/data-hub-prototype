require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');
const Routes = require('./../reactrouting/contactroutes').Routes;

ReactDOM.render(
  <Routes />,
  document.getElementById('contact'),
);
