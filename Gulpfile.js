var gulp  = require('gulp');
require('require-dir')('./tasks');
gulp.task('default', ['build', 'lint:failhard', 'githook']);
