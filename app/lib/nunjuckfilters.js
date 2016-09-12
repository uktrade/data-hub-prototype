'use strict';

var moment = require('moment');

function highlightTerm(phrase, term) {
  if (!phrase || phrase.length === 0) {
    return '';
  }
  var regex = new RegExp('(' + term + ')', 'gi');
  return '<span>' + phrase.replace(regex, '<strong>$1</strong>') + '</span>';

}


/**
 * creates rearranges values and creates new date object
 * @param  {String} d   A date string (must be) formatted yyyy-mm-dd
 * @return {String}     a javascript date string
 */
function newDate(d) {
  var dateArr = d.split('-');
  return dateArr.length === 3 ? new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]) : NaN;
}

/**
 * returns a standard gov.uk date from a string using momentjs
 * moment documentation: http://momentjs.com/docs/
 * @method function
 * @param  {string} d date e.g 09/12/1981 or 9-12-1981
 * @param  {string} f moment.js format string (to override the default if needed)
 * @return {string} date string as per the current gov.uk standard 09/12/1981 -> 09 December 1981
 */
function formatDate(d, f) {

  let formatted;

  if (d && d.length > 0 && d.length < 11) {
    formatted = moment(newDate(d)).locale('en-gb').format(f ? f : 'LL');
  } else {
    formatted = moment(d, moment.ISO_8601).format('DD MMMM YYYY, h:mm:ss a');
  }

  if (formatted === 'Invalid date') {
    return '';
  }

  return formatted;
}

module.exports = {
  formatDate,
  highlightTerm
};
