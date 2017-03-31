var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

var paths = {
  htmlSrc: 'src/views/',
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

gulp.task('build', ['build-html']);

gulp.task('build-html', function() {
  console.log('building html');
  return gulp.src(paths.htmlSrc + '*.html')
      .pipe(gulp.dest(paths.buildDir + 'views/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.htmlSrc + '**/*.html', ['build-html', browserSync.reload]);
});
