var gulp = require('gulp'),
	sass = require('gulp-sass'),
	packager = require('electron-packager'),
	rimraf = require("gulp-rimraf");

require('shelljs/global');

gulp.task('sass', function() {
	return gulp.src('src/css/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
})

gulp.task('default', ['sass']);

// don't work too good
// gulp.task('produce', ['package', 'build']);

gulp.task('package', function() {7
	var opts = {
		"arch": "x64",
		"dir": "./",
		"platform": "darwin",
		"build-version": "1.2.0",
		"icon": "assets/512.ico",
		"out": "./",
		"version": "0.36.5",
		"prune": true, // prunes development packages off
		"overwrite": true
	}
	gulp.src("./options.json").pipe(rimraf());
	return packager(opts, function done (err, appPath) {
		if (err) throw err;
		console.log("Nimble packaged at " + appPath);
	})
});

gulp.task('build', function() {
	// run this as a script because electron-builder doesn't offer it source
	var script = "./node_modules/.bin/electron-builder Nimble-darwin-x64/Nimble.app/ --platform=osx --out=./Nimble-darwin-x64 --config=config.json";
	exec(script);
});