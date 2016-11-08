'use strict';

import 'babel-polyfill';
import FlashMessage from '../controls/flash-message';

const flashes = document.querySelectorAll('.flash-message' );

for (let pos = flashes.length; pos; pos -= 1) {
  new FlashMessage( flashes[pos] );
}
