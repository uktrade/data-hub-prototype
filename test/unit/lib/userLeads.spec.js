'use strict';

const leads = require( '../../../app/lib/userLeads' );

let _userId = 0;

function generateUserId(){

  return 'test-user' + _userId++;
}

describe( 'userLeads', function(){

  describe( 'Getting and saving all leads', function(){

    describe( 'When the user is unknown', function(){

      it( 'Returns an empty array', function( done ){

        leads.getAll( generateUserId() ).then( ( leadList ) => {

          expect( leadList ).toEqual( [] );
          done();
        } );

      } );
    } );

    describe( 'When a user is known', function(){

      let lead = { name: 'test-user' };

      it( 'Returns the saved leads', function( done ){

        const userId = generateUserId();

        leads.save( userId, lead ).then( () => {

          return leads.getAll( userId );

        } ).then( ( userLeads ) => {

          expect( userLeads.length ).toEqual( 1 );
          expect( userLeads[ 0 ].name ).toEqual( lead.name );
          done();
        } );
      } );

      it( 'Generates an id and date for the lead', function( done ){

        const userId = generateUserId();

        leads.save( userId, lead ).then( () => {

          leads.getAll( userId ).then( ( userLeads ) => {

            expect( userLeads[ 0 ]._id ).toBeDefined();
            expect( userLeads[ 0 ].date ).toBeDefined();
            done();
          } );
        } );
      } );
    } );
  } );

  describe( 'Getting a single lead', function(){

    describe( 'Calling without the required parameters', function(){

      describe( 'Without any params', function(){

        it( 'Throws an error', function(){

          function getLead(){ leads.getById(); };

          expect( getLead ).toThrow( new Error( 'userId is required' ) );
        } );
      } );

      describe( 'Without a leadId', function(){

        it( 'Throws an error', function(){

          function getLead(){ leads.getById( 123 ); };

          expect( getLead ).toThrow( new Error( 'leadId is required' ) );
        } );
      } );
    } );

    describe( 'When the lead exists', function(){

      describe( 'When the leadId type matches', function(){

        it( 'Returns the lead', function( done ){

          const userId = generateUserId();
          let testLead = { firstName: 'testlead', lastName: 'testLeadLast' };
          leads.save( userId, testLead ).then( () => {

            expect( testLead._id ).toBeDefined();

            leads.getById( userId, testLead._id ).then( ( userLead ) => {

              expect( userLead.firstName ).toEqual( testLead.firstName );
              expect( userLead.lastName ).toEqual( testLead.lastName );
              done();
            } );
          } );
        } );
      } );

      describe( 'When the leadId type does not match', function(){

        it( 'Returns the lead', function( done ){

          const userId = generateUserId();
          let testLead = { firstName: 'testlead', lastName: 'testLeadLast' };

          leads.save( userId, testLead ).then( () => {

            expect( testLead._id ).toBeDefined();

            leads.getById( userId, ( testLead._id + '' ) ).then( ( userLead ) => {

              expect( userLead ).not.toEqual( null );
              expect( userLead.firstName ).toEqual( testLead.firstName );
              expect( userLead.lastName ).toEqual( testLead.lastName );
              done();
            } );
          } );
        } );
      } );

    } );

    describe( 'When the lead does not exist', function(){

      it( 'Returns null', function( done ){

        const userId = generateUserId();
        let userLead = leads.getById( userId, 345 ).then( ( userLead ) => {

          expect( userLead ).toEqual( null );
          done();
        } );
      } );
    } );
  } );

  describe( 'Updating a lead', function(){

    describe( 'When the lead doesn\'t exist', function(){

      it( 'Rejects with an error', function( done ){

        const userId = generateUserId();

        leads.update( userId, 'abcxyz', {} ).catch( ( e ) => {

          expect( e ).toEqual( new Error( 'Lead does not exist' ) );
          done();
          } );
      } );
    } );

    describe( 'Deleting a lead', function(){

      describe( 'When the lead exists', function(){

        it( 'Removes the lead', function( done ){

          const userId = generateUserId();
          const nameKey = 'name';
          const nameValue = 'my-test-delete-value';

          let newLead = {};

          newLead[ nameKey ] = nameValue;

          leads.save( userId, newLead ).then( () => {

            return leads.getAll( userId );

          } ).then( ( userLeads ) => {

            expect( userLeads.length ).toEqual( 1 );

            leads.remove( userId, newLead._id ).then( () => {

              expect( userLeads.length ).toEqual( 0 );
              done();
            } );
          } );
        } );
      } );

      describe( 'When the lead does not exist', function(){

        it( 'Does nothing', function( done ){

          const userId = generateUserId();

          leads.getAll( userId ).then( ( userLeads ) => {

            expect( userLeads.length ).toEqual( 0 );

            leads.remove( userId, 1234 ).then( () => {

              expect( userLeads.length ).toEqual( 0 );
              done();
            } );
          } );
        } );
      } );
    } );

    describe( 'When the lead exists', function(){

      describe( 'When the leadId type matches', function(){

        it( 'Updates the lead', function( done ){

          const userId = generateUserId();
          const nameKey = 'name';
          const nameValue = 'my-test-value';

          let oldLead = { name: 'old lead' };
          let newLead = {};

          newLead[ nameKey ] = nameValue;

          leads.save( userId, oldLead ).then( () => {

            return leads.getAll( userId );

          } ).then( ( userLeads ) => {

            expect( userLeads.length ).toEqual( 1 );

            leads.update( userId, oldLead._id, newLead ).then( () => {

              return leads.getAll( userId );

            } ).then( ( userLeads ) => {

              expect( userLeads.length ).toEqual( 1 );
              expect( userLeads[ 0 ][ nameKey ] ).toEqual( nameValue );
              done();
            } );
          } );
        } );
      } );

      describe( 'When the leadId type does not match', function(){

        it( 'Updates the lead', function(){

          const userId = generateUserId();
          const nameKey = 'name';
          const nameValue = 'my-test-value';

          let oldLead = { name: 'old lead' };
          let newLead = {};

          newLead[ nameKey ] = nameValue;

          leads.save( userId, oldLead ).then( () => {

            return leads.getAll( userId );

          } ).then( ( userLeads ) => {

            expect( userLeads.length ).toEqual( 1 );

            leads.update( userId, ( oldLead._id + '' ), newLead ).then( () => {

                return leads.getAll( userId );

            } ).then( ( userLeads ) => {

              expect( userLeads.length ).toEqual( 1 );
              expect( userLeads[ 0 ][ nameKey ] ).toEqual( nameValue );
            } );
          } );
        } );
      } );
    } );
  } );
} );
