'use strict';

const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('build', (done) => {
  gulpSequence('clean', 'css', 'webpack', done);
});
