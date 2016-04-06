const gulp = require('gulp');
const browserSync = require('browser-sync').create('bs-proxy');

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: 'localhost:4567',
    files: 'stylesheets/*.css',
    reloadDelay: 1000,
    open: false
  });
});
