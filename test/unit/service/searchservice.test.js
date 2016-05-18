'use strict';
const assert = require('assert');


describe('Search service', () => {

  var searchService;
  var companiesHouseApi;
  var findCompaniesSpy;

  beforeEach(() => {
    companiesHouseApi = require(`${appFolder}/lib/companieshouseApi`);
    findCompaniesSpy = sinon.spy(companiesHouseApi, 'findCompanies');

    searchService = require(`${appFolder}/service/searchservice`);
    searchService.setCompaniesHouseApi(companiesHouseApi);
  });

  afterEach(() => {
    findCompaniesSpy.restore();
  });

  describe('Search via companies house.', () => {

    afterEach(() => {
      searchService.reset();
    });

    it('should call the companies house API', () => {
      return searchService.search('exsite')
        .then(() => {
          companiesHouseApi.findCompanies.callCount.should.eq(1);
          companiesHouseApi.findCompanies.should.have.been.calledWith('exsite');
        });
    });
    it('should remove companies no longer active', () => {
      return searchService.search('exsite consultants')
        .then((results) => {
          results.length.should.eq(1);
        });
    });
    it('should return good data', () => {
      return searchService.search('exsite consultants')
        .then((results) => {
          results[0].company_number.should.equal('04347846');
        });
    });
    it('should only call CH once', () => {
      return searchService.search('exsite')
        .then(() => {
          companiesHouseApi.findCompanies.callCount.should.eq(1);
          searchService.search('exsite')
            .then(() => {
              companiesHouseApi.findCompanies.callCount.should.eq(1);
            });
        });
    });
  });

  describe('Search using cached data', () => {

    beforeEach(() => {
      return searchService.search('exsite consultants');
    });

    it('should let you search  by name', () => {
      return searchService.search('exsite consultants')
        .then((results) => {
          results[0].company_number.should.equal('04347846');
        });
    });
    it('should let you search by post code', () => {
      return searchService.search('sl4 4qr')
        .then((results) => {
          results.length.should.eq(1);
          results[0].company_number.should.equal('04347846');
        });
    });


  });

});
