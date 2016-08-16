'use strict';

const sectors = require('../../data/sectors.json');
const contactsData = require('../../data/fakenames.json');
const api = require('../lib/companieshouseapis');
const sicCodes = require('../../data/sic-codes.json');
const interactionsData = require('../../data/interactions.json');
const companyTypes = require('../../data/companytype.json');
const advisors = require('../../data/advisors.json');

var data = {};

function expandSicCodes(company) {
  if (company.sic_codes) {
    const expandedCodes = company.sic_codes.map((sic_code) => {
      return sicLookup(sic_code);
    });

    delete company.sic_codes;
    company.sic_codes = expandedCodes;
  }
}

function sicLookup(code) {
  let sicCode = sicCodes.find((item) => {
    return item.code === code;
  });

  if (!sicCode) {
    return code;
  }
  return sicCode;
}

function addSectors(company) {
  company.sectors = [];
  for (let pos = Math.round(Math.random() * 3); pos > 0; pos -= 1) {
    company.sectors.push(sectors[Math.round(Math.random() * (sectors.length - 1))]);
  }
}

function addRandomPeople(company) {
  company.contacts = [];
  for (let pos = 5; pos > 0; pos -= 1) {
    const randindex = Math.round(Math.random() * (contactsData.length - 1));
    let randomContact = Object.assign({}, contactsData[randindex]);
    let newContact = {
      id: `${pos}${company.id}`,
      title: randomContact.title,
      firstname: randomContact.givenname,
      lastname: randomContact.surname,
      occupation: randomContact.occupation,
      telephonenumber: randomContact.telephonenumber,
      emailaddress: randomContact.emailaddress,
      address: {
        address1: randomContact.streetaddress,
        address2: '',
        city: randomContact.city,
        county: '',
        country: 'United Kingdom',
        postcode: randomContact.zipcode
      }
    };
    company.contacts.push(newContact);
  }
  company.contacts[0].primaryContact = true;
}

function addInteractionData(company) {
  // Allocate a random contact from the company
  company.interactions = interactionsData.map((interaction) => {
    let newInteraction = Object.assign({}, interaction);

    let randindex = Math.round(Math.random() * (company.contacts.length - 1));
    newInteraction.contactId = company.contacts[randindex].id;
    newInteraction.advisor = advisors[randindex];

    return newInteraction;
  });
}

function addUKTIData(company) {
  addRandomPeople(company);
  addSectors(company);
  addInteractionData(company);
  Object.assign(company, {
    countryOfInterest: ['Argentina', 'Greece'],
    uktidata: true
  });
}

function getCompanyContact(companyId, contactId) {

  const company = data[companyId];
  if (!company) {
    return null;
  }

  let contacts = company.contacts;
  for (let pos = 0; pos < contacts.length; pos += 1) {
    if (contacts[pos].id === contactId) {
      let contact = contacts[pos];
      contact.company = {
        title: company.title,
        id: company.id
      };
      contact.sectors = company.sectors;
      contact.status = company.status;
      return contact;
    }
  }

  return null;
}

function getInteractionsForContact(companyId, contactId) {
  const company = data[companyId];

  if (!company || !company.interactions) {
    return [];
  }

  return company.interactions.filter((interaction) => interaction.contactId === contactId);
}

function setCompanyContact(companyId, updatedContact) {

  const company = data[companyId];
  if (!company) {
    return null;
  }

  if (!company.contacts) {
    company.contacts = [];
  }

  // Add new contacts, that have no id
  if (!updatedContact.id) {
    updatedContact.id = `${company.contacts.length + 1}${company.id}`;
    updatedContact.company = {
      title: company.title,
      id: company.id
    };
    company.contacts.push(updatedContact);
    return updatedContact;
  }

  // Update contacts that exist
  let contacts = company.contacts;
  for (let pos = 0; pos < contacts.length; pos += 1) {
    if (contacts[pos].id === updatedContact.id) {
      company.contacts[pos] = updatedContact;
      return company.contacts[pos];
    }
  }

  return null;
}

function getCompanyInteraction(companyId, interactionId) {
  let company = data[companyId];
  if (!company) {
    return null;
  }

  for (let interaction of company.interactions) {
    if (interaction.id === interactionId) {
      return Object.assign({}, interaction);
    }
  }

  return null;
}

function setCompanyInteraction(companyId, updatedInteraction) {
  const moment = require('moment');
  const company = data[companyId];
  if (!company) {
    return null;
  }

  if (!company.interactions) {
    company.interactions = [];
  }

  let now = moment().format('DD/MM/YYYY');

  updatedInteraction.updatedBy = 'Test user';
  updatedInteraction.updatedOn = now;


  // Add new interactions, that have no id  more todo later
  if (!updatedInteraction.id) {
    updatedInteraction.id = `${company.interactions.length + 1}${company.id}`;
    updatedInteraction.createdBy = 'Test user';
    updatedInteraction.createdOn = now;
    company.interactions.push(updatedInteraction);
    return updatedInteraction;
  }

  // Update contacts that exist
  let interactions = company.interactions;
  for (let pos = 0; pos < interactions.length; pos += 1) {
    if (interactions[pos].id === updatedInteraction.id) {
      company.interactions[pos] = updatedInteraction;
      return company.interactions[pos];
    }
  }

  return null;
}


function getCompanySummary(id) {
  if (data[id]) {
    return Object.assign({}, data[id]);
  }

  return null;
}

function getCompany(id) {
  return new Promise((fulfill, reject) => {

    // Look for the company in local cached data,
    // if not there then created an empty one to populate
    let company = data[id];
    if (!company) {
      company = {
        id: id
      };
    }

    // if the cached record is a detailed one, return it
    if (company.containsExpandedData || !company.company_number) {
      fulfill(Object.assign({}, company));
      return;
    }

    // If the cachced record isn't complete, goto CH API and get it's details
    api.findCompany(id)
      .then((chCompany) => {

        delete chCompany.status;
        company.companyType = companyTypes[chCompany.type];
        Object.assign(company, chCompany);
        company.containsExpandedData = true;
        expandSicCodes(company);

        // Add it back into the local DB. it will override the existing one
        // and add the contacts and stuff if we had to get a fresh copy
        // because of a restart
        company = addCompany(company);

        fulfill(Object.assign({}, company));
      })
      .catch((error) => {
        reject(error);
      });


  });
}

function addCompany(company) {
  if (!company.id && company.company_number) {
    company.id = company.company_number;
  }

  // randomly add ukti data to make a combined record or
  // add ukti and then remove CH data
  let rand = Math.round(Math.random() * 10);
  if (rand > 8 && !company.uktidata ) {
    addUKTIData(company);
    company.source = 'Combined';
  } else if (rand < 3 && !company.uktidata) {
    addUKTIData(company);
    delete company.company_number;
    company.source = 'Department of International Trade';
  } else {
    company.source = 'Companies House';
  }

  data[company.id] = company;
  return company;
}

function updateCompany(company) {
  data[company.id] = company;
}


module.exports = {
  getCompany,
  getCompanySummary,
  addCompany,
  updateCompany,
  getCompanyContact,
  setCompanyContact,
  getCompanyInteraction,
  setCompanyInteraction,
  getInteractionsForContact
};
