/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
const searchService = require('../lib/searchservice');
const controllerUtils = require('../lib/controllerutils');

const NEXTLABEL = 'Next';
const PREVIOUSLABEL = 'Previous';

function getPageLink(page, req) {
  // Get the current params, remove the existing page param and put in the desired
  let params = req.query;
  delete params.page;
  params.page = page;
  return controllerUtils.encodeQueryData(params);
}

// Figure out the start, end, next and previous page indexes
// for pagination
function getPageIndexes(req, result) {
  let pageIndex = {};
  let currentPage = parseInt(req.query.page, 10) || 1;

  let totalPages = Math.ceil(result.total / 10);

  pageIndex.endPage = currentPage + 4;
  if (pageIndex.endPage > totalPages) {
    pageIndex.endPage = totalPages;
  }

  // Figure out the start and end in the bottom pagination
  pageIndex.startPage = pageIndex.endPage - 4;
  if (pageIndex.startPage < 1) pageIndex.startPage = 1;

  if (pageIndex.startPage > 1) {
    pageIndex.previousPage = currentPage - 1;
  }

  if (currentPage !== pageIndex.endPage) {
    pageIndex.nextPage = currentPage + 1;
  }

  return pageIndex;
}

function getPagination(req, result) {
  let pagination = [];
  let currentPage = parseInt(req.query.page, 10) || 1;

  if (result.total === 0) {
    return pagination;
  }

  let pageIndexes = getPageIndexes(req, result);

  // Create an array of pagination items
  if (currentPage > 1) {
    pagination.push({
      label: PREVIOUSLABEL,
      link: getPageLink(currentPage - 1, req)
    });
  }

  for (let pos = pageIndexes.startPage; pos <= pageIndexes.endPage; pos += 1) {
    pagination.push({
      label: `${pos}`,
      link: getPageLink(pos, req),
      currentPage: (pos === currentPage)
    });
  }

  if (pageIndexes.nextPage) {
    pagination.push({
      label: NEXTLABEL,
      link: getPageLink(pageIndexes.nextPage, req)
    });
  }

  if (pagination.length == 1) {
    return [];
  }

  return pagination;
}

function get(req, res) {

  let filters = Object.assign({}, req.query);
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
