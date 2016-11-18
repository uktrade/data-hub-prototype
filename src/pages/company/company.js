const AsyncProps = require('async-props').default;
const React = require('react');
const { Router, browserHistory } = require('react-router');
const routes = require('./routes');


function company(props) {
  return (
    <Router history={browserHistory} routes={routes} render={props => <AsyncProps {...props} />} />
  );
}

module.exports = company;
