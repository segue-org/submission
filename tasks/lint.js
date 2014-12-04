var gulp = require('gulp');
var jshint = require('gulp-jshint');

var filesToLint = [
    // App Files
    './app/**/*.js',
    '!./app/bower_components/**/*.js',

    // Gulp files
    './Gulpfile.js',
    './gulp_tasks/**/*.js',

    // Test files
    './test/**/*.js'
];

gulp.task('lint', function () {
    return gulp.src(filesToLint)
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});
// This version of lint will cause gulp to fail
gulp.task('lint:failhard', function () {
    gulp.src(filesToLint)
        .pipe(jshint('./.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});