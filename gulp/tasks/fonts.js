'use strict';

const gulp = require('gulp');
const paths = require('../paths');

// Copy font files and css required to allow IE 8 to render GOVUK fonts
gulp.task('fonts', () => {
  const mustache = `${paths.node_modules}/govuk_template_mustache/assets/stylesheets`;
  gulp.src(`${mustache}/fonts/*`)
    .pipe(gulp.dest(`${paths.outputStyles}/fonts`));

  return gulp.src(`${mustache}/fonts-ie8.css`)
    .pipe(gulp.dest(`${paths.outputStyles}/stylesheets`));
});
