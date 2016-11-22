const React = require('react');
const AsyncProps = require('async-props').default;
const ReactRouter = require('react-router');
const routesConfig = require('./routesconfig');

const Router = ReactRouter.Router;
const browserHistory = ReactRouter.browserHistory;


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

module.exports = Routes;
