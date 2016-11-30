const React = require('react');
const AsyncProps = require('async-props').default;
const ReactRouter = require('react-router');
const InteractionDetails = require('../sections/interactiondetails.section.js');
const InteractionForm = require('../forms/interactionform');
const NotFound = require('./notfound');

const Router = ReactRouter.Router;
const browserHistory = ReactRouter.browserHistory;

const routesConfig = [
  { path: '/interaction/add', component: InteractionForm },
  { path: '/interaction/:interactionId', component: InteractionDetails },
  { path: '/interaction/:interactionId/edit', component: InteractionForm },
  { path: '*', component: NotFound },
];

class Routes extends React.Component {
  render() {
    return (
      <Router
        history={browserHistory}
        routes={routesConfig}
        render={props => <AsyncProps {...props} />}
      />
    );
  }
}

module.exports = { Routes, routesConfig };
