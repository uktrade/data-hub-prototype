const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');

gulp.task('build', gulpSequence(['clean'], 'css', 'webpack', 'mojular'));
