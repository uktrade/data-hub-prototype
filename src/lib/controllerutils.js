function transformErrors(expressErrors) {

  if (!expressErrors) {
    return null;
  }

  const errors = {};

  for (const error of expressErrors) {
    errors[error.param] = error.msg;
  }

  return errors;
}

function encodeQueryData(data) {
  const ret = [];
  for (const key in data) {
    const item = data[key];

    if (Array.isArray(item)) {
      for (const innerValue of item) {
        ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(innerValue));
      }
    } else {
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(item));
    }
  }
  return ret.join('&');
}

function convertAutosuggestCollection(form, targetFieldName) {

  const lowerTargetFieldName = targetFieldName.toLocaleLowerCase();
  const fieldNames = Object.keys(form);

  form[targetFieldName] = [];

  for (const fieldName of fieldNames) {
    if (fieldName.toLocaleLowerCase().substr(0, targetFieldName.length) === lowerTargetFieldName) {
      form[targetFieldName].push({
        id: form[fieldName],
        name: form[`${fieldName}-display`],
      });
      delete form[`${fieldName}-display`];
      delete form[fieldName];
    }
  }
}

// Scans the properties of an object (forms) and turns data.x = {id:123, name:'y'} into data.x=123
// This is used so that when a forms posts back an nested object (in the same format it was given the data
// it is flattened in to the alternative format used by the server.

function flattenIdFields(data) {
  const fieldNames = Object.keys(data);
  for (const fieldName of fieldNames) {
    const fieldValue = data[fieldName];
    if (fieldValue !== null) {
      if (Array.isArray(fieldValue)) {
        // Scan through the array of values, strip out any that are null, empty or have a null or empty id
        data[fieldName] = fieldValue
          .filter(item =>
            ((item && item.id && item.id !== null && item.id.length > 0)
            || (item !== null && item.length > 0)))
          .map(item => item.id);
      } else if (fieldValue.id) {
        data[fieldName] = fieldValue.id;
      }
    }
  }
}

function flattenAddress(data, addressName) {

  if (addressName) {
    if (data[`${addressName}_address`]) {
      const address = data[`${addressName}_address`];
      const addressKeys = Object.keys(address);
      for (const key of addressKeys) {
        data[`${addressName}_${key}`] = address[key];
      }
      delete data[`${addressName}_address`];
    }
  } else {
    for (const key of Object.keys(data.address)) {
      data[key] = data.address[key];
    }
    delete data.address;
  }
}

function nullEmptyFields(data) {
  const fieldNames = Object.keys(data);
  for (const fieldName of fieldNames) {
    const fieldValue = data[fieldName];
    if (fieldValue !== null && fieldValue.length === 0) {
      data[fieldName] = null;
    }
  }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function genCSRF(req, res) {
  const token = guid();
  req.session.csrfToken = token;
  if (res) {
    res.set('x-csrf-token', token);
  }
  return token;
}

module.exports = {
  transformErrors,
  encodeQueryData,
  convertAutosuggestCollection,
  flattenIdFields,
  flattenAddress,
  nullEmptyFields,
  genCSRF,
};
