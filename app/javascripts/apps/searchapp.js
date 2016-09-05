import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchBar from '../components/searchbar.component.js';
import SearchResults from '../components/searchresults.component.js';
import Facets from '../components/facets.component.js';
import Pagination from '../components/pagination.component.js';


import { search } from '../actions/search.actions';
import { getQueryParamValue } from '../lib/query';

class SearchApp extends Component {

  componentWillMount() {
    let searchAction = this.props.search;

    window.onpopstate = function(event) {
      searchAction(event.state.query, false);
    };

    let query = getQueryParamValue('query');
    if (query) {
      searchAction(query);
    }
  }

  render() {

    return (
      <div>
        <a className="back-link" href='/'>Back to homepage</a>
        <SearchBar/>

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
        <div className="grid-row">
          <Pagination/>
        </div>
      </div>
    );
  }
}

SearchApp.propTypes = {
  search: React.PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ search }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchApp);
