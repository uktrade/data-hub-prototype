const gulp = require('gulp');
const paths = require('../paths');

gulp.task('watch', () => {
  gulp.watch(`${paths.sourceJS}/**/*.js`, ['webpack']);
  gulp.watch(`${paths.sourceStyles}/**/*.scss`, ['css']);
});
