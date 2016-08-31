'use strict';

let companiesHouseApi = require('./companieshouseapis');
const companyRepository = require('./companyrepository');
const lunr = require('lunr');
const facetTitles = ['type', 'company_status'];


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
  if (!company.address){
    company.address = {};
  }

  if (!company.address.postal_code) {
    company.address.postal_code = '';
  }

  let doc = {
    id: `C${company.id}`,
    title: company.title,
    description: company.description,
    address: company.address.postal_code
  };


  if (company.tradingName) {
    doc.tradingName = company.tradingName;
  }

  index.add(doc);
}

function removeCHRecord(company) {
  index.remove({ id: `C${company.id}`});
}

function indexCompanyContacts(company) {
  if (company.contacts && company.contacts.length > 0) {
    company.contacts.forEach((contact) => {
      index.add({
        id: `P${contact.id}-${company.id}`,
        title: `${contact.title} ${contact.firstname} ${contact.lastname}`,
        address: `${contact.streetaddress}, ${contact.city}, ${contact.zipcode}`
      });
    });
  }
}

function addCHRecords(companies) {
  companies.forEach((company) => {
    let existingRecord = companyRepository.getCompanySummary(company.company_number);
    if (!existingRecord && company.company_status === 'active') {
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
    this.field('tradingName', { boost: 10 });
    this.field('description');
    this.field('address');
  });
}

function calculateFacets(results) {

  let facets = {};

  for (const possibleFacet of facetTitles) {
    facets[possibleFacet] = {};
  }

  for (let result of results) {

    for (let facetTitle of facetTitles) {
      let facetOptions = result[facetTitle];
      if (!Array.isArray(facetOptions)) {
        facetOptions = [facetOptions];
      }

      for (let facetOption of facetOptions) {
        if (facetOption) {
          if (!facets[facetTitle][facetOption]) {
            facets[facetTitle][facetOption] = {
              total: 1
            };
          } else {
            facets[facetTitle][facetOption].total += 1;
          }
        }
      }
    }
  }

  // Strip out facets that would only have one option.
  for (let facetName in facets) {
    let facetKeys = Object.keys(facets[facetName]);
    if (facetKeys.length < 2) {
      delete facets[facetName];
    }
  }

  return facets;
}


reset();

module.exports = {
  search,
  indexCHRecord,
  removeCHRecord,
  companiesHouseApi,
  reset
};
