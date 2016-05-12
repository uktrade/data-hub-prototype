const gulp = require('gulp');
const paths = require('../paths');

gulp.task('mojular', ['mojular-images', 'mojular-js']);

gulp.task('mojular-images', () => {
  return gulp
    .src('node_modules/mojular-govuk-elements/images/**/*')
    .pipe(gulp.dest(`${paths.output}/images`));
});

gulp.task('mojular-js', () => {
  return gulp
    .src('node_modules/mojular-govuk-elements/modules/**/*')
    .pipe(gulp.dest(`${paths.output}/javascripts`));
});
