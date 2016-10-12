'use strict';

function transformErrors(expressErrors) {

  if (!expressErrors) {
    return null;
  }

  let errors = {};

  for (let error of expressErrors) {
    errors[error.param] = error.msg;
  }

  return errors;
}

function encodeQueryData(data) {
  var ret = [];
  for (var key in data) {
    let item = data[key];

    if (Array.isArray(item)) {
      for (let innerValue of item) {
        ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(innerValue));
      }
    } else {
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(item));
    }
  }
  return ret.join('&');
}

module.exports = {
  transformErrors,
  encodeQueryData
};
