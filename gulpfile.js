var gulp     	= require('gulp'),
	deploy      = require('gulp-gh-pages'),
	sass        = require('gulp-sass'),
	clean       = require('gulp-clean'),
	browserSync	= require('browser-sync').create(),
	runSequence = require('run-sequence'),
  concat      = require('gulp-concat'),
  merge       = require('merge-stream')
  nunjucksRender    = require('gulp-nunjucks-render');

var paths = {
	html: [
		"src/**/*.html",
    "!src/partials/**/*.html"
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

gulp.task('nunjucks', function () { 
  return gulp.src(paths.html) 
    .pipe(nunjucksRender({
      path: ['src']
      })) 
    .pipe(gulp.dest('dist'));
});

gulp.task('img', function(){
  return gulp.src(paths.img)
    .pipe(gulp.dest("dist/assets/img"));
});

gulp.task('js', function(){
  return gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest("dist/assets/js"));
});

gulp.task('style', function() {
  return gulp.src(paths.sass)
    .pipe(sass(
    	{
    		outputStyle: 'compressed'
		}).on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function(){
  gulp.watch(paths.js, ['js']).on('change', browserSync.reload);
  gulp.watch(paths.sass, ['style']).on('change', browserSync.reload);
  gulp.watch(paths.html, ['nunjucks']).on('change', browserSync.reload);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    port: 5000
  });
});

// Clean build folder
gulp.task('clean', function(){
	return gulp.src('dist', {read: false}).pipe(clean());
});

gulp.task('serve', function(callback) {
  return runSequence('clean',
              ['style', 'js', 'img', 'nunjucks'],
              'watch',
              'browser-sync',
              callback);
});

/*copy over CNAME file and deploy build folder*/
gulp.task('build', function () {
  return gulp.src('src/CNAME')
    .pipe(gulp.dest("dist"));
});