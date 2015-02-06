(function() {
  "use strict";

  angular
    .module('segue.submission.libs', [
      'segue.submission',
      'ngStorage'
    ])
    .service('tv4', function() { return tv4; })
    .service('Validator', function($http, $q, tv4, Config) {
      return {
        validate: function(data, path) {
          var deferred = $q.defer();
          var url = Config.API_HOST + Config.API_PATH + "/" + path + ".schema";
          $http.get(url).then(function(response) {
            var validation = tv4.validateMultiple(data, response.data);
            if (validation.errors.length) {
              deferred.reject(validation.errors);
            }
            else {
              deferred.resolve(data);
            }
          });
          return deferred.promise;
        }
      };
    })
    .service('FormErrors', function() {
      var self = this;
      var errors = {};

      console.log(123);
      self.set = function(errors) {
        console.log(errors);
        errors = errors;
      };
      return self;
    })
    .service('UserLocation', function(Config, $http, $q, $localStorage) {
      return {
        set: function(data) {
          $localStorage.userLocation = data;
        },
        get: function(ip) {
          var deferred = $q.defer();
          var url = Config.GEOIP_API + "/" + (ip || '');
          if ($localStorage.userLocation) {
            deferred.resolve($localStorage.userLocation);
          }
          else {
            $http.get(url).then(function(response) {
              deferred.resolve(response.data);
              $localStorage.userLocation = response.data;
            });
          }
          return deferred.promise;
        }
      };
    });

})();
