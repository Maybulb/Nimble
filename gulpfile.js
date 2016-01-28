var gulp = require('gulp'),
		sass = require('gulp-sass'),
		packager = require('electron-packager');
require('shelljs/global');

gulp.task('sass', function() {
	return gulp.src('src/css/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
})

gulp.task('compile', ['sass']);

gulp.task('watch', function() {
	gulp.watch('src/css/*.sass', ['sass'])
})

gulp.task('default', ['compile']);

gulp.task('package', function() {
	var opts = {
		"arch": "x64",
		"dir": "./",
		"platform": "darwin",
		"build-version": "1.0.0",
		"icon": "assets/512.ico",
		"out": "./",
		"version": "0.36.5",
	}
	packager(opts, function done (err, appPath) {
		if (err) throw err;
		console.log("Nimble packaged at " + appPath);
	})
});

gulp.task('build', function() {
	// run this as a script because electron-builder doesn't offer it any other way
	var script = "electron-builder Nimble-darwin-x64/Nimble.app/ --platform=osx --out=./Nimble-darwin-x64 --config=config.json";
	exec(script);
});
