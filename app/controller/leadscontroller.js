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

function saveLead( lead, req, res ){

  let userId = req.cookies.userId;

  if( !userId ){

    userId = Math.floor( Date.now() * Math.random() );

    res.cookie( 'userId', userId );
  }

  userLeads.save( userId );
}

function addLead( req, res ){

  res.render( 'leads/add' );
}

function createLead( req, res ){

  var errors = [];

  if( !req.body.first_name ){

     errors.firstName = 'Please enter a first name';
     errors.push( [ 'first_name', errors.firstName ] );
  }

  if( !req.body.last_name ){

     errors.lastName = 'Please enter a last name';
     errors.push( [ 'last_name', errors.lastName ] );
  }

  if( errors.length ){

    res.render( 'leads/add', { errors, lead: req.body } );

  } else {

    // save lead info
    //saveLead( req.body );
    res.redirect( '/leads' );
  }
}

router.get( '/', index );
router.get( '/add', addLead );
router.post( '/add', createLead );

module.exports = {
  router
};
