'use strict';

const request = require('request-promise');
const config = require('../../config');
const transformSectors = require( './transformers/metadata-sectors' );

function getMetadata( path, key ){

  let url = `${config.apiRoot}/metadata/${ path }`;

  return request({
    url,
    json: true
  })
  .then((data) => {

    module.exports[ key ] = data;
    return data;

  }).catch( ( err ) => {

    console.error( 'Error fetching metadata for url: %s', url );
    throw err;
  } );
}

function createSubSectors( data ){

  const splitSectors = transformSectors( data );

  module.exports.PRIMARY_SECTORS = splitSectors.sectors;
  module.exports.SUBSECTORS = splitSectors.subsectors;
}

const metadataItems = [
  [ 'sector/', 'SECTOR_OPTIONS', createSubSectors ],
  [ 'turnover', 'TURNOVER_OPTIONS' ],
  [ 'uk-region', 'REGION_OPTIONS' ],
  [ 'country', 'COUNTRYS' ],
  [ 'employee-range', 'EMPLOYEE_OPTIONS' ],
  [ 'business-type', 'TYPES_OF_BUSINESS' ],
  [ 'team', 'TEAMS' ]
];


module.exports.fetchAll = function( cb ){

  let caughtErrors;
  let totalRequests = 0;
  let completeRequests = 0;

  function checkResults(){

    completeRequests++;

    if( completeRequests === totalRequests ){
      console.log( 'All metadata requests complete' );
      cb( caughtErrors );
    }
  }

  for( let item of metadataItems ){

    totalRequests++;

    getMetadata( item[ 0 ], item[ 1 ] ).then( ( data ) => {

      if( item[ 2 ] ){

        item[ 2 ]( data );
      }

      checkResults();

    } ).catch( ( err ) => {

      caughtErrors = caughtErrors || [];
      caughtErrors.push( err );
      checkResults();
    } );
  }
};

module.exports.REASONS_FOR_ARCHIVE = [
  'Company is dissolved',
  'Other'
];
