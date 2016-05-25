import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchBar from '../components/searchbar.component.js';
import SearchResults from '../components/searchresults.component.js';
import Facets from '../components/facets.component.js';

import { search } from '../actions/search.actions';
import { getQueryParamValue } from '../lib/query';

class SearchApp extends Component {

  componentWillMount() {
    let query = getQueryParamValue('query');
    if (query) {
      this.props.search(query);
    }
  }

  render() {

    let query = getQueryParamValue('query');

    return (
      <div>
        <a className="back-link" href='/'>Back to homepage</a>
        <SearchBar query={query} />
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
  search: React.PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ search }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchApp);
