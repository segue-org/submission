(function() {
  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var series = require('stream-series');
  var karma = require('gulp-karma');

  var streams = require('./streams');

  var karmaPort = 9876;

  var config = {
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    plugins: ['karma-jasmine', 'karma-phantomjs-launcher'],
    reporters: ['dots'],
    singleRun: true,
    port: karmaPort++
  };

  function errorHandler(err) {
    console.log(err);
    gutil.log(gutil.colors.red('tests failed'));
    throw err;
  }

  module.exports = function () {
    var vendor    = streams.javascripts.vendor();
    var custom    = streams.javascripts.custom();
    var mocks     = gulp.src(['app/bower_components/angular-mocks/angular-mocks.js']);
    var templates = gulp.src(['dist/public/templates.js']);
    var tests     = streams.javascripts.tests();

    // Note:  These must be in order:  Bower, project, mocks, templates, test
    return series(vendor, custom, mocks, templates, tests)
            .pipe(karma(config))
            .on('error', errorHandler);
  };

  function xlog() { console.log(arguments); }
})();
