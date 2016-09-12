var gulp = require('gulp');
var bower = require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var runSeq = require('run-sequence');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

gulp.task('bower', function() {
  var jsFilter = filter('**/*.js', { restore: true });
  var cssFilter = filter('**/*.css');

  return gulp.src(bower())
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('copy', function() {
  return gulp.src('lib/templates/**/*')
    .pipe(gulp.dest('public/templates'));
});

gulp.task('concat', function() {
  return gulp.src(['lib/**/app.js', 'lib/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('minify', function() {
  var jsFilter = filter('**/*.js', { restore: true });
  var cssFilter = filter('**/*.css');

  return gulp.src(['public/js/**/*', 'public/css/**/*'])
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cleancss())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass', function() {
  return gulp.src('lib/scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'));
});

gulp.task('replace:prod', function() {
  return gulp.src('public/index.html')
    .pipe(replace(/app\.css/, 'app.min.css'))
    .pipe(replace(/app\.js/, 'app.min.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('replace:dev', function() {
  return gulp.src('public/index.html')
    .pipe(replace(/app\.min\.css/, 'app.css'))
    .pipe(replace(/app\.min\.js/, 'app.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('default', function() {
  livereload.listen();

  runSeq('bower', ['sass', 'concat', 'copy'], 'replace:dev');

  gulp.watch('lib/templates/**/*', ['copy']);

  gulp.watch(['lib/js/**/*', 'lib/scss/**/*', 'public/index.html'], function() {
    runSeq(['concat', 'sass'], function() {
      livereload.reload('public/index.html');
    });
  });

  gulp.watch('bower.json', function() {
    runSeq('bower', function() {
      livereload.reload('public/index.html');
    });
  });
});

gulp.task('build', function() {
  runSeq('bower', ['sass', 'concat'], 'minify', 'replace:prod')
});