'use strict';

let leads = {};

function generateLeadId(){

  return Math.floor( Date.now() * Math.random() );
}

function getLeads( userId ){

  const userLeads = ( leads[ userId ] || [] );

  return userLeads;
}

module.exports = {

  getAll: getLeads,

  getById: function( userId, leadId ){

    if( typeof userId === 'undefined' ){ throw new Error( 'userId is required' ); }
    if( typeof leadId === 'undefined' ){ throw new Error( 'leadId is required' ); }

    const userLeads = getLeads( userId );
    let lead;

    for( lead of userLeads ){

      if( lead._id == leadId ){
        return lead;
      }
    }

    return null;
  },

  save: function( userId, lead ){

    let userLeads = getLeads( userId );

    lead._id = generateLeadId();
    lead.date = Date.now();

    userLeads.push( lead );

    leads[ userId ] = userLeads;
  },

  remove: function( userId, leadId ){

    let userLeads = getLeads( userId );
    let lead;
    let i = 0;

    while( ( lead = userLeads[ i ] ) ){

      if( lead._id == leadId ){

        userLeads.splice( i, 1 );
        return;
      }

      i++;
      lead = null;
    }
  },

  update: function( userId, leadId, newLead ){

    const userLeads = getLeads( userId );

    let lead;
    let i = 0;

    while( ( lead = userLeads[ i ] ) ){

      if( lead._id == leadId ){

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
