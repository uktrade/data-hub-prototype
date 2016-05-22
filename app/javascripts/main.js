'use strict';
import Mojular from './mojular';

Mojular
  .use([
    require('./modules/tabs'),
    require('./modules/edit'),
    require('./modules/addanother'),
    require('./modules/searchbar'),
    require('./modules/selectionbuttons'),
    require('./modules/radiohide')
  ])
  .init();
