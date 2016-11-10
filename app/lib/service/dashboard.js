'use strict';

const authorisedRequest = require( '../authorisedRequest' );
const config = require( '../../../config' );

module.exports = {

  getHomepageData: function( token ){

    const opts = {
      url: `${ config.apiRoot }/dashboard/homepage/`,
      json: true
    };

    return authorisedRequest( token, opts );
  }
};
