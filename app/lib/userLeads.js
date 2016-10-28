'use strict';

let leads = {};

function generateLeadId(){

  return Math.floor( Date.now() * Math.random() );
}

function getLeads( userId ){

  return new Promise( ( resolve ) => {

    const userLeads = ( leads[ userId ] || [] );

    resolve( userLeads );
  } );
}

module.exports = {

  getAll: getLeads,

  getById: function( userId, leadId ){

    if (typeof userId === 'undefined'){ throw new Error( 'userId is required' ); }
    if (typeof leadId === 'undefined'){ throw new Error( 'leadId is required' ); }

    return new Promise( ( resolve ) => {

      getLeads( userId ).then( ( userLeads ) => {

        let lead;

        for (lead of userLeads){

          if (lead._id == leadId){
            resolve(lead);
            return;
          }
        }

        resolve( null );
      } );
    } );
  },

  save: function( userId, lead ){

    return new Promise( ( resolve ) => {

      getLeads( userId ).then( ( userLeads ) => {

        lead._id = generateLeadId();
        lead.date = Date.now();

        userLeads.push( lead );

        leads[ userId ] = userLeads;

        resolve();
      } );
    } );
  },

  remove: function( userId, leadId ){

    return new Promise( ( resolve ) => {

      getLeads( userId ).then( ( userLeads ) => {

        let lead;
        let i = 0;

        while ((lead = userLeads[ i ])) {

          if (lead._id == leadId){

            userLeads.splice( i, 1 );
            break;
          }

          i++;
          lead = null;
        }

        resolve();
      } );
    } );
  },

  update: function( userId, leadId, newLead ){

    return new Promise( ( resolve, reject ) => {

      getLeads( userId ).then( ( userLeads ) => {

        let lead;
        let i = 0;

        while ((lead = userLeads[ i ])) {

          if (lead._id == leadId) {

            newLead._id = leadId;
            userLeads[ i ] = newLead;
            resolve();
            return;
          }

          i++;
          lead = null;
        }

        reject( new Error( 'Lead does not exist' ) );
      } );
    } );
  }
};
