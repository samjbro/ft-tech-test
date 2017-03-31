var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var obt = require('origami-build-tools');

var paths = {
  htmlSrc: 'src/views/',
  jsSrc: 'src/js/',
  sassSrc: 'src/styles',
  buildDir: 'build/'
};

gulp.task('default', ['browser-sync', 'build', 'watch']);

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    port: 7000,
    ghostMode: {
      clicks: true,
      location: true,
      forms: true,
      scroll: false
    }
  });
});

gulp.task('nodemon', function(cb) {
  var started = false;
  return nodemon({
    script: 'server.js'
  }).on('start', function() {
    if(!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('build', ['build-origami', 'build-html']);

gulp.task('build-origami', function() {
  return obt.build(gulp, {
    js: paths.jsSrc + '**/*.js',
    sass: paths.sassSrc + '**/*.scss',
    buildJS: 'bundle.js',
    buildCss: 'bundle.scss',
    buildFolder: 'build/'
  });
});
gulp.task('build-html', function() {
  console.log('building html');
  return gulp.src(paths.htmlSrc + '*.html')
      .pipe(gulp.dest(paths.buildDir + 'views/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.jsSrc + '**/*.js', ['build-origami', browserSync.reload]);
  gulp.watch(paths.cssSrc + '**/*.scss', ['build-origami', browserSync.reload]);
  gulp.watch(paths.htmlSrc + '**/*.html', ['build-html', browserSync.reload]);
});
