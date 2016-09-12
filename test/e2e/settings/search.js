/* globals element: true, by: true */

module.exports = {
  searchBox: element(by.css('#search-term')),
  searchButton: element(by.css('.searchbar__submit')),
  searchResults: element.all(by.css('.results-list__result'))
};
