import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import promise from 'redux-promise';
import { Router, Route, browserHistory } from 'react-router';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { search } from './actions/search.actions';
import reducers from './reducers';

import SearchBar from './components/searchbar.component';
import SearchResults from './components/searchresults.component';
import Facets from './components/facets.component.js';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);

class SearchApp extends React.Component {
  componentWillMount() {
    if (this.props.location.query.query) {
      this.props.search(this.props.location.query.query);
    }
  }

  render() {
    return (
      <div>
        <a className="back-link" href='/'>Back to homepage</a>
        <SearchBar query={this.props.location.query.query} />
        <div className="grid-row">
          <div className="column-one-third">
            <div className="filters">
              <Facets/>
            </div>
          </div>
          <div className="column-two-thirds">
            <SearchResults/>
          </div>
        </div>
      </div>
    );
  }
}

SearchApp.propTypes = {
  location: React.PropTypes.object,
  search: React.PropTypes.func
};


let searchApp = connect(null, { search })(SearchApp);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route name="search" path="/search" component={searchApp} />
    </Router>
  </Provider>,
  document.querySelector('#content .container')
);
