/* globals expect: true */
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

      expect(pages).to.not.have.property('previousPage');
      expect(pages.nextPage).to.equal(2);
      expect(pages.startPage).to.equal(1);
      expect(pages.endPage).to.equal(5);

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

      expect(pages.previousPage).to.equal(1);
      expect(pages.nextPage).to.equal(3);
      expect(pages.startPage).to.equal(1);
      expect(pages.endPage).to.equal(5);

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

      expect(pages.previousPage).to.equal(4);
      expect(pages.nextPage).to.equal(6);
      expect(pages.startPage).to.equal(3);
      expect(pages.endPage).to.equal(7);
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

      expect(pages.previousPage).to.equal(12);
      expect(pages.nextPage).to.equal(14);
      expect(pages.startPage).to.equal(10);
      expect(pages.endPage).to.equal(14);
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

      expect(pages).to.not.have.property('previousPage');
      expect(pages.nextPage).to.equal(2);
      expect(pages.startPage).to.equal(1);
      expect(pages.endPage).to.equal(3);
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

      expect(pages.previousPage).to.equal(1);
      expect(pages.nextPage).to.equal(3);
      expect(pages.startPage).to.equal(1);
      expect(pages.endPage).to.equal(3);
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

      expect(pages).to.not.have.property('nextPage');
    });
  });

});
