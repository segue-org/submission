(function() {
  "use strict";

  angular
    .module("segue.submission.authenticate.service", [
      'segue.submission',
      'http-auth-interceptor',
      'ngStorage',
      'restangular'
    ])
    .factory('authTokenInterceptor', function($window, Config, LocalSession) {
      return {
        request: function (config) {
          if (!config.url.match(Config.API_HOST)) { return config; }
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer '+ LocalSession.current().token;
          return config;
        }
      };
    })
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('authTokenInterceptor');
    })
    .service("LocalSession", function($localStorage, $rootScope) {
      var self = {};

      self.create = function(data) {
        $localStorage.session = { token: data.token, account: data.account };
        $rootScope.$broadcast('auth:changed', data.account);
        return data.account;
      };

      self.current = function(data) {
        return $localStorage.session || {};
      };

      self.destroy = function() {
        delete $localStorage.session;
        $rootScope.$broadcast('auth:changed', null);
      };

      return self;
    })
    .service("Auth", function(Restangular, LocalSession, $rootScope) {
      var session = Restangular.service('sessions');

      self.logout = function() {
        LocalSession.destroy();
      };

      self.login = function(email, password) {
        LocalSession.destroy();
        return session.post({ email: email, password: password })
                      .then(LocalSession.create);
      };

      self.account = function() {
        return LocalSession.current().account;
      };
      self.token = function() {
        return LocalSession.current().token;
      };

      self.glue = function(target, name) {
        $rootScope.$on('auth:changed', function(_,d) { target[name] = d; });
        return self.account();
      };

      return self;
    })
    .service("Account", function(Restangular, $localStorage) {
      var service = Restangular.service('accounts');
      var extensions = {};

      extensions.localLoad = function() {
        return $localStorage.savedAccount || {};
      };
      extensions.localSave = function(value) {
        $localStorage.savedAccount = value || {};
      };
      extensions.localForget = function() {
        $localStorage.savedAccount = {};
      };

      return _.extend(service, extensions);
    });
})();
