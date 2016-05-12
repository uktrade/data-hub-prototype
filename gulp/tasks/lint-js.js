'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');

// Check javascript source to confirm it has no obvious errors and follows
// UKTI rules for style and syntax
gulp.task('lint-js', () => {
  return gulp.src(['./**/*.js', '!node_modules/**', '!build/**', '!data/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
