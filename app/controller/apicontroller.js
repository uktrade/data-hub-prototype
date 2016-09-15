'use strict';
const postcodeService = require('../lib/postcodeservice');
const searchService = require('../lib/searchservice');
const companyRepository = require('../repository/companyrepository');

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

function companySuggest(req, res) {
  searchService.suggestCompany(req.query.term)
    .then((result) => {
      res.json(result.suggestions);
    })
    .catch(() => {

    });
}

function companyDetail(req, res) {
  companyRepository.getCompany(req.params.sourceId, req.params.source)
    .then((data) => {
      res.json(data);
    });
}


module.exports = { postcodelookup, companySuggest, companyDetail };
