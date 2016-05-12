'use strict';

const gulp = require('gulp');
const sassLint = require('gulp-sass-lint');
const paths = require('../paths');

// Check SASS source to confirm it has no errors and follows
// UKTI rules for style and syntax
gulp.task('lint-css', () => {
  return gulp.src(`${paths.sourceStyles}/**/*.s+(a|c)ss`)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});
