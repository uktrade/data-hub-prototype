'use strict';

const request = require('request-promise');
const config = require('../../config');
const transformSectors = require( './transformers/metadata-sectors' );
let redisClient;

function getMetadata( path, key ){

  let url = `${config.apiRoot}/metadata/${ path }/`;

  if( redisClient ){

    return new Promise( ( resolve, reject ) => {

      redisClient.get( url, function( err, data ){

        if( !err && data ){

          data = JSON.parse( data );

          module.exports[ key ] = data;
          resolve( data );

        } else {

          request({
            url,
            json: true
          })
          .then((data) => {

            module.exports[ key ] = data;
            redisClient.set( url, JSON.stringify( data ) );
            resolve( data );

          }).catch( ( err ) => {

            console.error( 'Error fetching metadata for url: %s', url );
            reject( err );
            throw err;
          } );
        }
      } );
    } );

  } else {

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

}

function createSubSectors( data ){

  const splitSectors = transformSectors( data );

  module.exports.PRIMARY_SECTORS = splitSectors.sectors;
  module.exports.SUBSECTORS = splitSectors.subsectors;
}

const metadataItems = [
  [ 'sector', 'SECTOR_OPTIONS', createSubSectors ],
  [ 'turnover', 'TURNOVER_OPTIONS' ],
  [ 'uk-region', 'REGION_OPTIONS' ],
  [ 'country', 'COUNTRYS' ],
  [ 'employee-range', 'EMPLOYEE_OPTIONS' ],
  [ 'business-type', 'TYPES_OF_BUSINESS' ],
  [ 'team', 'TEAMS' ]
];

module.exports.setRedisClient = function( client ){

  redisClient = client;
};

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
