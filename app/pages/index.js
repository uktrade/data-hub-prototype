'use strict';

import 'babel-polyfill';
import SearchBar from '../controls/searchbar';
import FlashMessage from '../controls/flash-message';
import ClippedList from '../controls/clipped-list';

new SearchBar(document.querySelector('.searchbar'));
new ClippedList( document.getElementById( 'interactions-list' ), 'See all new interactions', 'See less interactions' );
new ClippedList( document.getElementById( 'contacts-list' ), 'See all new contacts', 'See less contacts' );

FlashMessage.activateAll();
