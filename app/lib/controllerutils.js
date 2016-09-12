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

function convertFromFormAddress(formData, fieldname) {
  formData[`${fieldname}_1`] = formData[`${fieldname}.address1`];
  formData[`${fieldname}_2`] = formData[`${fieldname}.address2`];
  formData[`${fieldname}_town`] = formData[`${fieldname}.city`];
  formData[`${fieldname}_county`] = formData[`${fieldname}.county`];
  formData[`${fieldname}_country`] = formData[`${fieldname}.country`];
  formData[`${fieldname}_postcode`] = formData[`${fieldname}.postcode`];


  delete formData[`${fieldname}.address1`];
  delete formData[`${fieldname}.address2`];
  delete formData[`${fieldname}.city`];
  delete formData[`${fieldname}.county`];
  delete formData[`${fieldname}.postcode`];
  delete formData[`${fieldname}.country`];

}

function convertToFormAddress(object, fieldname) {
  if (!object[`${fieldname}_1`]) return;
  object[fieldname] = {};

  if (object[`${fieldname}_1`]) object[fieldname].address1 = object[`${fieldname}_1`];
  if (object[`${fieldname}_2`]) object[fieldname].address2 = object[`${fieldname}_2`];
  if (object[`${fieldname}_town`]) object[fieldname].city = object[`${fieldname}_town`];
  if (object[`${fieldname}_county`]) object[fieldname].county = object[`${fieldname}_county`];
  if (object[`${fieldname}_country`]) object[fieldname].country = object[`${fieldname}_country`];
  if (object[`${fieldname}_postcode`]) object[fieldname].postcode = object[`${fieldname}_postcode`];

  delete object[`${fieldname}_1`];
  delete object[`${fieldname}_2`];
  delete object[`${fieldname}_town`];
  delete object[`${fieldname}_county`];
  delete object[`${fieldname}_postcode`];
  delete object[`${fieldname}_country`];

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
  convertFromFormAddress,
  convertToFormAddress,
  encodeQueryData
};
