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
  searchService.search({
    term: req.query.term,
    filter: 'result_type:COMPANY'
  })
    .then((result) => {
      res.json(result.hits.map((hit) => {
        return {
          title: hit._source.title,
          result_source: hit._source.result_source,
          source_id: hit._source.source_id
        };
      }));
    });
}

function companyDetail(req, res) {
  companyRepository.getCompany(req.params.sourceId, req.params.source)
    .then((data) => {
      res.json(data);
    });
}


module.exports = { postcodelookup, companySuggest, companyDetail };
