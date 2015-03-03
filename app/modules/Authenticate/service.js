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
        $localStorage.session = { token: data.token, credentials: data.credentials };
        $rootScope.$broadcast('auth:changed', data.credentials);
        return data.credentials;
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
    .service("Auth", function(Restangular, LocalSession, $rootScope, ngToast) {
      var session = Restangular.service('sessions');
      
      Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.status === 400) {
          ngToast.create({
            content: 'email ou senha incorretos. verifique.',
            className: 'danger'
          });
          return false;
        }
        
        return true;
      });

      self.logout = function() {
        LocalSession.destroy();
      };

      self.login = function(email, password) {
        LocalSession.destroy();
        return session.post({ email: email, password: password })
                      .then(LocalSession.create);
      };

      self.credentials = function() {
        return LocalSession.current().credentials;
      };
      self.token = function() {
        return LocalSession.current().token;
      };

      self.glue = function(target, name) {
        $rootScope.$on('auth:changed', function(_,d) { target[name] = d; });
        return self.credentials();
      };

      return self;
    })

})();
