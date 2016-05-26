import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import reducers from './reducers';
import SearchApp from './apps/searchapp';

const createStoreWithMiddleware = applyMiddleware(
  promise
)(createStore);

const store = createStoreWithMiddleware(reducers);


ReactDOM.render(
  <Provider store={store}>
    <SearchApp />
  </Provider>,
  document.querySelector('#content .container')
);
