'use strict';

const api = require('../lib/companiesHouseApi');
const contactsData = require('../data/contacts.json');

function render(res, data) {
  res.render('search', data);
}

function handleError(res, error) {
  res.render('search', {
    error
  });
}

function highlightText(str, searchTerm) {
  str = str.toLowerCase();
  searchTerm = searchTerm.toLowerCase();

  let found = str.indexOf(searchTerm);

  if (found === -1) {
    return str;
  }
  return str.replace(searchTerm, `<strong>${searchTerm}</strong>`);
}

function get(req, res) {
  let kind = req.params.type;
  let query = req.query.query;

  switch (kind) {
    case 'companies':
      api
        .findCompanies(query)
        .then((result) => {
          render(res, {
            kind,
            query,
            highlightText,
            items: result.items,
            total_results: result.total_results
          });
        })
        .catch((err) => {
          handleError(res, err);
        });
      break;
    case 'contacts':
      api.findOfficers(query)
        .then((result) => {
          result.items = addRandomOfficerDetails(result.items);
          return result;
        })
        .then((result) => {
          render(res, {
            kind,
            query,
            highlightText,
            items: result.items,
            total_results: result.total_results
          });
        })
        .catch(function(err) {
          handleError(res, err);
        });
        break;
    default:
      render(res, {});
  }

}

function addRandomOfficerDetails(items) {
  return items.map((item) => {
    const randindex = Math.round(Math.random() * (contactsData.length - 1));
    const contact = contactsData[randindex];
    item.position = contact.position;
    item.company = {
      title: contact.company
    };
    return item;
  });
}

module.exports = {
  get: get
};
