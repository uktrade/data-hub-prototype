const authorisedRequest = require('../lib/authorisedrequest')
const config = require('../config')

function saveServiceDelivery (token, serviceDelivery) {
  const body = { data: {
    type: 'ServiceDelivery',
    attributes: {
      subject: serviceDelivery.subject,
      notes: serviceDelivery.notes,
      date: serviceDelivery.date
    },
    relationships: {
      company: {data: {type: 'Company', id: serviceDelivery.company}},
      dit_team: {data: {type: 'Team', id: serviceDelivery.dit_team}},
      service: {data: {type: 'Service', id: serviceDelivery.service}},
      status: {data: {type: 'ServiceDeliveryStatus', id: serviceDelivery.status}},
      contact: {data: {type: 'Contact', id: serviceDelivery.contact}},
      dit_advisor: {data: {type: 'Advisor', id: serviceDelivery.dit_advisor}},
      uk_region: {data: {type: 'UKRegion', id: serviceDelivery.uk_region}},
      sector: {data: {type: 'Sector', id: serviceDelivery.sector}},
      country_of_interest: {data: {type: 'Country', id: serviceDelivery.country_of_interest}}
    }
  }}

  const options = { body }

  if (serviceDelivery.id && serviceDelivery.id.length > 0) {
    options.body.data.id = serviceDelivery.id
    options.url = `${config.apiRoot}/v2/service-delivery/${serviceDelivery.id}/`
    options.method = 'PUT'
  } else {
    options.url = `${config.apiRoot}/v2/service-delivery/`
    options.method = 'POST'
  }

  return authorisedRequest(token, options)
}

function getServiceDelivery (token, serviceDeliveryId) {
  return authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/${serviceDeliveryId}/`)
}

function getServiceDeliverysForCompany (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/?company=${companyId}`)
}

function getServiceDeliverysForContact (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/v2/service-delivery/?contact=${companyId}`)
}

module.exports = {
  getServiceDelivery,
  saveServiceDelivery,
  getServiceDeliverysForCompany,
  getServiceDeliverysForContact
}
