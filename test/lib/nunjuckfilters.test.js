/* globals expect: true, describe: true, it: true */
'use strict';

const nunjuckfilters = require('../../src/lib/nunjuckfilters');

describe('Filters', () => {
  describe('Highlight term', () => {
    it('Should highlight a simple term in a phrase', () => {
      const result = nunjuckfilters.highlightTerm('White rabbit, red strawberry', 'rabbit');
      expect(result).to.equal('White <strong>rabbit</strong>, red strawberry');
    });
    it('Should ignore case when highlighting but preserve original phrase case', () => {
      const resultA = nunjuckfilters.highlightTerm('White rabbit, red strawberry', 'Rabbit');
      expect(resultA).to.equal('White <strong>rabbit</strong>, red strawberry');
      const resultB = nunjuckfilters.highlightTerm('White Rabbit, red strawberry', 'rabbit');
      expect(resultB).to.equal('White <strong>Rabbit</strong>, red strawberry');
    });
    it('Should highlight a term with * in it', () => {
      const result = nunjuckfilters.highlightTerm('White rabbit, red strawberry', '*rabbit');
      expect(result).to.equal('White <strong>rabbit</strong>, red strawberry');
    });
    it('Should highlight a term with \\ in it', () => {
      const result = nunjuckfilters.highlightTerm('White \\rabbit, red strawberry', '\\rabbit');
      expect(result).to.equal('White <strong>\\rabbit</strong>, red strawberry');
    });
    it('Should highlight a term with a special character in it', () => {
      const result = nunjuckfilters.highlightTerm("Est-ce que vous pouvez l'écrire", "l'écrire");
      expect(result).to.equal("Est-ce que vous pouvez <strong>l'écrire</strong>");
    });
    it('Should work fine if sent an empty term', () => {
      const result = nunjuckfilters.highlightTerm('White rabbit, red strawberry', '');
      expect(result).to.equal('White rabbit, red strawberry');
    });
    it('Should work fine if sent an empty phrase', () => {
      const result = nunjuckfilters.highlightTerm('', 'Strawberry');
      expect(result).to.equal('');
    });
    it('should handle null term', () => {
      const result = nunjuckfilters.highlightTerm('White rabbit, red strawberry');
      expect(result).to.equal('White rabbit, red strawberry');
    });
    it('should handle null phrase', () => {
      const result = nunjuckfilters.highlightTerm(null, 'Strawberry');
      expect(result).to.equal('');
    });
  });
});
