'use strict';
const moment = require('moment');

function sortContactDate(a, b) {
  return Date.parse(b.created_on) - Date.parse(a.created_on);
}

function getTimeSinceLastAddedContact(contacts) {
  // filter invalid dates and Sort the contacts by date
  const sorted = contacts
    .filter(contact => (contact.created_on && Date.parse(contact.created_on)))
    .sort(sortContactDate);

  if (sorted.length === 0) return null;

  // Then use moment to turn the time from now into something human readable
  // and split it into it's component parts so the FE can style it as it wishes
  let [amount, unit] = moment(sorted[0].created_on).fromNow().split(' ');
  if (amount === 'a') amount = '1';

  return { amount, unit };
}

function getContactsAddedSince(contacts, unit='years', amount=1) {

  // Figure out the date back using the unit and amoun provided.
  const startFromDate = moment().subtract(amount, unit).toDate();

  return contacts.filter(contact =>
    contact.created_on &&
    Date.parse(contact.created_on) &&
    (Date.parse(contact.created_on) >= startFromDate));

}


module.exports = {
  getTimeSinceLastAddedContact,
  getContactsAddedSince
};
