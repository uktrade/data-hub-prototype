'use strict';

const controllerUtils = require('./controllerutils');

const NEXTLABEL = 'Next';
const PREVIOUSLABEL = 'Previous';

// Figure out the start, end, next and previous page indexes
// for pagination
function getPageIndexes(req, result) {
  let pageIndex = {};
  let currentPage = parseInt(req.query.page, 10) || 1;

  let totalPages = Math.ceil(result.total / 10);

  pageIndex.startPage = currentPage - 2;
  if (pageIndex.startPage < 1) {
    pageIndex.startPage = 1;
  }

  if (currentPage !== 1) {
    pageIndex.previousPage = currentPage - 1;
  }


  pageIndex.endPage = pageIndex.startPage + 4;
  if (pageIndex.endPage > totalPages) {
    pageIndex.endPage = totalPages;
  }

  if (currentPage !== totalPages) {
    pageIndex.nextPage = currentPage + 1;
  }

  // Adjust in case of near the end of result set.
  if (pageIndex.endPage < (currentPage + 2)) {
    pageIndex.startPage = pageIndex.endPage - 4;
    if (pageIndex.startPage < 1) pageIndex.startPage = 1;
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

function getPageLink(page, req) {
  // Get the current params, remove the existing page param and put in the desired
  let params = req.query;
  delete params.page;
  params.page = page;
  return controllerUtils.encodeQueryData(params);
}

module.exports = { getPageIndexes, getPagination, getPageLink };
