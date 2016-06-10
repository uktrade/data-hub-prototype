'use strict';

import $ from 'jquery';
import { AddAnother, Edit, RadioHide, SearchBar, SelectionButton, Tabs} from 'govstrap';

$('.js-add-another').each((index, element) => {
  new AddAnother(element);
});

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

$(':radio').each((index,element) => {
  new SelectionButton(element);
});

new Tabs('.js-tabs');
