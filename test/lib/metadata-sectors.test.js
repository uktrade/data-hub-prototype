/* globals expect: true, describe: true, it: true */
'use strict';

const transformSectors = require( '../../src/lib/metadata-sectors' );
const input = require( '../data/sector-list_input' );
const output = require( '../data/sector-list_output' );


describe( 'Metadata sectors transformer', () => {
  describe( 'Splitting the response by sector', () => {
    it( 'Should handle with subsectors an without', () =>{
      const myoutput = transformSectors(input);
      expect(myoutput).to.eql(output);
    });
  });
});
