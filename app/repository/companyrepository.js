'use strict';
const rp = require('request-promise');
const config = require('../../config');
const moment = require('moment');
const metadata = require('../lib/metadata');


function lookupCountry(id) {
  for (let country of metadata.COUNTRYS) {
    if (country.id == id) {
      return country.name;
    }
  }
  return null;
}

function getDitCompany(id) {
  return rp({
    url: `${config.apiRoot}/company/${id}/`,
    json: true
  });
}

function getCHCompany(id) {
  return rp({ url: `${config.apiRoot}/ch-company/${id}/`, json: true });
}

function flattenAddresses(company) {

  if (company.registered_address) {
    const registered_address = company.registered_address;
    if (registered_address.address_1) company.registered_address_1 = registered_address.address_1;
    if (registered_address.address_2) company.registered_address_2 = registered_address.address_2;
    if (registered_address.address_town) company.registered_address_town = registered_address.address_town;
    if (registered_address.address_county) company.registered_address_county = registered_address.address_county;
    if (registered_address.address_postcode) company.registered_address_postcode = registered_address.address_postcode;
    if (registered_address.address_country) {
      company.registered_address_country = registered_address.address_country;
      company.registered_address_country_name = lookupCountry(registered_address.address_country);
    }
    delete company.registered_address;
  }

  if (company.trading_address) {
    const trading_address = company.trading_address;
    if (trading_address.address_1) company.trading_address_1 = trading_address.address_1;
    if (trading_address.address_2) company.trading_address_2 = trading_address.address_2;
    if (trading_address.address_town) company.trading_address_town = trading_address.address_town;
    if (trading_address.address_county) company.trading_address_county = trading_address.address_county;
    if (trading_address.address_postcode) company.trading_address_postcode = trading_address.address_postcode;
    if (trading_address.address_country) {
      company.trading_address_country = trading_address.address_country;
      company.trading_address_country_name = lookupCountry(trading_address.address_country);
    }
    delete company.trading_address;
  }
}

function getCompany(id, source) {

  return new Promise((fulfill, reject) => {
    // Get DIT Company
    if (source === 'company_companieshousecompany') {
      getCHCompany(id)
        .then((ch) => {
          fulfill({
            company_number: id,
            ch,
            contacts: [],
            interactions: []
          });
        })
        .catch((error) => {
          reject(error);
        });

      return;
    }

    getDitCompany(id)
      .then((company) => {
        flattenAddresses(company);
        fulfill(company);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function saveCompany(company) {

  let options = {
    json: true,
    body: company
  };


  if (company.id && company.id.length > 0) {
    // update
    options.url = `${config.apiRoot}/company/${company.id}/`;
    options.method = 'PUT';
  } else {
    options.url = `${config.apiRoot}/company/`;
    options.method = 'POST';
  }

  return rp(options);
}

function archiveCompany(companyId, reason) {

  let options = {
    json: true,
    body: {
      'archive_date': moment().format('YYYY-MM-DD'),
      'archive_reason': reason,
      'archived_by': 'Lee Smith',
    },
    url: `${config.apiRoot}/company/${companyId}/`,
    method: 'PATCH'
  };

  return rp(options);

}

function unarchiveCompany(companyId) {
  let options = {
    json: true,
    body: {
      'archive_date': null,
      'archive_reason': null,
      'archived_by': null,
    },
    url: `${config.apiRoot}/company/${companyId}/`,
    method: 'PATCH'
  };

  return rp(options);
}

module.exports = {getCompany, saveCompany, getDitCompany, getCHCompany, archiveCompany, unarchiveCompany};
