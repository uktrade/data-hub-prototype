import React, { Component } from 'react';
import Facet from './facet.component.js';
import { connect } from 'react-redux';

class Facets extends Component {

  makeFacetList = (facets) => {

    // get Keys
    let keys = Object.keys(facets).sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

    return keys.map((facetKey) => {
      const facetValues = Object.keys(facets[facetKey]).sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
      return (
        <Facet name={facetKey} title={facetKey} options={facetValues} key={facetKey} />
      );
    });

  };

  render() {
    return (
      <div>
        {this.makeFacetList(this.props.facets)}
      </div>
    );
  }
}

Facets.propTypes = {
  facets: React.PropTypes.object
};


function mapStateToProps({ results }) {
  return { facets: results.facets };
}


export default connect(mapStateToProps)(Facets);
