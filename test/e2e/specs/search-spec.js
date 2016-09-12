/* globals describe: true, it: true, expect: true, beforeEach: true, browser: true  */

const search = require('../steps/searchsteps');

describe('Datahub search test', function() {

  beforeEach(() => {
    browser.ignoreSynchronization = true;
  });

  it('should show results when you search for a company name', () => {
    search.searchFor('corporate');
    expect(search.resultCount()).toEqual(10);
  });
});
