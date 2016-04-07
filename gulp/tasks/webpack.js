const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const browserSync = require('browser-sync').get('bs-proxy');
const paths = require('../paths');

gulp.task('webpack', done => {
  return webpack(require(paths.webpackConfig)).run((err, stats) => {
    if (err) { throw new gutil.PluginError('webpack', err) }

    gutil.log('[webpack]', stats.toString({
      colors: true,
      chunks: false
    }));

    browserSync.reload();
    return done();
  });
});
