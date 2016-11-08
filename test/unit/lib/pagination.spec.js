'use strict';

const pagination = require('../../../app/lib/pagination');

describe('Pagination', () => {

  describe('Start and end index', () => {
    it('should show 1..5 when on the first page of many', () => {
      const req = {
        query: {
          page: '1'
        }
      };

      const result = {
        total: 1000
      };

      const pages = pagination.getPageIndexes(req, result);

      pages.should.not.have.property('previousPage');
      pages.nextPage.should.eq(2);
      pages.startPage.should.eq(1);
      pages.endPage.should.eq(5);

    });
    it('should show 1..5 when on the second page of many', () => {
      const req = {
        query: {
          page: '2'
        }
      };

      const result = {
        total: 1000
      };

      const pages = pagination.getPageIndexes(req, result);

      pages.previousPage.should.eq(1);
      pages.nextPage.should.eq(3);
      pages.startPage.should.eq(1);
      pages.endPage.should.eq(5);

    });
    it('should show 3..7 when on the fifth page of many', () => {
      const req = {
        query: {
          page: '5'
        }
      };

      const result = {
        total: 1000
      };

      const pages = pagination.getPageIndexes(req, result);

      pages.previousPage.should.eq(4);
      pages.nextPage.should.eq(6);
      pages.startPage.should.eq(3);
      pages.endPage.should.eq(7);
    });
    it('should show 10..14 when on page 13 of 14', () => {
      const req = {
        query: {
          page: '13'
        }
      };

      const result = {
        total: 140
      };

      const pages = pagination.getPageIndexes(req, result);

      pages.previousPage.should.eq(12);
      pages.nextPage.should.eq(14);
      pages.startPage.should.eq(10);
      pages.endPage.should.eq(14);
    });
    it('should show 1..3 when on the first page of 25 results', () => {
      const req = {
        query: {
          page: '1'
        }
      };

      const result = {
        total: 25
      };

      const pages = pagination.getPageIndexes(req, result);

      pages.should.not.have.property('previousPage');
      pages.nextPage.should.eq(2);
      pages.startPage.should.eq(1);
      pages.endPage.should.eq(3);
    });
    it('should show 1..3 when on the second page of 25 results', () => {
      const req = {
        query: {
          page: '2'
        }
      };

      const result = {
        total: 25
      };

      const pages = pagination.getPageIndexes(req, result);

      pages.previousPage.should.eq(1);
      pages.nextPage.should.eq(3);
      pages.startPage.should.eq(1);
      pages.endPage.should.eq(3);
    });
    it('should not have a next link when on the last page', () => {
      const req = {
        query: {
          page: '3'
        }
      };

      const result = {
        total: 25
      };

      const pages = pagination.getPageIndexes(req, result);

      pages.should.not.have.property('nextPage');
    });
  });

});
