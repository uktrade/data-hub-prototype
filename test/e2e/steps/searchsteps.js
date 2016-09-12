/* globals browser: true, browser: true  */

const settings = require('../settings/settings');
const search = require('../settings/search');

function searchFor(term) {
  browser.get(settings.navigate.home);

  search.searchBox.click()
    .clear()
    .sendKeys(term);

  search.searchButton.click();

  browser.driver.sleep(1000);
}

function resultCount() {
  return search.searchResults.count();
}

module.exports = { searchFor, resultCount };
