import React from 'react';
import { Component } from 'react';

function highlightQuery(name, query) {
  var regex = new RegExp('(' + query + ')', 'gi');
  return '<span>' + name.replace(regex, '<strong>$1</strong>') + '</span>';
}

export default class SearchResultContact extends Component {

  render() {
    const result = this.props.result;
    const name = `${result.title} ${result.name}`;
    const query = this.props.query;
    const linkUrl = `/companies/${result.company.id}/contact/view/${result.id}?query=${query}`;

    return (
      <li className="results-list__result">
        <h3 className="result-title">
          <a href={linkUrl} dangerouslySetInnerHTML={{__html: highlightQuery(name, query)}}></a>
        </h3>
        <div className="meta">{result.company.title} - {result.occupation}</div>

      </li>
    );
  }
}

SearchResultContact.propTypes = {
  result: React.PropTypes.object.isRequired,
  query: React.PropTypes.string.isRequired
};
