/* eslint camelcase: 0 */
const Q = require('q')
const winston = require('winston')
const metadataRepository = require('../repositorys/metadatarepository')
const advisorRepository = require('../repositorys/advisorrepository')
const companyRepository = require('../repositorys/companyrepository')
const serviceDeliveryRepository = require('../repositorys/servicedeliveryrepository')
const interactionService = require('./interactionservice')

function getContactInCompanyObject (company, contactId) {
  for (const contact of company.contacts) {
    if (contact.id === contactId) return contact
  }
  return contactId
}

function getInflatedDitCompany (token, id) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        const advisorHash = {}
        const company = yield companyRepository.getDitCompany(token, id)
        const serviceDeliverys = yield serviceDeliveryRepository.getServiceDeliverysForCompany(token, company.id)

        // Build a list of advisors to lookup
        for (const interaction of company.interactions) {
          advisorHash[interaction.dit_advisor] = true
        }
        for (const serviceDelivery of serviceDeliverys.data) {
          advisorHash[serviceDelivery.relationships.dit_advisor.data.id] = true
        }

        // get the related adviors
        for (const advisorId of Object.keys(advisorHash)) {
          const advisor = yield advisorRepository.getAdvisor(token, advisorId)
          advisorHash[advisor.id] = advisor
        }

        // Parse the service delivery results into something that can be displayed
        const parsedServiceDeliverys = serviceDeliverys.data.map((serviceDelivery) => {
          return {
            id: serviceDelivery.id,
            date: serviceDelivery.attributes.date,
            created_on: serviceDelivery.attributes.date,
            notes: serviceDelivery.attributes.notes,
            subject: serviceDelivery.attributes.subject,
            contact: getContactInCompanyObject(company, serviceDelivery.relationships.contact.data.id),
            interaction_type: { id: null, name: 'Service delivery' },
            dit_advisor: advisorHash[serviceDelivery.relationships.dit_advisor.data.id]
          }
        })

        // Parse the interaction into something that can be displayed
        const parsedInteractions = company.interactions.map((interaction) => {
          return {
            id: interaction.id,
            date: interaction.date,
            created_on: interaction.date,
            notes: interaction.notes,
            subject: interaction.subject,
            contact: getContactInCompanyObject(company, interaction.contact),
            interaction_type: interactionService.getInteractionType(interaction.interaction_type),
            dit_advisor: advisorHash[interaction.dit_advisor]
          }
        })

        const combinedIteractions = [...parsedInteractions, ...parsedServiceDeliverys]

        company.interactions = combinedIteractions
        resolve(company)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}



function getCompanyForSource (token, id, source) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        if (source === 'company_companieshousecompany') {
          const companies_house_data = yield companyRepository.getCHCompany(token, id)
          resolve({
            company_number: id,
            companies_house_data,
            contacts: [],
            interactions: []
          })
          return
        }

        const company = yield getInflatedDitCompany(token, id)
        resolve(company)
      } catch (error) {
        reject(error)
        return
      }
    })
  })
}

function setCHDefaults (token, company) {
  return new Promise((resolve, reject) => {
    Q.spawn(function *() {
      try {
        if (company.company_number) {
          const ch = yield companyRepository.getCHCompany(token, company.company_number)
          if (!company.name) company.name = ch.name
          if (!company.registered_address_1) company.registered_address_1 = ch.registered_address_1
          if (!company.registered_address_2) company.registered_address_2 = ch.registered_address_2
          if (!company.registered_address_town) company.registered_address_town = ch.registered_address_town
          if (!company.registered_address_county) company.registered_address_county = ch.registered_address_county
          if (!company.registered_address_postcode) company.registered_address_postcode = ch.registered_address_postcode
          if (!company.registered_address_country) company.registered_address_country = ch.registered_address_country.id
          company.uk_based = true

          // Business type
          const businessTypes = metadataRepository.TYPES_OF_BUSINESS
          for (const businessType of businessTypes) {
            if (businessType.name.toLowerCase() === ch.company_category.toLowerCase()) {
              company.business_type = businessType.id
            }
          }
        }
        resolve(company)
      } catch (error) {
        winston.error(error)
        reject(error)
      }
    })
  })
}

module.exports = { getInflatedDitCompany, getCompanyForSource, setCHDefaults }
