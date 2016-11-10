'use strict';

const config = require( '../../config' );
const authorisedRequest = require( '../lib/authorisedRequest' );

module.exports = function( req, res, next ){

  const token = req.session.token;
  const user = req.session.user;

  if( token && !user ){

    const opts = {
      url: `${config.apiRoot}/whoami/`,
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

      res.render( 'error', { error } );
    } );

  } else {

    if( user ){

      res.locals.user = user;
    }

    next();
  }
};
