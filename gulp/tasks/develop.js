const gulp = require('gulp');

gulp.task('develop', ['build', 'serve', 'browser-sync', 'watch']);
