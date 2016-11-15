const gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('serve', (cb) => {
  var started = false;

	return nodemon({
    verbose: true,
    exec: './node_modules/.bin/babel-node --debug',
		script: 'app.js',
    ignore: ['build/javascripts']
	}).on('start', function() {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true;
		}
  });

});
