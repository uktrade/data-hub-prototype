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

    if (this.props.results.results.length === 0 && this.props.results.query.length > 0) {
      return <h1>No results</h1>;
    }

    if (this.props.results.results.length > 0 && this.props.results.query.length > 0) {
      let resultElements = this.props.results.results.map(this.renderResult);
      return (
        <div>
          <div className="result-summary">
            <span className="result-summary--result-count">{this.props.results.totalResults}</span> results found
            containing <span className="result-summary--result-query">{this.props.results.query}</span>
          </div>
          <ol className="results-list">
            { resultElements }
          </ol>
        </div>
      );
    }

    return <div/>;

  }

}

SearchResults.propTypes = {
  results: React.PropTypes.object,
};

function mapStateToProps({ results }) {
  return { results };
}

export default connect(mapStateToProps)(SearchResults);
