/* eslint no-console: 0, no-unused-expressions: 0 */

'use strict';
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

const protractor = plugins.protractor.protractor;
const webdriver_standalone = plugins.protractor.webdriver_standalone;
const webdriver_update = plugins.protractor.webdriver_update;

gulp.task('webdriver_update', webdriver_update);
gulp.task('webdriver_standalone', webdriver_standalone);


gulp.task('protractor:e2e', ['webdriver_update'], () => gulp
  .src(['example_spec.js'])
  .pipe(protractor({
    'configFile': 'test/e2e/conf.js',
    'debug': false,
    'autoStartStopServer': true
  })).on('error', function(e) {
    console.log(e);
  }).on('end', (callback) => {
    callback;
  })
);
