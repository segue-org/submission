(function() {
  "use strict"

  module.exports = {
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

})(); 
