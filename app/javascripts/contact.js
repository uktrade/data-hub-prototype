import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import InteractionTable from './components/interactiontable.component';

if (interactions && interactions.length > 0) {
  ReactDOM.render(
    <InteractionTable interactions={interactions} company={company} query={query}/>,
    document.querySelector('#interaction-table-wrapper')
  );
}
