'use strict';

global.chai = require('chai').use(require('sinon-chai')).use(require('chai-as-promised'));
global.expect = chai.expect;
global.sinon = require('sinon');
global.appFolder = process.cwd() + '/app';

process.setMaxListeners(0);
process.stdout.setMaxListeners(0);
