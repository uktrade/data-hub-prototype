'use strict';

const request = require( 'request-promise' );

module.exports = function( token, opts ){

  opts.headers = opts.headers || {};

  opts.headers.Authorization = `Bearer ${token}`;

  console.log( 'Sending request to %s', opts.url );

  return request( opts );
};
