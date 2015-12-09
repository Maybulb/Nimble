var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');

gulp.task('sass', function() {
	return gulp.src('static/css/style.sass')
		.pipe(sass())
		.pipe(gulp.dest('static/css'))
})

gulp.task('coffee', function() {
	return gulp.src('static/js/script.coffee')
		.pipe(coffee())
		.pipe(gulp.dest('static/js'))
});

gulp.task('default', function() {
	gulp.watch(['static/css/style.sass', 'static/js/script.coffee'], ['sass', 'coffee'])
})
