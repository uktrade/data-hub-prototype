const React = require('react');
const AsyncProps = require('async-props').default;
const ReactRouter = require('react-router');
const CompanyApp = require('../apps/company.app.js');
const CompanyDetails = require('../sections/companydetails.section.js');
const CompanyContacts = require('../sections/companycontacts.section.js');
const CompanyInteractions = require('../sections/companyinteractions.section.js');
const CompanyEdit = require('../sections/companyedit.section.js');
const CompanyForm = require('../forms/companyform');
const NotFound = require('./notfound');

const Router = ReactRouter.Router;
const browserHistory = ReactRouter.browserHistory;

const routesConfig = [
  {
    path: '/company/:source/:sourceId',
    component: CompanyApp,
    indexRoute: { component: CompanyDetails },
    childRoutes: [
      { path: 'contacts', component: CompanyContacts },
      { path: 'interactions', component: CompanyInteractions },
      { path: 'edit', component: CompanyEdit },
      { path: '*', component: NotFound },
    ],
  },
  { path: '/company/add', component: CompanyForm },
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
