var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');

var uglify = require('gulp-uglify');
var gulpIf= require('gulp-if');
var minifyCss = require('gulp-clean-css');

var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del =require('del');
var runSequence = require('run-sequence');


// fetches and converts single scss file
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

// Gulp Watch syntax
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

//browser Sync
gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref()) // concatenates all the file , in this oly js files
    //Minifies only if its a javascript files
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', minifyCss()))
    .pipe(gulp.dest('dist'))
})

//move other css files
gulp.task('movecss', function(){
  return gulp.src('app/css/otherCss/*.css')
    .pipe(gulp.dest('dist/css/otherCss'))
})

//move other js files
gulp.task('movejs', function(){
  return gulp.src('app/js/otherJs/*.js')
    .pipe(gulp.dest('dist/js/otherJs'))
})

//optimizing Images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      //setting inerlaced to true
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

//copying fonts to dist
gulp.task('fonts', function(){
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//cleaning up files
gulp.task('clean:dist',function(){
  return del.sync('dist')
})

gulp.task('cashe:clear', function(callback){
  return cache.clearAll(callback)
})

gulp.task('build', function(callback){
  runSequence('clean:dist',['sass', 'useref', 'images', 'movecss', 'movejs', 'fonts'],callback)
})

gulp.task('default', function(callback){
  runSequence(['sass', 'browserSync', 'watch'], callback)
})
