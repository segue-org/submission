(function() {
  'use strict';

  var gulp = require('gulp');
  var merge = require('event-stream').merge;
  var plugins = require('gulp-load-plugins')();
  var mainBowerFiles = require('main-bower-files');
  var debug = require('gulp-debug');

  var paths = exports.paths = {
    stylesheets   : ['app/modules/**/*.scss'],
    javascripts   : 'app/modules/**/*.js',
    templates     : 'app/modules/**/*.html',
    index         : 'app/index.html',
    statics       : 'app/*.*',
    images        : 'app/images/*.*',
    fonts         : 'app/bower_components/font-awesome/fonts/*.*',
    dist          : 'dist',
    test          : ['spec/helpers/*.js','spec/**/*.spec.js','app/config.js']
  };

  function streamStylesheets() {
    var self = {};

    var sassParms = {
      errLogToConsole: !plugins.util.env.production,
      includePaths: [ './app' ],
    };

    self.vendor = function() {
      return gulp.src(mainBowerFiles(), { base: 'app/bower_components' })
                .pipe(plugins.ignore.include('**/*.css'))
                .pipe(plugins.sass(sassParms));
    };
    self.custom = function() {
      return gulp.src(paths.stylesheets)
                .pipe(plugins.sass(sassParms));
    };
    self.all = function() {
      return merge(self.vendor(), self.custom());
    };

    return self;
  }

  function streamJavascripts() {
    var self = {};

    self.vendor = function() {
      return gulp.src(mainBowerFiles(), { base: 'app/bower_components' })
                 .pipe(plugins.ignore.include('**/*.js'));
    };

    self.custom = function() {
      return gulp.src(paths.javascripts);
    };

    self.tests = function() {
      return gulp.src(paths.test);
    };

    self.all = function() {
      return merge(self.vendor(), self.custom());
    };

    return self;
  }

  function streamTemplates () {
    return gulp.src(paths.templates)
               .pipe(plugins.angularTemplatecache({ root: 'modules', module: 'templates' }));
  }

  exports.streams = {
    stylesheets : streamStylesheets(),
    javascripts : streamJavascripts(),
    templates   : streamTemplates,
  };

})();
