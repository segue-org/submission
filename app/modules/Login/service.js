(function() {
  "use strict";

  angular
    .module("segue.submission.login.service", [
      'http-auth-interceptor'
    ])
    .factory('authTokenInterceptor', function($window, Session) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer '+ Session.current().token;
          return config;
        }
      };
    })
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('authTokenInterceptor');
    })
    .service("Session", function() {
      var self = {};
      self.setCurrentSession = function(token, account) {
      };
      self.current = function() {
      };
      self.destroy = function() {
      };

      return self;
    })
    .service("Auth", function() {
      var self = {};

      self.signUp = function(email, password) {
      };
      self.login = function(email, password) {
      };
      self.isLogged = function() {
      };
      self.logout = function() {
      };

      return self;
    });
})();
