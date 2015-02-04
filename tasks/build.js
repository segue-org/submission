(function() {
  'use strict';

  var gulp = require('gulp');
  var streams = require('./streams');
  var paths = require('./paths');
  var plugins = require('gulp-load-plugins')();
  var env = plugins.util.env;

  function fdInject(stream, ext, namespace) {
    function debugInject(file) {
      console.log(namespace, ext, file.path);
    }
    var inject = require('gulp-inject');
    stream.on('data', debugInject);
    return inject(stream, {
      ignorePath: [ '/app/modules', 'app/bower_components', '/dist/public' ],
      addPrefix: '/public',
      starttag: '<!-- inject:'+namespace+':'+ext+' -->'
    });
  }

  // Stylesheets =================================================================

  gulp.task('build:stylesheets', function () {
    return streams.stylesheets.all().pipe(gulp.dest(paths.dist + '/public'));
  });

  // Javascripts =================================================================

  gulp.task('build:javascripts', ['build:javascripts:templates'], function () {
    return streams.javascripts.all().pipe(gulp.dest(paths.dist + '/public'));
  });

  // Templates ===================================================================

  gulp.task('build:javascripts:templates', function () {
    return streams.templates().pipe(gulp.dest(paths.dist + '/public'));
  });

  // Index =======================================================================

  gulp.task('build:inject:index', function () {
    return gulp.src(paths.index)
      .pipe(fdInject(streams.stylesheets.custom(), 'css', 'custom'))
      .pipe(fdInject(streams.stylesheets.vendor(), 'css', 'vendor'))
      .pipe(fdInject(streams.javascripts.vendor(), 'js', 'vendor'))
      .pipe(fdInject(streams.javascripts.custom(), 'js', 'custom'))
      .pipe(fdInject(streams.templates(), 'js', 'templates'))
      .pipe(gulp.dest(paths.dist));
  });

  // Statics =====================================================================

  gulp.task('build:statics', function () {
    return gulp.src([ paths.statics, '!'+paths.index ])
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('build:statics:img', function() {
    return gulp.src(paths.images)
               .pipe(gulp.dest(paths.dist + '/images/'));
  });

  gulp.task('icons', function() {
    var suffix = (env.production)? '/fonts':'/public/font-awesome/fonts';
    return gulp.src(paths.fonts)
               .pipe(gulp.dest(paths.dist + suffix));
  });

  // Clean =======================================================================

  gulp.task('clean', function () {
    var clean = require('gulp-rimraf');
    return gulp.src(paths.dist, { read: false })
               .pipe(clean({ force: true }));
  });

  // Build =======================================================================

  gulp.task('build', function (done) {
    return require('run-sequence')(
      'clean',
      'icons',
      'translations',
      'build:statics',
      'build:statics:img',
      'build:inject:index',
      'build:javascripts',
      'build:stylesheets',
      done
    );
  });

  gulp.on('err', function(e) {
    console.log(e.err.stack);
  });

})();
