(function() {
  "use strict";

  angular
    .module("segue.submission.login.service", [
      'segue.submission',
      'http-auth-interceptor',
      'ngStorage',
      'restangular'
    ])
    .factory('authTokenInterceptor', function($window, LocalSession) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer '+ LocalSession.current().token;
          return config;
        }
      };
    })
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('authTokenInterceptor');
    })
    .service("LocalSession", function($localStorage) {
      var self = {};

      self.create = function(data) {
        $localStorage.session = { token: data.token, account: data.account };
      }

      self.current = function(data) {
        return $localStorage.session || {};
      };

      return self;
    })
    .service("Auth", function(Restangular, LocalSession) {
      var session = Restangular.service('session');
      var account = Restangular.service('account');

      self.logout = function() {
        LocalSession.destroy();
      };

      self.login = function(email, password) {
        session.post({ email: email, password: password })
               .then(LocalSession.create)
      };

      self.account = function() {
        return LocalSession.current().account;
      };
      self.token = function() {
        return LocalSession.current().token;
      };

      return self;
    });
})();
