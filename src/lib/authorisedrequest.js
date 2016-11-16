'use strict';

const request = require( 'request-promise' );
const winston = require('winston');

module.exports = function( token, opts ){

  opts.headers = opts.headers || {};

  opts.headers.Authorization = `Bearer ${token}`;

  winston.log('debug', 'Sending ' + ( opts.method || 'GET' ) + ' request to %s', opts.url );

  return request( opts );
};
