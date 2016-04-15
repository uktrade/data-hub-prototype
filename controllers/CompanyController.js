'use strict';

const utils = require('../lib/utils');

let companiesData = require('../data/companies.json');

function getCompanies(req, res) {
  res.json({
    companies: companiesData.map( company => {
      return {
        id: company.id,
        name: company.name,
        primaryContact: company.primaryContact,
        city: company.city,
        country: company.country
      };
    })
  });
}

function getCompany(req, res) {
  res.json({
    company: companiesData.find(company => company.id === req.params.id)
  });
}

function postCompany(req, res) {
  let company = req.body.company;
  company.id = utils.generateUUID();
  companiesData.push(company);
  res.json({ company });
}

function putCompany(req, res) {
  const updatedCompany = req.body.company;
  var index = companiesData.findIndex(company => company.id === updatedCompany.id);

  if (index) {
    companiesData[index] = updatedCompany;
  }

  res.json({ company: updatedCompany });
}

module.exports = {
  getCompanies, getCompany, postCompany, putCompany
};
