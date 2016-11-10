'use strict';

import 'babel-polyfill';
import SearchBar from '../controls/searchbar';
import FlashMessage from '../controls/flash-message';

new SearchBar(document.querySelector('.searchbar'));

FlashMessage.activateAll();
