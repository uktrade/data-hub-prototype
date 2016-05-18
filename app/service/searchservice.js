'use strict';

var companiesHouseApi = require('../lib/companiesHouseApi');
var companyService = require('./companyservice');
var lunr = require('lunr');
var searchHistory = [];
var index;

function searchLunr(term) {
  return index.search(term).map((result) => {
    return companyService.getCompany(result.ref);
  });
}

function indexCHRecord(company) {
  var newRecord = {
    id: company.company_number,
    title: company.title,
    description: company.description,
    address: company.address.postal_code
  };

  index.add(newRecord);
}

function indexCompanyContacts(company) {

}

function addCHRecords(companies) {
  companies.forEach((company) => {
    if (company.company_status === 'active') {
      addRandomContactsToCompany(company);
      company.id = company.company_number;
      indexCHRecord(company);
      indexCompanyContacts(company);
      companyService.addCompany(company);
    }
  });
}

function addRandomContactsToCompany(company) {

}


function search(term) {
  return new Promise(function(fulfill, reject) {
    const lowerTerm = term.toLowerCase();
    if (!searchHistory.find((item) => item === lowerTerm)) {
      searchHistory.push(lowerTerm);
      companiesHouseApi.findCompanies(term)
        .then((result) => {
          addCHRecords(result.items);
          fulfill(searchLunr(term));
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } else {
      fulfill(searchLunr(term));
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

reset();

module.exports = {
  search: search,
  history: function() {
    return searchHistory;
  },
  setCompaniesHouseApi: function(newApi) {
    companiesHouseApi = newApi;
  },
  reset: reset
};
