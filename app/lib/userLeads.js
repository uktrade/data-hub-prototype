'use strict';

let leads = {};

function generateUserId(){

  return Math.floor( Date.now() * Math.random() );
}

function getLeads( userId ){

  const userLeads = ( leads[ userId ] || [] );

  console.log( 'Got %s lead(s) for user %s', userLeads.length, userId );

  return userLeads;
}

module.exports = {

  get: getLeads,

  save: function( userId, lead ){

    let userLeads = leads[ userId ] || [];

    lead._id = generateUserId();
    lead.date = Date.now();

    userLeads.push( lead );

    leads[ userId ] = userLeads;
    console.log( 'Added lead for %s', userId );
  },

  update: function( userId, leadId, newLead ){

    const userLeads = getLeads( userId );

    let lead;
    let i = 0;

    while( ( lead = userLeads[ i ] ) ){

      if( lead._id === leadId ){

        newLead._id = leadId;
        userLeads[ i ] = newLead;
        return;
      }

      i++;
      lead = null;
    }

    throw new Error( 'Lead does not exist' );
  }
};
