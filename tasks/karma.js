(function() {
  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var merge = require('event-stream').merge;
  var karma = require('gulp-karma');

  var streams = require('./support').streams;

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
    // Note:  These must be in order:  Bower, project, test
    var a = streams.javascripts.vendor();
    var b = streams.javascripts.custom();
    var c = streams.javascripts.tests();

    return merge(a,b,c)
            .pipe(karma(config))
            .on('error', errorHandler);
  };
})();
