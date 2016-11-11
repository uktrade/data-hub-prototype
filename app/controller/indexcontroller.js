'user strict';

const dashboardService = require( '../lib/service/dashboard' );

function mapContacts( contacts ){

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

function mapInteractions( interactions ){

  return interactions.map( ( interaction ) => {

    return {
      url: `/interaction/${ interaction.id }/view`,
      id: interaction.id,
      subject: interaction.subject
    };
  } );
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
