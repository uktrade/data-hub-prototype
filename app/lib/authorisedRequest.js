'use strict';

const request = require( 'request-promise' );

module.exports = function( token, opts ){

  opts.headers = opts.headers || {};

  opts.headers.Authorization = `Bearer ${token}`;

  return request( opts );
};
