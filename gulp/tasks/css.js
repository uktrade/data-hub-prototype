'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const paths = require('../paths');

const SASS_PATHS = [
  `${paths.node_modules}/govuk-elements-sass/public/sass`,
  `${paths.node_modules}/govuk_frontend_toolkit/stylesheets`,
  `${paths.node_modules}/govuk_template_jinja/assets/stylesheets`
];

function buildDevelopmentStyles() {
  const sourcemaps = require('gulp-sourcemaps');
  gulp.src(`${paths.sourceStyles}/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: SASS_PATHS
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'IE 9']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${paths.outputStyles}`));
}

function buildProductionStyles() {
  gulp.src(`${paths.sourceStyles}/*.scss`)
    .pipe(sass({
      includePaths: SASS_PATHS,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'IE 9']
    }))
    .pipe(gulp.dest(`${paths.outputStyles}`));
}

gulp.task('css', (done) => {
  if (process.env.NODE_ENV === 'production') {
    buildProductionStyles();
  }
  buildDevelopmentStyles();
  done();
});
