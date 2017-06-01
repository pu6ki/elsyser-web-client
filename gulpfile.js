let gulp = require('gulp');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let minify = require('gulp-minify');
let minifyCss = require('gulp-minify-css');
let minifyHtml = require('gulp-htmlmin');

gulp.task('js', function() {
  return gulp.src([
    'controllers/*.js',
    'utils/*.js',
    'utils/configs/*.js',
  ])
  .pipe(minify())
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('build/js'))  
  .pipe(rename('scripts.min.js'))
  .pipe(gulp.dest('build/js'))
})

