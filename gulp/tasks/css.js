const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').get('bs-proxy');
const paths = require('../paths');

const SASS_PATHS = require('mojular-govuk-elements/package.json').sassPaths;

gulp.task('css', () => {
  return gulp.src(`${paths.sourceStyles}/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: SASS_PATHS
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'IE 9']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.outputStyles}`))
    .pipe(browserSync.stream({match: '**/*.css'}));
});
