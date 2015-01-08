(function() {
  "use strict";

  angular
    .module("segue.submission.login.service", [
      'segue.submission',
      'http-auth-interceptor',
      'ngStorage',
      'restangular'
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
    .service("Session", function($localStorage) {
      var self = {};

      self.current = function(data) {
        if (data === undefined) {
          return $localStorage.auth || {};
        }
        $localStorage.auth = { token: data.token, account: data.account };
      };

      self.destroy = function() {
      };

      return self;
    })
    .service("Auth", function(Session, Restangular) {
      var self = {};
      var resource = Restangular.service('account');

      self.signUp = function(email, password) {
        resource.post({ email: email, password: password })
                .then(Session.current);
      };
      self.login = function(email, password) {
      };
      self.isLogged = function() {
        return Session.current().token !== undefined;
      };
      self.logout = function() {
      };

      return self;
    });
})();
