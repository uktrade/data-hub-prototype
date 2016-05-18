'use strict';

const gulp = require('gulp');
const paths = require('../paths');

// Copy images govuk
gulp.task('images', () => {
  return gulp.src(`${paths.node_modules}/govuk_frontend_toolkit/images/**/*`)
    .pipe(gulp.dest(paths.outputImages));
});
