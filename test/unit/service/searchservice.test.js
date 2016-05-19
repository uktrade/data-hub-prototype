'use strict';

describe('Search service', () => {

  let searchService;

  beforeEach(() => {
    searchService = require(`${appFolder}/service/searchservice`);
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
          results[0].company_number.should.equal('04347846');
          results[0].type.should.eq('COMPANY');
        });
    });
    it('should let you search company by post code', () => {
      return searchService.search('sl4 4qr')
        .then((results) => {
          results.length.should.eq(1);
          results[0].company_number.should.equal('04347846');
          results[0].type.should.eq('COMPANY');
        });
    });
    it('should let you search contact by name', () => {
       return searchService.search('exsite consultants')
         .then((results) => {
           results[0].company_number.should.equal('04347846');
           const contact = results[0].contacts[0];
           searchService.search(`${contact.givenname} ${contact.surname}`)
             .then((results) => {
               results[0].id.should.eq(contact.id);
               results[0].type.should.eq('CONTACT');
             });
         });
    });
    it('should let you search contact by postcode', () => {
      return searchService.search('samsung')
        .then((results) => {
          const contact = results[0].contacts[0];
          searchService.search(`${contact.zipcode}`)
            .then((results) => {
              results[0].id.should.eq(contact.id);
              results[0].zipcode.should.eq(contact.zipcode);
              results[0].type.should.eq('CONTACT');
            });
        })
    });
  });

});
