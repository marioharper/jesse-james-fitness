var gulp     	= require('gulp'),
	deploy      = require('gulp-gh-pages'),
	sass        = require('gulp-sass'),
	clean       = require('gulp-clean'),
	browserSync	= require('browser-sync').create(),
	runSequence = require('run-sequence'),
  concat      = require('gulp-concat'),
  merge       = require('merge-stream');

var paths = {
	html: [
		"src/**/*.html",
		"src/CNAME"
	],
	sass: [
		"src/assets/sass/**/*.scss"
	],
  img: [
    "src/assets/img/**/*.{ico,png,jpg}"
  ],
  js:[
    "src/assets/js/**/*.js",
    "node_modules/instafeed.js/instafeed.js"
  ]
}

gulp.task('html', function(){
	return gulp.src(paths.html)
		.pipe(gulp.dest("build"));
});

gulp.task('img', function(){
  return gulp.src(paths.img)
    .pipe(gulp.dest("build/assets/img"));
});

gulp.task('js', function(){
  return gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest("build/assets/js"));
});

gulp.task('style', function() {
  return gulp.src(paths.sass)
    .pipe(sass(
    	{
    		outputStyle: 'compressed'
		}).on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function(){
  gulp.watch(paths.js, ['js']).on('change', browserSync.reload);
  gulp.watch(paths.sass, ['style']).on('change', browserSync.reload);
  gulp.watch(paths.html, ['html']).on('change', browserSync.reload);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "build",
    },
    port: 5000
  });
});

// Clean build folder
gulp.task('clean', function(){
	return gulp.src('build', {read: false}).pipe(clean());
});

gulp.task('serve', function(callback) {
  runSequence('clean',
              ['style', 'js', 'img', 'html'],
              'watch',
              'browser-sync',
              callback);
});

gulp.task('deploy', function () {
  return gulp.src("./build/**/*")
    .pipe(deploy());
});

gulp.task('default', ['serve']);