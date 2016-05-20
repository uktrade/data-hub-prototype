'use strict';

const sectors = require('../../data/sectors.json');

const contactsData = require('../../data/fakenames.json');
const statusOptions = ['Prospect', 'UKTI Customer', ''];

let data = {};

function getCompany(id) {
  return data[id];
}

function addCompany(company) {
  if (!company.id && company.company_number) {
    company.id = company.company_number;
  }
  if (!company.contacts || company.contacts.length === 0) {
    addRandomPeople(company);
    addSectors(company);
    addStatus(company);
  }
  data[company.id] = company;
  return company;
}

function updateCompany(company) {
  data[company.id] = company;
}

function addRandomPeople(company) {
  company.contacts = [];
  for (let pos = 5; pos > 0; pos -= 1) {
    const randindex = Math.round(Math.random() * (contactsData.length - 1));
    let randomContact = contactsData[randindex];
    randomContact.id = `${randomContact.id}`;
    company.contacts.push(randomContact);
  }
}

function addSectors(company) {
  company.sectors = [];
  for (let pos = Math.round(Math.random() * 5); pos > 0; pos -= 1) {
    company.sectors.push(sectors[Math.round(Math.random() * (sectors.length - 1))]);
  }
}

function addStatus(company) {
  const randindex = Math.round(Math.random() * (statusOptions.length - 1));
  company.status = statusOptions[randindex];
}


function getCompanyContact(companyId, contactId) {

  const company = getCompany(companyId);
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

module.exports = {
  getCompany,
  addCompany,
  updateCompany,
  getCompanyContact
};
