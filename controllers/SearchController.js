'use strict';

const api = require('../lib/companiesHouseApi');

function render(res, data) {
  res.render('search', data);
}

function handleError(res, error) {
  res.render('search', {
    error
  });
}

function get(req, res) {
  let kind = req.params.type;
  let query = req.query.query;

  switch (kind) {
    case 'companies':
      api
        .findCompanies(query)
        .then(function(result) {
          render(res, {
            kind,
            query,
            items: result.items,
            total_results: result.total_results
          });
        })
        .catch(function(err) {
          handleError(res, err);
        });
      break;
    case 'contacts':
      render(res, {
        kind,
        query
      });
      break;
    case 'projects':
      render(res, {
        kind,
        query
      });
      break;
    default:
      render(res, {});
  }
}

module.exports = {
  get: get
};
