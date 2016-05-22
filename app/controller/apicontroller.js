'use strict';

const searchService = require('../lib/searchservice');

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
        totalResults = results.length;
      }

      res.json({
        query,
        results: results.results,
        facets: results.facets,
        totalResults
      });
    })
    .catch((error) => {
      res.json({error});
    });

}

module.exports = {
  search
};
