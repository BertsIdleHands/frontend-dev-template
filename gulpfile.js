const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const sass = require('gulp-sass');
const watchify = require('watchify');
const browserSync = require('browser-sync').create();

gulp.task('styles', function () {
  return gulp.src(['./frontend-src/sass/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./public/css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('javascript', function () {
  return watchify(browserify('./frontend-src/js/main.js', { debug: true }))
      .transform(babelify, { presets: ['es2015'] })
      .bundle()
      .on('error', function (err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/js'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['styles', 'javascript']);

gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });

  gulp.watch('./frontend-src/js/**/*.js', ['javascript']);
  gulp.watch('./frontend-src/sass/**/*.scss', ['styles']);
  gulp.watch('**/*.html').on('change', browserSync.reload);
  gulp.watch(['**/*.css']).on('change', function (file) {
    browserSync.reload(file.path);
  });
});
