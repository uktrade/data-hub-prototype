'use strict';

describe('Search service', () => {

  let searchService;

  beforeEach(() => {
    searchService = require(`${appFolder}/lib/searchservice`);
  });

  describe('Search via companies house.', () => {

    let findCompaniesSpy;

    beforeEach(()=> {
      findCompaniesSpy = sinon.spy(searchService.companiesHouseApi, 'findCompanies');
    });

    afterEach(() => {
      findCompaniesSpy.restore();
      searchService.reset();
    });

    it('should call the companies house API', () => {
      return searchService.search('exsite')
        .then(() => {
          findCompaniesSpy.callCount.should.eq(1);
          findCompaniesSpy.should.have.been.calledWith('exsite');
        });
    });
    it('should remove companies no longer active', () => {
      return searchService.search('exsite consultants')
        .then((results) => {
          results.results.length.should.eq(1);
        });
    });
    it('should return good data', () => {
      return searchService.search('exsite consultants')
        .then((results) => {
          results.results[0].company_number.should.equal('04347846');
        });
    });
    it('should only call CH once', () => {
      return searchService.search('exsite')
        .then(() => {
          findCompaniesSpy.callCount.should.eq(1);
          searchService.search('exsite')
            .then(() => {
              findCompaniesSpy.callCount.should.eq(1);
            });
        });
    });
  });

  describe('Search using cached data', () => {

    beforeEach(() => {
      return searchService.search('exsite consultants');
    });

    it('should let you search by company name', () => {
      return searchService.search('exsite consultants')
        .then((results) => {
          results.results[0].company_number.should.equal('04347846');
          results.results[0].type.should.eq('Company');
        });
    });
    it('should let you search company by post code', () => {
      return searchService.search('sl4 4qr')
        .then((results) => {
          results.results.length.should.eq(1);
          results.results[0].company_number.should.equal('04347846');
          results.results[0].type.should.eq('Company');
        });
    });
    it('should let you search contact by name', () => {
       return searchService.search('exsite consultants')
         .then((firstResults) => {
           firstResults.results[0].company_number.should.equal('04347846');
           const contact = firstResults.results[0].contacts[0];
           searchService.search(`${contact.givenname} ${contact.surname}`)
             .then((secondResults) => {
               secondResults.results[0].id.should.eq(contact.id);
               secondResults.results[0].type.should.eq('Contact');
             });
         });
    });
    it('should let you search contact by postcode', () => {
      return searchService.search('samsung')
        .then((firstResults) => {
          const contact = firstResults.results[0].contacts[0];
          searchService.search(`${contact.zipcode}`)
            .then((secondResults) => {
              secondResults.results[0].id.should.eq(contact.id);
              secondResults.results[0].zipcode.should.eq(contact.zipcode);
              secondResults.results[0].type.should.eq('Contact');
            });
        });
    });
  });

  describe('Facets', () => {
    it('should calculate facets for type of results', () => {
      return searchService.search('samsung')
        .then((results) => {
          results.should.have.property('facets');
          results.facets.should.have.property('type');
          results.facets.type.should.have.property('Company');
          results.facets.type.Company.should.be.above(0);
        });
    });
  });

});
