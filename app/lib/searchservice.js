'use strict';

let companiesHouseApi = require('./companieshouseapis');
const companyRepository = require('./companyrepository');
const lunr = require('lunr');
const possibleFacets = ['type', 'sectors', 'status'];


let searchHistory = [];
let index;

function searchLunr(term) {

  return index.search(term).map((result) => {
    let expandedResult;

    if (result.ref.charAt(0) === 'C') {
      expandedResult = companyRepository.getCompanySummary(result.ref.slice(1));
      expandedResult.type = 'Company';
    } else if (result.ref.charAt(0) === 'P') {
      const parts = result.ref.split('-');
      const contactId = parts[0].slice(1);
      const companyId = parts[1];
      expandedResult = companyRepository.getCompanyContact(companyId, contactId);
      expandedResult.type = 'Contact';
    }

    expandedResult.score = result.score;

    return expandedResult;
  });

}

function indexCHRecord(company) {
  index.add({
    id: `C${company.id}`,
    title: company.title,
    description: company.description,
    address: company.address.postal_code
  });
}

function indexCompanyContacts(company) {
  if (company.contacts && company.contacts.length > 0) {
    company.contacts.forEach((contact) => {
      index.add({
        id: `P${contact.id}-${company.id}`,
        title: `${contact.title} ${contact.name}`,
        address: `${contact.streetaddress}, ${contact.city}, ${contact.zipcode}`
      });
    });
  }
}

function addCHRecords(companies) {
  companies.forEach((company) => {
    console.log(company);
    if (company.company_status === 'active') {
      company = companyRepository.addCompany(company);
      indexCHRecord(company);
      indexCompanyContacts(company);
    }
  });
}

function search(term) {
  return new Promise(function(fulfill, reject) {
    const lowerTerm = term.toLowerCase();
    if (!searchHistory.find((item) => item === lowerTerm)) {
      searchHistory.push(lowerTerm);
      companiesHouseApi.findCompanies(term)
        .then((companies) => {
          addCHRecords(companies.items);
          let results = searchLunr(term);
          let facets = calculateFacets(results);
          fulfill({results, facets});
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      let results = searchLunr(term);
      let facets = calculateFacets(results);
      fulfill({results, facets});
    }

  });
}

function reset() {
  searchHistory = [];
  index = lunr(function() {
    this.field('title', { boost: 10 });
    this.field('description');
    this.field('address');
  });
}

function calculateFacets(results) {

  let facets = {};

  for (const possibleFacet of possibleFacets) {
    facets[possibleFacet] = {};
  }

  for (let result of results) {

    for (let possibleFacet of possibleFacets) {
      let resultFacetValues = result[possibleFacet]; // result type value
      if (!Array.isArray(resultFacetValues)) {
        resultFacetValues = [resultFacetValues];
      }

      for (let resultFacetValue of resultFacetValues) {
        if (!facets[possibleFacet][resultFacetValue]) {
          facets[possibleFacet][resultFacetValue] = 1;
        } else {
          facets[possibleFacet][resultFacetValue] += 1;
        }
      }

    }

  }

  return facets;
}



reset();

module.exports = {
  search: search,
  companiesHouseApi: companiesHouseApi, // Used only for testing.
  reset: reset
};
