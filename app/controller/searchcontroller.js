'use strict';

const searchService = require('../service/searchservice');

function get(req, res) {

  if (!req.query.query || req.query.query === '') {
    res.render('search/searchresults', {});
  }

  let query = req.query.query;

  searchService.search(query)
    .then((results) => {
      let totalResults = 0;
      if (results && results.length > 0) {
        totalResults = results.length;
      }

      res.render('search/searchresults', {
        query,
        results,
        totalResults
      });
    })
    .catch((error) => {
      res.render('error', {
      error
    });
  });

}

module.exports = {
  get: get
};
