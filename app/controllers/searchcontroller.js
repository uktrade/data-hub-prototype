/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
const searchService = require('../services/searchservice');
const getPagination = require('../lib/pagination').getPagination;


function get(req, res) {
  const filters = Object.assign({}, req.query);
  delete filters.term;
  delete filters.page;

  searchService.search({
    token: req.session.token,
    term: req.query.term,
    page: req.page,
    filters
  })
    .then((result) => {
      let pagination = getPagination(req, result);
      res.render('search/facet-search', {result, pagination, params: req.query });
    })
    .catch((error) => {
      res.render('error', {error});
    });
}


router.get('/', get);


module.exports = {
  search: get, router
};
