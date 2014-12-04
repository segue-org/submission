'use strict';

var gulp = require('gulp');
var all = require('./support').streams;
var paths = require('./support').paths;

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
  return all.stylesheets.all().pipe(gulp.dest(paths.dist + '/public'));
});

// Javascripts =================================================================

gulp.task('build:javascripts', ['build:javascripts:templates'], function () {
  return all.javascripts.all().pipe(gulp.dest(paths.dist + '/public'));
});

// Templates ===================================================================

gulp.task('build:javascripts:templates', function () {
  return all.templates().pipe(gulp.dest(paths.dist + '/public'));
});

// Index =======================================================================

gulp.task('build:inject:index', function () {
  return gulp.src(paths.index)
    .pipe(fdInject(all.stylesheets.vendor(), 'css', 'vendor'))
    .pipe(fdInject(all.stylesheets.custom(), 'css', 'custom'))
    .pipe(fdInject(all.javascripts.vendor(), 'js', 'vendor'))
    .pipe(fdInject(all.javascripts.custom(), 'js', 'custom'))
    .pipe(fdInject(all.templates(), 'js', 'templates'))
    .pipe(gulp.dest(paths.dist));
});

// Statics =====================================================================

gulp.task('build:statics', function () {
  return gulp.src([ paths.statics, '!'+paths.index ])
    .pipe(gulp.dest(paths.dist));
});

// Clean =======================================================================

gulp.task('clean', function () {
  var clean = require('gulp-rimraf');
  return gulp.src(paths.dist, { read: false }).pipe(clean({ force: true }));
});

// Build =======================================================================

gulp.task('build', function (done) {
  return require('run-sequence')(
    'clean',
    'build:statics',
    'build:inject:index',
    'build:javascripts',
    'build:stylesheets',
    done
  );
});

gulp.on('err', function(e) {
  console.log(e.err.stack);
});
