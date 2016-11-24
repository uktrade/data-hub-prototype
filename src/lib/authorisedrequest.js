const request = require('request-promise');
const winston = require('winston');

module.exports = (token, opts) => {
  opts.headers = opts.headers || {};
  opts.headers.Authorization = `Bearer ${token}`;
  winston.debug(`Sending ${(opts.method || 'GET')} request to ${opts.url}`);
  if (opts.method === 'POST') {
    winston.debug(JSON.stringify(opts.body));
  }
  return request(opts);
};
