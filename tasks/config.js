/**
 * ###############################
 * CONFIG
 * Configuration options for our application.
 * ###############################
 */
var PROJECT_ROOT = __dirname + '/..';
var APPLICATION_ROOT = PROJECT_ROOT + '/app';
var config = {
    WEB_SERVER_PORT: 9000,
    REST_SERVER_PORT: 8001,
    APPLICATION_ROOT: APPLICATION_ROOT,
    LIVERELOAD_PORT: 35729,
    PROJECT_ROOT: PROJECT_ROOT,
    APPLICATION_SCRIPTS: APPLICATION_ROOT + '/**/*.js',
    APPLICATION_VIEWS: APPLICATION_ROOT + '/**/*.html',
    APPLICATION_STYLES: [
        APPLICATION_ROOT + '/**/*.scss',
        APPLICATION_ROOT + '/**/*.css',
    ],
    TEST_LIBRARIES: [
        'app/bower_components/angular-mocks/angular-mocks.js',
    ],
    MINIFY_DESTINATION: PROJECT_ROOT + '/dist',
    LOCALES: ['en', 'pt']
};

// Use this for wathcers that monitor ALL application files
config.APPLICATION_FILES = [
    config.APPLICATION_SCRIPTS,
    config.APPLICATION_VIEWS
].concat(config.APPLICATION_STYLES);

module.exports = config;
