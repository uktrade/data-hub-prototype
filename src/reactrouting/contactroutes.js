const React = require('react');
const AsyncProps = require('async-props').default;
const ReactRouter = require('react-router');
const ContactPageLayout = require('../pages/contactpagelayout');
const NotFound = require('../pages/notfound');
const ContactDetails = require('../sections/contactdetails.section.js');
const ContactInteractions = require('../sections/contactinteractions.section.js');
const ContactForm = require('../forms/contactform');
const Router = ReactRouter.Router;
const browserHistory = ReactRouter.browserHistory;

const routesConfig = [
  {
    path: '/contact/:contactId',
    component: ContactPageLayout,
    indexRoute: { component: ContactDetails },
    childRoutes: [
      { path: 'interactions', component: ContactInteractions },
      { path: 'edit', component: ContactForm },
      { path: '*', component: NotFound },
    ],
  },
  { path: '/contact/add', component: ContactForm },
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
