var gulp = require('gulp');
var config = require('./config');
var paths = require('./paths');
var gutil = require('gulp-util');

// Serve =======================================================================

gulp.task('serve', ['build'], function () {
  var connect = require('gulp-connect');

  connect.server({
    livereload : !gutil.env.production,
    root       : paths.dist,
    port       : config.WEB_SERVER_PORT
  });

  if (!gutil.env.production) {
    var watch = require('gulp-watch');

    gulp.watch(paths.stylesheets, [ 'build:stylesheets' ]);
    gulp.watch(paths.javascripts, [ 'build:javascripts' ]);
    gulp.watch(paths.templates,   [ 'build:javascripts:templates' ]);
    gulp.watch(paths.statics,     [ 'build:statics' ]);
    gulp.watch(paths.index,       [ 'build:inject:index' ]);

    watch(paths.dist + '/**/*').pipe(connect.reload());
  }
});

// Serve Dist ==================================================================

gulp.task('serve:dist', function (done) {
  gutil.env.production = true;
  gulp.start('serve');
});
