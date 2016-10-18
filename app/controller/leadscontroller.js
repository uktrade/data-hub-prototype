/* eslint max-len: 0 */
'use strict';

const express = require('express');

const createRouter = express.Router;
const router = createRouter();

function index( req, res ){

  const contacts = [
    { name: 'Albert John Carless', phone: '+44 7070123123', email: 'ajohn.carless@siemenshealth.co.uk', date: 1463526000000 },
    { name: 'Jay Clement James', phone: '+44 7070123123', date: 1462834800000 },
    { name: 'Sue Smith', email: 'bobsmith@siemenshealth.co.uk', date: 1461366000000 },
    { name: 'Paul Smith', phone: '+44 7070123123', date: 1274137200000 },
    { name: 'John Smith', phone: '+44 7070123123', email: 'ajohn.carless@siemenshealth.co.uk', date: 1244588400000 },
    { name: 'Fred Smith', date: 1234224000000 }
  ];

  res.render( 'leads/index', {
    contacts
  } );
}

router.get( '/', index );

module.exports = {
  router
};
