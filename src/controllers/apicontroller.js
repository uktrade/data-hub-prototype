/* eslint new-cap: 0 */
const express = require('express');
const rp = require('request-promise');
const config = require('../config');
const postcodeService = require('../services/postcodeservice');
const searchService = require('../services/searchservice');
const companyRepository = require('../repositorys/companyrepository');
const metadataRepository = require('../repositorys/metadatarepository');
const contactRepository = require('../repositorys/contactrepository');
const authorisedRequest = require('../lib/authorisedrequest');

const router = express.Router();

function postcodelookup(req, res) {
  const postcode = req.params.postcode;
  postcodeService.lookupAddress(postcode)
    .then((addresses) => {
      res.json(addresses);
    })
    .catch((error) => {
      res.json({ error });
    });
}

function companySuggest(req, res) {
  searchService.suggestCompany(req.session.token, req.query.term, req.query.type)
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.json([]);
    });
}

function countryLookup(req, res) {
  if (!req.query.country || req.query.country.length === 0) {
    res.json([]);
    return;
  }

  const countryParam = req.query.country.toLocaleLowerCase();
  const results = metadataRepository.COUNTRYS.filter(country => (
    country.name.length >= countryParam.length &&
           country.name.substr(0, countryParam.length).toLocaleLowerCase() === countryParam
  ));

  res.json(results);
}

function accountManagerLookup(req, res) {
  if (!req.query.term || req.query.term.length === 0) {
    res.json([]);
    return;
  }

  const param = req.query.term.toLocaleLowerCase();

  authorisedRequest(req.session.token, {
    url: `${config.apiRoot}/advisor/`,
    json: true,
  })
  .then((data) => {
    const results = data.results.filter(advisor => (
      advisor.name.length >= param.length &&
      advisor.name.substr(0, param.length).toLocaleLowerCase() === param
    ));

    res.json(results);
  });
}

function getMetadata(req, res) {
  const metaName = req.params.metaName;
  let result;

  switch (metaName) {
    case 'typesofbusiness':
      result = metadataRepository.TYPES_OF_BUSINESS;
      break;
    case 'typesofinteraction':
      rp({
        url: `${config.apiRoot}/metadata/interaction-type/`,
        json: true,
      })
        .then((response) => {
          res.json(response);
        });
      return;
    case 'sector':
      result = metadataRepository.SECTOR_OPTIONS;
      break;
    case 'countries':
      result = metadataRepository.COUNTRYS;
      break;
    case 'region':
      result = metadataRepository.REGION_OPTIONS;
      break;
    case 'employee_range':
      result = metadataRepository.EMPLOYEE_OPTIONS;
      break;
    case 'turnover_range':
      result = metadataRepository.TURNOVER_OPTIONS;
      break;
    case 'primary_sectors':
      result = metadataRepository.PRIMARY_SECTORS;
      break;
    case 'subsectors':
      result = metadataRepository.SUBSECTORS;
      break;
    case 'role':
      rp({
        url: `${config.apiRoot}/metadata/role/`,
        json: true,
      })
        .then((response) => {
          res.json(response);
        });
      return;
    case 'title':
      rp({
        url: `${config.apiRoot}/metadata/title/`,
        json: true,
      })
        .then((response) => {
          res.json(response);
        });
      return;
    case 'advisors':
      authorisedRequest(req.session.token, {
        url: `${config.apiRoot}/advisor/`,
        json: true,
      })
        .then((response) => {
          res.json(response.results);
        });
      return;
    case 'service':
      rp({
        url: `${config.apiRoot}/metadata/service/`,
        json: true,
      })
        .then((response) => {
          res.json(response);
        });
      return;
    default:
      result = [];
  }

  res.json(result);
}

function contactLookup(req, res) {
  if (!req.query.company || req.query.company.length === 0
    || !req.query.contact || req.query.contact.length === 0) {
    res.json([]);
    return;
  }

  const companyParam = req.query.company.toLocaleLowerCase();
  const contactParam = req.query.contact.toLocaleLowerCase();
  const contactParamLength = contactParam.length;

  companyRepository.getDitCompany(req.session.token, companyParam)
    .then((company) => {
      const results = company.contacts
        .map(({ id, first_name, last_name }) => ({
          id,
          name: `${first_name} ${last_name}`,
        }))
        .filter(({ name }) => name.substr(0, contactParamLength).toLocaleLowerCase() === contactParam);

      res.json(results);
    });
}

function teamLookup(req, res) {
  if (!req.query.term || req.query.term.length === 0) {
    res.json([]);
    return;
  }

  const teamParam = req.query.term.toLocaleLowerCase();
  const teamParamLength = teamParam.length;
  const teams = metadataRepository.TEAMS;

  let results = teams.filter(team => team.name.substr(0, teamParamLength).toLocaleLowerCase() === teamParam);

  if (results.length > 10) {
    results = results.splice(0, 10);
  }
  res.json(results);
}

function getSubsectors(req, res) {
  const sectorId = req.params.sectorId;
  res.json(metadataRepository.SUBSECTORS[sectorId]);
}

function getCompany(req, res) {
  const id = req.params.sourceId;
  const source = req.params.source;

  companyRepository.getCompany(req.session.token, id, source)
    .then((company) => {
      res.json(company);
    })
    .catch((error) => {
      res.render('error', { error });
    });
}

function getContact(req, res) {
  const contact_id = req.params.contact_id;

  if (!contact_id) {
    res.redirect('/');
  }

  contactRepository.getContact(req.session.token, contact_id)
    .then((contact) => {
      res.json(contact);
    })
    .catch((error) => {
      res.render('error', { error });
    });
}


router.get('/suggest', companySuggest);
router.get('/countrylookup', countryLookup);
router.get('/accountmanagerlookup', accountManagerLookup);
router.get('/contactlookup', contactLookup);
router.get('/teamlookup', teamLookup);
router.get('/meta/:metaName', getMetadata);
router.get('/postcodelookup/:postcode', postcodelookup);
router.get('/subsectors/:sectorId', getSubsectors);
router.get('/company/:source/:sourceId', getCompany);
router.get('/contact/:contact_id', getContact);

module.exports = {
  postcodelookup,
  companySuggest,
  countryLookup,
  accountManagerLookup,
  contactLookup,
  getMetadata,
  teamLookup,
  router,
};
