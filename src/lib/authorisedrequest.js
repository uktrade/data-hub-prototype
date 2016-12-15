const request = require('request-promise');
const winston = require('winston');

function stripScript(text) {
  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  while (SCRIPT_REGEX.test(text)) {
    text = text.replace(SCRIPT_REGEX, "");
  }
  return text;
}


module.exports = (token, opts) => {
  opts.headers = opts.headers || {};
  opts.headers.Authorization = `Bearer ${token}`;
  winston.debug(`Sending ${(opts.method || 'GET')} request to ${opts.url}`);
  if (opts.method === 'POST') {
    winston.debug(JSON.stringify(opts.body));
  }

  return new Promise((good, bad) => {
    request(opts)
      .then((response) => {
        const data = JSON.parse(stripScript(response));
        good(data);
      })
      .catch((error) => {
        console.log(error);
        bad(error);
      });
  });

};
