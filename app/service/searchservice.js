'use strict';

let companiesHouseApi = require('./companieshouseapiservice');
const companyRepository = require('../repository/companyrepository');
const lunr = require('lunr');

let searchHistory = [];
let index;

function searchLunr(term) {
  return index.search(term).map((result) => {
    let expandedResult;

    if (result.ref.charAt(0) === 'C') {
      expandedResult = companyRepository.getCompany(result.ref.slice(1));
      expandedResult.type = 'COMPANY';
    } else if (result.ref.charAt(0) === 'P') {
      const parts = result.ref.split('-');
      const contactId = parts[0].slice(1);
      const companyId = parts[1];
      expandedResult = companyRepository.getCompanyContact(companyId, contactId);
      expandedResult.type = 'CONTACT';
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
        title: `${contact.title} ${contact.givenname} ${contact.surname}`,
        address: `${contact.streetaddress}, ${contact.city}, ${contact.zipcode}`
      });
    });
  }
}

function addCHRecords(companies) {
  companies.forEach((company) => {
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
        .then((result) => {
          addCHRecords(result.items);
          fulfill(searchLunr(term));
        })
        .catch((error) => {
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
  companiesHouseApi: companiesHouseApi, // Used only for testing.
  reset: reset
};
