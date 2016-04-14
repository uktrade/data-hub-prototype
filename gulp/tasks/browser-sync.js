const gulp = require('gulp');
const browserSync = require('browser-sync').create('bs-proxy');

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: 'localhost:8080',
    files: 'stylesheets/*.css',
    reloadDelay: 1000,
    open: false
  });
});
