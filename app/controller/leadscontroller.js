/* eslint max-len: 0 */
'use strict';

const express = require('express');
const userLeads = require( '../lib/userLeads' );

const createRouter = express.Router;
const router = createRouter();

function getUserId( req, res ){

  let userId = req.cookies.userId;

  if( !userId ){

    userId = Math.floor( Date.now() * Math.random() );

    res.cookie( 'userId', userId );
  }

  return userId;
}

function mapLeadsForView( leads ){

  return leads.map( ( lead ) => {
    return {
      name: `${ lead.firstName } ${ lead.lastName }`,
      phone: lead.phone,
      email: lead.email,
      date: lead.date
    };
  } );
}

function getLeadDetails( params ){

  return {
    firstName: params.first_name,
    lastName: params.last_name,
    phone: params.phone,
    email: params.email,
    notes: params.notes
  };
}

function index( req, res ){
/*
  const contacts = [
    { name: 'Albert John Carless', phone: '+44 7070123123', email: 'ajohn.carless@siemenshealth.co.uk', date: 1463526000000 },
    { name: 'Jay Clement James', phone: '+44 7070123123', date: 1462834800000 },
    { name: 'Sue Smith', email: 'bobsmith@siemenshealth.co.uk', date: 1461366000000 },
    { name: 'Paul Smith', phone: '+44 7070123123', date: 1274137200000 },
    { name: 'John Smith', phone: '+44 7070123123', email: 'ajohn.carless@siemenshealth.co.uk', date: 1244588400000 },
    { name: 'Fred Smith', date: 1234224000000 }
  ];
*/
  const userId = getUserId( req, res );
  let leads = userLeads.get( userId );
  res.render( 'leads/index', { leads: mapLeadsForView( leads ) } );
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
    let userId = getUserId( req, res );
    userLeads.save( userId, getLeadDetails( req.body ) );
    res.redirect( '/leads' );
  }
}

router.get( '/', index );
router.get( '/add', addLead );
router.post( '/add', createLead );

module.exports = {
  router
};
