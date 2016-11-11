'use strict';

const dashboardService = require( '../lib/service/dashboard' );

function mapContacts( contacts ){

  if( contacts && ( typeof contacts.map ) === 'function' ){

    return contacts.map( ( contact ) => {

      return {
        url: `contact/${ contact.id }/view`,
        name: contact.name,
        id: contact.id,
        company: {
          url: `/company/company_company/${ contact.company.id }`,
          name: contact.company.name,
          id: contact.company.id
        }
      };
    } );
  }

  return contacts;
}

function mapInteractions( interactions ){

  if( interactions && ( typeof interactions.map ) === 'function' ){

    return interactions.map( ( interaction ) => {

      return {
        url: `/interaction/${ interaction.id }/view`,
        id: interaction.id,
        subject: interaction.subject
      };
    } );
  }

  return interactions;
}

module.exports = function( req, res ){

  const days = 15;

  dashboardService.getHomepageData( req.session.token, days ).then( ( data ) => {

    res.render( 'index', {
      totalDays: days,
      interactions: mapInteractions( data.interactions ),
      contacts: mapContacts( data.contacts )
    } );
  } );
};
