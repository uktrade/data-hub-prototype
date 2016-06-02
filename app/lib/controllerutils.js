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

module.exports = {
  transformErrors
};
