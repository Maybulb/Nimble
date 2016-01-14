var gulp = require('gulp'),
		sass = require('gulp-sass');

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
