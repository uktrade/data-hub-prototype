'use strict';

const chResult = {
  "kind": "search#companies",
  "items_per_page": 20,
  "items": [
    {
      "date_of_creation": "2008-09-24",
      "snippet": "27-31, Fore Street, Ipswich, Suffolk, IP4 1JW",
      "description": "06706657 - Dissolved on 10 February 2015",
      "description_identifier": [
        "dissolved-on"
      ],
      "company_status": "dissolved",
      "matches": {
        "title": [
          1,
          6
        ]
      },
      "date_of_cessation": "2015-02-10",
      "company_type": "ltd",
      "title": "EXSITE LTD",
      "company_number": "06706657",
      "links": {
        "self": "\/company\/06706657"
      },
      "address": {
        "address_line_1": "27-31",
        "address_line_2": "FORE STREET",
        "region": "SUFFOLK",
        "postal_code": "IP4 1JW",
        "locality": "IPSWICH"
      },
      "kind": "searchresults#company"
    },
    {
      "kind": "searchresults#company",
      "links": {
        "self": "\/company\/04347846"
      },
      "address": {
        "address_line_2": "Winkfield",
        "region": "Berkshire",
        "locality": "Windsor",
        "postal_code": "SL4 4QR",
        "address_line_1": "Blackthorn Cottage Chawridge Lane"
      },
      "company_status": "active",
      "matches": {
        "title": [
          1,
          6
        ]
      },
      "company_type": "ltd",
      "company_number": "04347846",
      "title": "EXSITE CONSULTANTS LIMITED",
      "date_of_creation": "2002-01-07",
      "snippet": "Blackthorn Cottage Chawridge Lane, Winkfield, Windsor, Berkshire, SL4 4QR",
      "description": "04347846 - Incorporated on  7 January 2002",
      "description_identifier": [
        "incorporated-on"
      ]
    },
    {
      "kind": "searchresults#company",
      "address": {
        "locality": "STOKE-ON-TRENT",
        "postal_code": "ST6 6XP",
        "address_line_2": "SILVERSTONE CRESCENT",
        "region": "STAFFORDSHIRE",
        "address_line_1": "72"
      },
      "links": {
        "self": "\/company\/08134379"
      },
      "matches": {
        "title": [
          1,
          7
        ]
      },
      "date_of_cessation": "2014-09-16",
      "company_status": "dissolved",
      "title": "EX\/SITE MANAGEMENT SERVICES LIMITED",
      "company_number": "08134379",
      "company_type": "ltd",
      "description": "08134379 - Dissolved on 16 September 2014",
      "snippet": "72, Silverstone Crescent, Stoke-On-Trent, Staffordshire, ST6 6XP",
      "date_of_creation": "2012-07-09",
      "description_identifier": [
        "dissolved-on"
      ]
    },
    {
      "company_status": "active",
      "company_type": "ltd",
      "title": "EXSITELY LIMITED",
      "company_number": "09859100",
      "date_of_creation": "2015-11-05",
      "snippet": "11 Georges Court, Chestergate, Macclesfield, Cheshire, SK11 6DP",
      "description": "09859100 - Incorporated on  5 November 2015",
      "description_identifier": [
        "incorporated-on"
      ],
      "kind": "searchresults#company",
      "links": {
        "self": "\/company\/09859100"
      },
      "address": {
        "postal_code": "SK11 6DP",
        "locality": "MACCLESFIELD",
        "address_line_2": "CHESTERGATE",
        "region": "CHESHIRE",
        "address_line_1": "11 GEORGES COURT"
      }
    }
  ],
  "page_number": 1,
  "start_index": 0,
  "total_results": 4
};

describe('Search service', () => {

  let searchService = require('../../../app/lib/searchservice');
  let findCompaniesSpy;

  beforeEach(() => {
    findCompaniesSpy = sinon.stub(searchService.companiesHouseApi, 'findCompanies', function() {
      return new Promise((resolve) => {
        resolve(chResult);
      });
    });
  });

  afterEach(() => {
    findCompaniesSpy.restore();
    searchService.reset();
  });

  describe('Search via companies house.', () => {

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
      return searchService.search('exsite')
        .then((results) => {
          results.results[0].company_number.should.equal('09859100');
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
      return searchService.search('exsite')
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
      return searchService.search('exsite')
        .then((results) => {
          results.should.have.property('facets');
          results.facets.should.have.property('type');
          results.facets.type.should.have.property('Company');
          results.facets.type.Company.should.be.above(0);
        });
    });
  });

});
