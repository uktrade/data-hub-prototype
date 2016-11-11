'use strict';

const authorisedRequest = require( '../authorisedRequest' );
const config = require( '../../../config' );

module.exports = {

  getHomepageData: function( token, days = 15 ){

    const opts = {
      url: `${ config.apiRoot }/dashboard/homepage/?days=${ days }`,
      json: true
    };

    return authorisedRequest( token, opts ).then( ( data ) => {

      if( data.contacts && typeof data.contacts.map === 'function' ){

        data.contacts = data.contacts.map( ( contact ) => {

          if( !contact.name ){

            contact.name = ( contact.first_name + ' ' + contact.last_name );
          }

          return contact;
        } );
      }

      return data;
    } );
  }
};
