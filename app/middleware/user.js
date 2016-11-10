'use strict';

const config = require( '../../config' );
const authorisedRequest = require( '../lib/authorisedRequest' );

module.exports = function( req, res, next ){

  const token = req.session.token;
  const user = req.session.user;

  console.log( 'token: %s', token );
  console.log( 'user:' );
  console.dir( user );

  if( token && !user ){

    console.log( 'Fetching user info' );

    const opts = {
      url: `${config.apiRoot}/whoami`,
      json: true
    };

    authorisedRequest( token, opts ).then( ( user ) => {

      req.session.user = {
        id: user.id,
        name: user.name,
        username: user.username
      };

      res.locals.user = req.session.user;

      next();

    } ).catch( ( error ) => {

      console.log( 'Error getting user' );
      res.render( 'error', { error } );
    } );

  } else {

    if( user ){

      res.locals.user = user;
    }

    next();
  }
};
