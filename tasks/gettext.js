var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');
var paths = require('./paths');

gulp.task('pot', function () {
  return gulp.src(['app/modules/**/*.html', 'app/modules/**/*.js'])
             .pipe(gettext.extract('template.pot', { }))
             .pipe(gulp.dest('locale/'));
});

gulp.task('translations', function () {
  return gulp.src('locale/**/*.po')
             .pipe(gettext.compile({ format: 'json' }))
             .pipe(gulp.dest(paths.dist + '/public/translations'));
});
