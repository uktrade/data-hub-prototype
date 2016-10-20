'use strict';

const leads = require( '../../../app/lib/userLeads' );

let _userId = 0;

function generateUserId(){

  return 'test-user' + _userId++;
}

describe( 'userLeads', function(){

  describe( 'Getting and saving a lead', function(){

    describe( 'When the user is unknown', function(){

      it( 'Returns an empty array', function(){

        expect( leads.get( generateUserId() ) ).toEqual( [] );
      } );
    } );

    describe( 'When a user is known', function(){

      let lead = { name: 'test-user' };

      it( 'Returns the saved leads', function(){

        const userId = generateUserId();

        leads.save( userId, lead );

        const userLeads = leads.get( userId );

        expect( userLeads.length ).toEqual( 1 );
        expect( userLeads[ 0 ].name ).toEqual( lead.name );
      } );

      it( 'Generates an id and date for the lead', function(){

        const userId = generateUserId();

        leads.save( userId, lead );

        const userLeads = leads.get( userId );

        expect( userLeads[ 0 ]._id ).toBeDefined();
        expect( userLeads[ 0 ].date ).toBeDefined();
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
        let userLeads = leads.get( userId );

        expect( userLeads.length ).toEqual( 1 );

        leads.update( userId, oldLead._id, newLead );

        userLeads = leads.get( userId );

        expect( userLeads.length ).toEqual( 1 );
        expect( userLeads[ 0 ][ nameKey ] ).toEqual( nameValue );
      } );
    } );
  } );
} );
