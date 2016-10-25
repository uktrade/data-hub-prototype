/* eslint max-len: 0 */
'use strict';

const express = require('express');
const userLeads = require( '../lib/userLeads' );

const createRouter = express.Router;
const router = createRouter();

function getUserId( req, res, next ){

  let userId = req.cookies.userId;

  if( !userId ){

    userId = Math.floor( Date.now() * Math.random() );

    res.cookie( 'userId', userId );
  }

  req.userId = userId;
  next();
}

function mapLeadForSingleView( lead ){

  return {
    id: lead._id,
    name: `${ lead.firstName } ${ lead.lastName }`,
    phone: lead.phone,
    email: lead.email,
    date: lead.date,
    notes: lead.notes
  };
}

function mapLeadForListView( lead ){

  return {
    id: lead._id,
    name: `${ lead.firstName } ${ lead.lastName }`,
    phone: lead.phone,
    email: lead.email,
    date: lead.date
  };
}

function mapLeadForEdit( lead ){

  return {
    id: lead._id,
    first_name: lead.firstName,
    last_name: lead.lastName,
    phone: lead.phone,
    email: lead.email,
    notes: lead.notes
  };
}

function mapLeadsForListView( leads ){

  return leads.map( mapLeadForListView );
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
  const leads = [
    { name: 'Albert John Carless', phone: '+44 7070123123', email: 'ajohn.carless@siemenshealth.co.uk', date: 1463526000000 },
    { name: 'Jay Clement James', phone: '+44 7070123123', date: 1462834800000 },
    { name: 'Sue Smith', email: 'bobsmith@siemenshealth.co.uk', date: 1461366000000 },
    { name: 'Paul Smith', phone: '+44 7070123123', date: 1274137200000 },
    { name: 'John Smith', phone: '+44 7070123123', email: 'ajohn.carless@siemenshealth.co.uk', date: 1244588400000 },
    { name: 'Fred Smith', date: 1234224000000 }
  ];
*/
  let leads = userLeads.getAll( req.userId );
  res.render( 'leads/index', { leads: mapLeadsForListView( leads ) } );
}

function addLead( req, res ){

  res.render( 'leads/add', {
    action: '/leads/add',
    backUrl: '/leads'
  } );
}

function validateLead( params ){

  var errors = [];

  if( !params.first_name ){

     errors.firstName = 'Please enter a first name';
     errors.push( [ 'first_name', errors.firstName ] );
  }

  if( !params.last_name ){

     errors.lastName = 'Please enter a last name';
     errors.push( [ 'last_name', errors.lastName ] );
  }

  return errors;
}

function createLead( req, res ){

  let errors = validateLead( req.body );

  if( errors.length ){

    res.render( 'leads/add', { errors, lead: req.body } );

  } else {

    // save lead info
    userLeads.save( req.userId, getLeadDetails( req.body ) );
    res.redirect( '/leads' );
  }
}

function viewLead( req, res ){

  res.render( 'leads/view', { lead: mapLeadForSingleView( req.lead ) } );
}

function editLead( req, res ){

  res.render( 'leads/add', {
    action: '/leads/update',
    edit: true,
    backUrl: `/leads/view/${ req.lead._id }`,
    lead: mapLeadForEdit( req.lead )
  } );
}

function updateLead( req, res ){

  let errors = validateLead( req.body );

  if( errors.length ){

    res.render( 'leads/add', {
      action: '/leads/update',
      edit: true,
      backUrl: `/leads/view/${req.body.id}`,
      lead: req.body,
      errors: errors
    } );

  } else {

    userLeads.update( req.userId, req.body.id, getLeadDetails( req.body ) );
    res.redirect( '/leads' );
  }
}

function confirmDelete( req, res ){

  let lead = mapLeadForSingleView( req.lead );

  res.render( 'leads/confirm-delete', {
    action: '/leads/delete',
    backUrl: `/leads/view/${ lead.id }`,
    lead
  } );
}

function removeLead( req, res ){

  userLeads.remove( req.userId, req.body.leadId );
  redirectToMyLeads( req, res );
}

function getLead( req, res, next ){

  // console.log( 'userId: %s, leadId: %s', req.userId, req.params.leadId );

  const lead = userLeads.getById( req.userId, req.params.leadId );

  // console.log( userLeads.getAll( req.userId ), lead );

  if( lead ){

    req.lead = lead;
    next();

  } else {

    redirectToMyLeads( res, res );
  }
}

function redirectToMyLeads( req, res ){

  res.redirect( '/leads' );
}

router.get( '/', getUserId, index );
router.get( '/add', addLead );
router.post( '/add', getUserId, createLead );
router.get( '/view', redirectToMyLeads );
router.get( '/view/:leadId', getUserId, getLead, viewLead );
router.get( '/edit', redirectToMyLeads );
router.get( '/edit/:leadId', getUserId, getLead, editLead );
router.get( '/update', redirectToMyLeads );
router.post( '/update', getUserId, updateLead );
router.get( '/delete/:leadId', getUserId, getLead, confirmDelete );
router.post( '/delete', getUserId, removeLead );

module.exports = { router };
