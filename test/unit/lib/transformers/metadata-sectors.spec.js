const transformSectors = require( '../../../../app/lib/transformers/metadataRepository-sectors' );

const input = require( '../../data/sector-list_input' );
const output = require( '../../data/sector-list_output' );


describe( 'Metadata sectors transformer', function(){

  describe( 'Splitting the response by sector', function(){

    it( 'Should handle with subsectors an without', function(){

      const myoutput = transformSectors( input );

      expect( myoutput ).toEqual( output );
    } );
  } );
} );
