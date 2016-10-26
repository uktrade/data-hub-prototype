'use strict';

import $ from 'jquery';
import RadioHide from './radiohide';
import Edit from './edit';
import SearchBar from './searchbar';
import SelectionButton from './selectionbutton';
import Tabs from './tabs';
import Autocomplete from './autocomplete';
import FlashMessage from './flash-message.js';


$('.js-hidden-edit').each((index, element) => {
  new Edit(element);
});

$('.js-radiohide').each((index, element) => {
  new RadioHide(element);
});

new SearchBar('js-searchbar');
$('.searchbar').each((index, element) => {
  new SearchBar(element);
});

$(':radio').each((index, element) => {
  new SelectionButton(element);
});

new Tabs('.js-tabs');

$('.js-autocomplete').each((index, element) => {
  new Autocomplete(element);
});

$( '.flash-message' ).each( ( i, element ) => {
  new FlashMessage( element );
} );
