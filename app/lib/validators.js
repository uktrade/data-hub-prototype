'use strict';

var moment = require('moment');

function validUkDateString(value) {
  return moment(value, 'DD/MM/YYYY').isValid();
}

function hasOneOrMoreValues(value) {
  if (!value || value.length === 0) {
    return false;
  }

  if (Array.isArray(value)) {
    for (let item of value) {
      if (item.length === 0) return false;
    }
  }

  return true;
}


module.exports = {
  validUkDateString,
  hasOneOrMoreValues
};
