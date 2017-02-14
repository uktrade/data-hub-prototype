/* eslint camelcase: 0 */
const config = require('../config')
const authorisedRequest = require('../lib/authorisedrequest')

// Get a company and then pad out the interactions with related data
function getDitCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/company/${id}/`)
}

function getCHCompany (token, id) {
  return authorisedRequest(token, `${config.apiRoot}/ch-company/${id}/`)
}

function saveCompany (token, company) {
  function saveParsedCompany (parsedCompany) {
    let method
    let url

    if (parsedCompany.id && parsedCompany.id.length > 0) {
      method = 'PUT'
      url = `${config.apiRoot}/company/${parsedCompany.id}/`
    } else {
      method = 'POST'
      url = `${config.apiRoot}/company/`
    }

    return new Promise((resolve, reject) => {
      authorisedRequest(token, { url, method, body: parsedCompany })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          if (typeof error.error === 'string') {
            return reject({
              statusCode: error.response.statusCode,
              errors: { detail: error.response.statusMessage }
            })
          }

          return reject({
            statusCode: error.response.statusCode,
            errors: error.error
          })
        })
    })
  }

  delete company.companies_house_data
  delete company.contacts
  delete company.interactions

  if (company.id && company.id.length > 0) {
    return saveParsedCompany(company)
  }

  return setCHDefaults(token, company)
    .then(parsedCompany => saveParsedCompany(parsedCompany))
}

function archiveCompany (token, companyId, reason) {
  const options = {
    body: { reason },
    url: `${config.apiRoot}/company/${companyId}/archive/`,
    method: 'POST'
  }
  return authorisedRequest(token, options)
}

function unarchiveCompany (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/company/${companyId}/unarchive/`)
}

module.exports = {
  saveCompany,
  getDitCompany,
  getCHCompany,
  archiveCompany,
  unarchiveCompany
}
