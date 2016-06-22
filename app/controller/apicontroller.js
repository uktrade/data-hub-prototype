'use strict';

const searchService = require('../lib/searchservice');
const postcodeService = require('../lib/postcodeservice');

function search(req, res) {

  if (!req.query.query || req.query.query === '') {
    res.json({
      query: '',
      results: [],
      totalResults: 0
    });
    return;
  }

  let query = req.query.query;

  searchService.search(query)
    .then((results) => {
      let totalResults = 0;
      if (results.results && results.results.length > 0) {
        totalResults = results.results.length;
      }

      if (!results.facets.type.Company) results.facets.type.Company = { total: 0 };
      if (!results.facets.type.Contact) results.facets.type.Contact = { total: 0 };

      res.json({
        query,
        results: results.results,
        facets: results.facets,
        totalResults: totalResults
      });
    })
    .catch((error) => {
      res.json({error});
    });

}

function suggest(req, res) {

  if (!req.query.query || req.query.query === '') {
    res.json([]);
    return;
  }

  let query = req.query.query;

  searchService.search(query)
    .then((results) => {
      let suggestions = results.results
        .filter((result) => result.type === 'Company')
        .map((result) => result.title);

      res.json(suggestions);
    })
    .catch((error) => {
      res.json({error});
    });
}

function postcodelookup(req, res) {
  let postcode = req.params.postcode;

  postcodeService.lookupAddress(postcode)
    .then((addresses) => {
      res.json(addresses);
    })
    .catch((error) => {
      res.json({error});
    });
}

module.exports = {
  search,
  suggest,
  postcodelookup
};
