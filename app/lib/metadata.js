'use strict';
const rp = require('request-promise');
const config = require('../../config');

rp({
  url: `${config.apiRoot}/metadata/sector/`,
  json: true
})
  .then((data) => {
    module.exports.SECTOR_OPTIONS = data;
  });




module.exports.REASONS_FOR_ARCHIVE = [
  'Company is dissolved',
  'Other'
];

rp({
  url: `${config.apiRoot}/metadata/turnover`,
  json: true
})
  .then((data) => {
    module.exports.TURNOVER_OPTIONS = data;
  });


rp({
  url: `${config.apiRoot}/metadata/uk-region`,
  json: true
})
.then((data) => {
    module.exports.REGION_OPTIONS = data;
});

module.exports.ADVISOR_OPTIONS = require('../../data/advisors.json');

rp({
  url: `${config.apiRoot}/metadata/country`,
  json: true
})
.then((data) => {
    module.exports.COUNTRYS = data;
});

rp({
  url: `${config.apiRoot}/metadata/employee-range`,
  json: true
})
.then((data) => {
    module.exports.EMPLOYEE_OPTIONS = data;
});

rp({
  url: `${config.apiRoot}/metadata/business-type`,
  json: true
})
.then((data) => {
  module.exports.TYPES_OF_BUSINESS = data;
});
