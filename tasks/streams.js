(function() {
  'use strict';

  var gulp = require('gulp');
  var es = require('event-stream');
  var plugins = require('gulp-load-plugins')();
  var mainBowerFiles = require('main-bower-files');
  var debug = require('gulp-debug');

  var paths = require('./paths');

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
      return es.merge(self.vendor(), self.custom());
    };

    if (plugins.util.env.production) {
      self.vendor = minifyCss(self.vendor, 'segue-v.css');
      self.custom = minifyCss(self.custom, 'segue-c.css');
    }

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
      return es.merge(self.vendor(), self.custom());
    };

    if (plugins.util.env.production) {
      self.custom = uglify(self.custom, 'segue-c.js');
      self.vendor = uglify(self.vendor, 'segue-v.js');
    }

    return self;
  }

  function uglify(fn, filename) {
    return function() {
      return fn().pipe(plugins.concat(filename, { sourceContent: true }))
                 .pipe(plugins.uglify({ mangle: false }));
    };
  }

  function minifyCss(fn, filename) {
    return function() {
      return fn().pipe(plugins.concat(filename, { sourceContent: true }))
                 .pipe(plugins.minifyCss({ processImport: false }));
    };
  }

  function streamTemplates () {
    return gulp.src(paths.templates)
               .pipe(plugins.angularTemplatecache({ root: 'modules', module: 'templates' }));
  }

  module.exports = {
    stylesheets : streamStylesheets(),
    javascripts : streamJavascripts(),
    templates   : streamTemplates,
  };

})();
