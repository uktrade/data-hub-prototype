'use strict';
const moment = require('moment');

function sortItemDate(a, b) {
  const diff = Date.parse(b.created_on) - Date.parse(a.created_on);
  if (diff > 0) {
    return 1;
  } else if (diff < 0) {
    return -1;
  }
  return 0;
}

function getTimeSinceLastAddedItem(items) {
  // filter invalid dates and Sort the item by date
  const sorted = items
    .filter(item => (item.created_on && Date.parse(item.created_on)))
    .sort(sortItemDate);

  if (sorted.length === 0) return null;

  // Then use moment to turn the time from now into something human readable
  // and split it into it's components parts so the FE can style it as it wishes
  let [amount, unit] = moment(sorted[0].created_on).fromNow().split(' ');
  if (amount === 'a') amount = '1';

  return { amount, unit };
}

function getItemsAddedSince(items, unit = 'years', amount = 1) {

  // Figure out the date back using the unit and amount provided.
  const startFromDate = moment().subtract(amount, unit).toDate();

  return items.filter(item =>
    item.created_on &&
    Date.parse(item.created_on) &&
    (Date.parse(item.created_on) >= startFromDate));

}


module.exports = {
  getTimeSinceLastAddedItem,
  getItemsAddedSince
};
