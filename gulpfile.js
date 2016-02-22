//load plugins
var gulp             = require('gulp'),
	compass          = require('gulp-compass'),
	autoprefixer     = require('gulp-autoprefixer'),
	minifycss        = require('gulp-minify-css'),
	uglify           = require('gulp-uglify'),
	rename           = require('gulp-rename'),
	concat           = require('gulp-concat'),
	notify           = require('gulp-notify'),
	plumber          = require('gulp-plumber'),
	path             = require('path'),
	sourcemaps 	     = require('gulp-sourcemaps'),
	source 			 = require('vinyl-source-stream'),
	buffer 			 = require('vinyl-buffer'),
	browserify 		 = require('browserify'),
	watchify 		 = require('watchify'),
	babel 			 = require('babelify');

var browserSync = require('browser-sync').create();

//styles
gulp.task('styles', function() {
	return gulp.src(['./frontend-src/sass/**/*.scss'])
		.pipe(plumber())
		.pipe(compass({
			css: 'public/css',
			sass: 'frontend-src/sass',
			image: 'public/img'
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('public/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.stream());
});

//javascript
function compile(watch) {
	var bundler = watchify(browserify('./frontend-src/js/main.js', { debug: true }).transform(babel));
	bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js'))
      .pipe(browserSync.stream());
}

gulp.task('javascript', function() { return compile(); });
gulp.task('default', ['styles','javascript']);

gulp.task('watch', function() {
	browserSync.init({
        server: {
            baseDir: "./public"
        }
  	});

  	gulp.watch('./frontend-src/js/**/*.js', ['javascript']);
  	gulp.watch('./frontend-src/sass/**/*.scss', ['styles']);
  	gulp.watch('**/*.html').on('change', browserSync.reload);
  	gulp.watch(['**/*.css']).on("change", function(file) {
        browserSync.reload(file.path);
    });
});
