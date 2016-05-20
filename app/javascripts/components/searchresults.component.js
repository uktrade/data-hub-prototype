import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchResultCompany from './searchresult-company.component';
import SearchResultContact from './searchresult-contact.component';

class SearchResults extends Component {

  renderResult = (result) => {
    const query = this.props.results.query;
    switch (result.type) {
      case 'Contact':
        return (<SearchResultContact result={result} query={query} key={result.id}/>);
      default:
        return (<SearchResultCompany result={result} query={query} key={result.id}/>);
    }
  };

  render() {

    var resultElements;
    if (this.props.results.results) {
      resultElements = this.props.results.results.map(this.renderResult);
    }

    return (
      <ol className="results-list">
        { resultElements }
      </ol>
    );
  }

}

SearchResults.propTypes = {
  results: React.PropTypes.object,
};

function mapStateToProps({ results }) {
  return { results };
}

export default connect(mapStateToProps)(SearchResults);
