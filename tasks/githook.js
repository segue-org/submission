/**
 * Install a git precommit hook to ensure a broken build can't be committed
 **/
var gulp = require('gulp');
var gutil = require('gulp-util');
var config = require('./config');
var fs = require('fs');
var q = require('q');

var commitHook = "" +
    "#!/bin/bash\n" +
    "node_modules/.bin/gulp lint:failhard\n" +
    "node_modules/.bin/gulp build\n" +
    "RETVAL=$?\n" +
    "if [ $RETVAL -ne 0 ]\n" +
    "  then\n" +
    "  echo \"Build failed. Cannot commit.\"\n" +
    "  exit 1\n" +
    "fi\n";

gulp.task('githook', function () {
    gutil.log(gutil.colors.cyan("Installing git pre-commit hooks..."));

    var path = config.PROJECT_ROOT + '/.git/hooks/pre-commit';
    var deferred = q.defer();

    fs.writeFile(path, commitHook, function(err) {
        if (err) {
            deferred.reject("Could not write git pre-commit hook.");
            throw err;
        } else {
            fs.chmod(path, "0755", function(err) {
                if (err) {
                    deferred.reject("Could not set executable bit on pre-commit hook file.");
                    throw err;
                } else {
                    deferred.resolve("Installed git pre-commit hook.");
                }
            });
        }
    });
    return deferred;
});
