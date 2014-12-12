(function() {
  var gulp = require('gulp');
  var myKarma = require('./karma');

  gulp.task('test', function (done) {
    myKarma();
  });
})();
