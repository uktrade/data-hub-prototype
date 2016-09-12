'use strict';
const rp = require('request-promise');
const config = require('../../config');

function search(query) {
  let options = {
    url: `${config.apiRoot}/search`,
    qs: query,
    json: true
  };

  return rp(options);
}

module.exports = { search };
