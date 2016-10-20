'use strict';

const leads = require( '../../../app/lib/userLeads' );

let _userId = 0;

function generateUserId(){

  return 'test-user' + _userId++;
}

describe( 'userLeads', function(){

  describe( 'Getting and saving all leads', function(){

    describe( 'When the user is unknown', function(){

      it( 'Returns an empty array', function(){

        expect( leads.getAll( generateUserId() ) ).toEqual( [] );
      } );
    } );

    describe( 'When a user is known', function(){

      let lead = { name: 'test-user' };

      it( 'Returns the saved leads', function(){

        const userId = generateUserId();

        leads.save( userId, lead );

        const userLeads = leads.getAll( userId );

        expect( userLeads.length ).toEqual( 1 );
        expect( userLeads[ 0 ].name ).toEqual( lead.name );
      } );

      it( 'Generates an id and date for the lead', function(){

        const userId = generateUserId();

        leads.save( userId, lead );

        const userLeads = leads.getAll( userId );

        expect( userLeads[ 0 ]._id ).toBeDefined();
        expect( userLeads[ 0 ].date ).toBeDefined();
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

        it( 'Returns the lead', function(){

          const userId = generateUserId();
          let testLead = { firstName: 'testlead', lastName: 'testLeadLast' };
          leads.save( userId, testLead );

          expect( testLead._id ).toBeDefined();

          let userLead = leads.getById( userId, testLead._id );

          expect( userLead.firstName ).toEqual( testLead.firstName );
          expect( userLead.lastName ).toEqual( testLead.lastName );
        } );
      } );

      describe( 'When the leadId type does not match', function(){

        it( 'Returns the lead', function(){

          const userId = generateUserId();
          let testLead = { firstName: 'testlead', lastName: 'testLeadLast' };
          leads.save( userId, testLead );

          expect( testLead._id ).toBeDefined();

          let userLead = leads.getById( userId, ( testLead._id + '' ) );

          expect( userLead ).not.toEqual( null );
          expect( userLead.firstName ).toEqual( testLead.firstName );
          expect( userLead.lastName ).toEqual( testLead.lastName );
        } );
      } );

    } );

    describe( 'When the lead does not exist', function(){

      it( 'Returns null', function(){

        const userId = generateUserId();
        let userLead = leads.getById( userId, 345 );

        expect( userLead ).toEqual( null );
      } );
    } );
  } );

  describe( 'Updating a lead', function(){

    describe( 'When the lead doesn\'t exist', function(){

      it( 'Throws an error', function(){

        const userId = generateUserId();

        function updateNonExistentLead(){

          leads.update( userId, 'abcxyz', {} );
        }

        expect( updateNonExistentLead ).toThrow( new Error( 'Lead does not exist' ) );
      } );
    } );

    describe( 'When the lead exists', function(){

      it( 'Updates the lead', function(){

        const userId = generateUserId();
        const nameKey = 'name';
        const nameValue = 'my-test-value';

        let oldLead = { name: 'old lead' };
        let newLead = {};

        newLead[ nameKey ] = nameValue;

        leads.save( userId, oldLead );
        let userLeads = leads.getAll( userId );

        expect( userLeads.length ).toEqual( 1 );

        leads.update( userId, oldLead._id, newLead );

        userLeads = leads.getAll( userId );

        expect( userLeads.length ).toEqual( 1 );
        expect( userLeads[ 0 ][ nameKey ] ).toEqual( nameValue );
      } );
    } );
  } );
} );
