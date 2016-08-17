import React, { Component } from 'react';
import Facet from './facet.component.js';
import { connect } from 'react-redux';
import { addFilter, removeFilter } from '../actions/search.actions';
import { bindActionCreators } from 'redux';

class Facets extends Component {

  filterChange = (event) => {
    if (event.target.checked) {
      this.props.addFilter(event.target.name, event.target.value);
    } else {
      this.props.removeFilter(event.target.name, event.target.value);
    }
  };

  makeFacetList = (facets) => {
    // get Keys
    let keys = Object.keys(facets);

    if (keys.length === 0) {
      return (<div></div>);
    }

    return keys.map((facetKey) => {
      return (
        <Facet
          name={facetKey}
          title={facetKey}
          options={facets[facetKey]}
          key={facetKey}
          onChange={this.filterChange} />
      );
    });

  };

  render() {
    return (
      <div>
        <h3 className="heading-small filter-title">Filter by:</h3>
        {this.makeFacetList(this.props.facets)}
      </div>
    );
  }
}

Facets.propTypes = {
  facets: React.PropTypes.object.isRequired,
  addFilter: React.PropTypes.func.isRequired,
  removeFilter: React.PropTypes.func.isRequired
};


function mapStateToProps({ facets }) {
  return {
    facets: facets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addFilter, removeFilter }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Facets);
