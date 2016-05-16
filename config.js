'use strict';

const port = process.env.PORT || 3000;

module.exports = {
  env: process.env.NODE_ENV,
  port: port,
  companiesHouse: {
    apiKey: process.env.COMPANY_KEY,
    baseUrl: 'https://api.companieshouse.gov.uk/'
  }
};
