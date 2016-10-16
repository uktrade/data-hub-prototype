'use strict';
const rp = require('request-promise');
const config = require('../../config');

function search(query) {

  let body = {
    term: query.term,
    limit: query.limit | 10
  };

  if (!query.page) {
    body.offset = 0;
    query.page = 1;
  } else {
    body = (query.page * body.limit) - body.limit;
  }

  let options = {
    url: `${config.apiRoot}/search`,
    body,
    json: true,
    method: 'POST'
  };


  return rp(options);
}

function suggestCompany(term) {
  let options = {
    url: `${config.apiRoot}/search`,
    body: {term},
    json: true,
    method: 'POST'
  };

  return rp(options).
    then((result) => {
      return result.hits
        .filter(item => item._type === 'company_companieshousecompany')
        .map(hit => {
          return {
            company_number: hit._source.company_number,
            name: hit._source.name,
            id: hit._source.company_number,
            _type: hit._type
          };
        });

    });
}

module.exports = { search, suggestCompany };
