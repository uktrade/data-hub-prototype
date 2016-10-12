/* eslint new-cap: 0 */

'use strict';
const express = require('express');
const router = express.Router();
let metadata = require('../lib/metadata');
const searchService = require('../lib/searchservice');
const controllerUtils = require('../lib/controllerutils');
const sectors = require('../../data/sectors.json');


const FACETTITLES = {
  _type: 'Type'
};
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
  searchService.search(req.query)
    .then((result) => {
      // combine filters and facets to show which are
      // selected
      for (let filterKey in result.filters) {
        let filterValue = result.filters[filterKey];
        let facet = result.facets[filterKey];
        for (let option of facet) {
          if (option.value === filterValue) {
            option.checked = true;
          }
        }
      }

      result.facets = getFakeFacets();
      result.term = req.query.term;

      let pagination = getPagination(req, result);
      res.render('search/facet-search', {result, FACETTITLES, pagination, params: req.query });

    })
    .catch((error) => {
      res.render('error', {error});
    });
}



function getFakeFacets() {
  let facets = {
    'Category': [{value: 'Company' }, {value: 'Contact' }],
    'Business type': [],
    'Status': [{value: 'Active'}, {value: 'Archived'}],
    'Sector': []
  };
  const business_types = metadata.TYPES_OF_BUSINESS;

  for (let btype of business_types) {
    facets['Business type'].push({value: btype.name});
  }

  for (let sector of sectors) {
    facets.Sector.push({value: sector});
  }

  return facets;
}
router.get('/', get);


module.exports = {
  search: get, router
};
