const gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('serve', ['build'], (cb) => {
  var started = false;

	return nodemon({
		script: 'app.js',
    ignore: './javascripts',
	}).on('start', function() {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true;
		}
  });

});
