'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');

const paths = require('../paths');

gulp.task('webpack', done => {
  webpack(require(paths.webpackConfig)).run((err, stats) => {
    if (err) { throw new gutil.PluginError('webpack', err); }

    gutil.log('[webpack]', stats.toString({
      colors: true,
      chunks: false
    }));
    done();
  });
});
