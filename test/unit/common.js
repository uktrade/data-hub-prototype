'use strict';

global.chai = require('chai').use(require('sinon-chai')).use(require('chai-as-promised'));
global.should = chai.should();
global.sinon = require('sinon');
require('sinomocha')();
global.appFolder = process.cwd() + '/app';

process.setMaxListeners(0);
process.stdout.setMaxListeners(0);
