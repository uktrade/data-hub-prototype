const gulp = require('gulp');
const browserSync = require('browser-sync').get('bs-proxy');
const paths = require('../paths');

gulp.task('watch', () => {
  gulp.watch(`${paths.sourceJS}/**/*.js`, ['webpack']);
  gulp.watch(`${paths.sourceStyles}/**/*.scss`, ['css']);
  gulp.watch('source/*.html*').on('change', browserSync.reload);
});
