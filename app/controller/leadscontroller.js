'use strict';

const express = require('express');

const createRouter = express.Router;
const router = createRouter();

function index( req, res ){

  res.render( 'leads/index' );
}

router.get( '/', index );

module.exports = {
  router
};
