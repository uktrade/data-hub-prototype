'use strict';

const port = process.env.PORT || 3000;

module.exports = {
  env: process.env.NODE_ENV,
  port: port,
  apiRoot: process.env.API_ROOT || 'http://localhost:8000',
  postcodeLookup: {
    apiKey: process.env.POSTCODE_KEY,
    baseUrl: 'https://api.getAddress.io/v2/uk/{postcode}?api-key={api-key}'
  }
};
