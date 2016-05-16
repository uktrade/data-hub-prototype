'use strict';

var $ = require('jquery');
var forOwn = require('lodash/object/forOwn');
var isArray = require('lodash/lang/isArray');
var isPlainObject = require('lodash/lang/isPlainObject');
var extend = require('lodash/object/extend');
var transform = require('lodash/object/transform');

module.exports = {
  Modules: {},
  Helpers: {},
  Events: $({}),

  init: function() {
    var self = this;
    forOwn(this.Modules, function(module) {
      if (typeof module.init === 'function') {
        module.base = self;
        module.init();
      }
    });
    // trigger initial render event
    this.Events.trigger('render');
  },

  use: function(modules) {
    if (isArray(modules)) {
      transform(modules, extend, this.Modules);
    } else if(isPlainObject(modules)) {
      extend(this.Modules, modules);
    } else {
      throw('Pass either single module or an array of modules.\ne.g. `.use(require(\'./modules/some-module\')`');
    }
    return this;
  }
};
