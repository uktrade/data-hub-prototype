'use strict';

let data = {};

function getCompany(id) {
  return data[id];
}

function addCompany(company) {
  data[company.id] = company;
}

function updateCompany(company) {
  data[company.id] = company;
}

module.exports = {
  getCompany,
  addCompany,
  updateCompany
};
