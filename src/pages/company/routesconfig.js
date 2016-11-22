const CompanyPage = require('./companypage');
const CompanyDetails = require('../../sections/companydetails.section');
const CompanyContacts = require('../../sections/companycontacts.section');
const CompanyInteractions = require('../../sections/companyinteractions.section');
const CompanyEdit = require('../../sections/companyedit.section');
const CompanyForm = require('../../forms/companyform');
const NotFound = require('./../notfound');


const routesConfig = [
  {
    path: '/company/:source/:sourceId',
    component: CompanyPage,
    indexRoute: { component: CompanyDetails },
    childRoutes: [
      { path: 'contacts', component: CompanyContacts },
      { path: 'interactions', component: CompanyInteractions },
      { path: 'edit', component: CompanyEdit },
      { path: '*', component: NotFound },
    ],
  },
  { path: '/companyadd', component: CompanyForm },
  { path: '*', component: NotFound },
];

module.exports = routesConfig;
