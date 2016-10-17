/* eslint new-cap: 0 */
'use strict';

const express = require('express');
const router = express.Router();

function index( req, res ){

	res.render( 'leads/index' );
}

router.get( '/', index );

module.exports = {
	router
};
