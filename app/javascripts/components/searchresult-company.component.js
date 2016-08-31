import React from 'react';
import { Component } from 'react';

function highlightQuery(name, query) {
  var regex = new RegExp('(' + query + ')', 'gi');
  return '<span>' + name.replace(regex, '<strong>$1</strong>') + '</span>';
}

export default class SearchResultCompany extends Component {

  render() {
    const result = this.props.result;
    const query = this.props.query;
    const linkUrl = `/companies/${result.id}?query=${query}`;

    return (
      <li className="results-list__result">
        <h3 className="result-title" data-company-number={result.company_number} data-uktidata={result.uktidata}>
          <a href={linkUrl} dangerouslySetInnerHTML={{__html: highlightQuery(result.title, query)}}></a>
        </h3>
        { result.tradingName &&
          <div className="meta meta--trading">Trading name: <span dangerouslySetInnerHTML={{__html: highlightQuery(result.tradingName, query)}}></span></div>
        }
        <div className="meta meta--address">
          {result.address.address_line_1},
          {result.address.address_line_2},
          {result.address.locality},
          {result.address.postal_code}
        </div>
      </li>

    );
  }
}

SearchResultCompany.propTypes = {
  result: React.PropTypes.object,
  query: React.PropTypes.string
};
