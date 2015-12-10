var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
	return gulp.src('static/css/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('static/css'))
})

gulp.task('compile', ['sass']);

gulp.task('watch', function() {
	gulp.watch('static/css/*.sass', ['sass'])
})
