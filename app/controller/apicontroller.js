'use strict';
const postcodeService = require('../lib/postcodeservice');
const searchService = require('../lib/searchservice');
const companyRepository = require('../repository/companyrepository');
const metadata = require('../lib/metadata');
const rp = require('request-promise');
const config = require('../../config');

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
      res.json(result);
    })
    .catch(() => {
      res.json([]);
    });
}

function companyDetail(req, res) {
  companyRepository.getCompany(req.params.sourceId, req.params.source)
    .then((data) => {
      res.json(data);
    });
}

function countryLookup(req, res) {

  if (!req.query.country || req.query.country.length === 0) {
    res.json([]);
    return;
  }

  const countryParam = req.query.country.toLocaleLowerCase();
  const results = metadata.COUNTRYS.filter((country) => {
    return country.name.length >= countryParam.length &&
           country.name.substr(0, countryParam.length).toLocaleLowerCase() === countryParam;
  });

  res.json(results);
}

function accountManagerLookup(req, res) {

  if (!req.query.term || req.query.term.length === 0) {
    res.json([]);
    return;
  }

  const param = req.query.term.toLocaleLowerCase();

  rp({
    url: `${config.apiRoot}/advisor/`,
    json: true
  })
  .then((data) => {
    const results = data.results.filter((advisor) => {
      return advisor.name.length >= param.length &&
        advisor.name.substr(0, param.length).toLocaleLowerCase() === param;
    });

    res.json(results);
  });
}

function getMetadata(req, res) {
  const metaName = req.params.metaName;
  let result;

  switch (metaName) {
    case 'typesofbusiness':
      result = metadata.TYPES_OF_BUSINESS;
      break;
    case 'sector':
      result = metadata.SECTOR_OPTIONS;
      break;
    case 'countries':
      result = metadata.COUNTRYS;
      break;
    case 'region':
      result = metadata.REGION_OPTIONS;
      break;
    case 'employee_range':
      result = metadata.EMPLOYEE_OPTIONS;
      break;
    case 'turnover_range':
      result = metadata.TURNOVER_OPTIONS;
      break;
    case 'role':
      rp({
        url: `${config.apiRoot}/metadata/role/`,
        json: true
      })
        .then((response) => {
          res.json(response);
        });
      return;
    case 'title':
      rp({
        url: `${config.apiRoot}/metadata/title/`,
        json: true
      })
        .then((response) => {
          res.json(response);
        });
      return;
    case 'advisors':
      rp({
        url: `${config.apiRoot}/advisor/`,
        json: true
      })
        .then((response) => {
          res.json(response.results);
        });
      return;
    default:
      result = [];
  }

  res.json(result);

}




module.exports = {
  postcodelookup,
  companySuggest,
  companyDetail,
  countryLookup,
  accountManagerLookup,
  getMetadata
};
