var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('compile', function() {
	return gulp.src([
			'scripts/map.js',
			'scripts/mappoint.js',
			'scripts/playerposition.js',
			'scripts/player.js',
			'scripts/shape.js',
			'scripts/camppoint.js',
			'scripts/syncpoint.js',
			'scripts/waitpoint.js',
			'scripts/waypoint.js',
			'scripts/shapefactory.js',
			'scripts/tactics.js'
		])
        .pipe(babel())
        .pipe(uglify())
    	.pipe(concat('app.js'))
        .pipe(gulp.dest('dist'));
})

gulp.task('default', ['compile']);

gulp.task('watch', ['compile']);

gulp.watch('scripts/**/*.js', ['compile'])