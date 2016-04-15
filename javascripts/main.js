'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import promise from 'redux-promise';
import reducers from './reducers';

import CompaniesList from './components/CompaniesList';
import CompanyCreate from './components/CompanyCreate';
import CompanyProfile from './components/CompanyProfile';
import CompanyDetails from './components/CompanyDetails';
import CompanyContacts from './components/CompanyContacts';
import CompanyInteractions from './components/CompanyInteractions';
import Companies from './components/Companies';

import Mojular from 'mojular';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Companies}>
        <IndexRoute component={CompaniesList} />
      </Route>

      <Route path="/company/add" component={CompanyCreate}/>

      <Route path="/company/:id" component={CompanyProfile}>
        <IndexRoute component={CompanyDetails}/>
        <Route path="profile" component={CompanyDetails} />
        <Route path="contacts" component={CompanyContacts} />
        <Route path="interactions" component={CompanyInteractions} />
        <Route path="projects" component={CompanyDetails} />
        <Route path="deliveries" component={CompanyDetails} />
        <Route path="documents" component={CompanyDetails} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('#content .container')
);


Mojular
  .use([
    require('mojular-govuk-elements'),
    require('mojular-moj-elements')
  ])
  .init();
