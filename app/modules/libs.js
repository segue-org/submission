(function() {
  "use strict";

  angular
    .module('segue.submission.libs', [ 'segue.submission' ])
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
    .service('UserLocation', function(Config, $http, $q) {
      return {
        get: function(ip) {
          var deferred = $q.defer();
          var url = Config.GEOIP_API + "/" + (ip || '');
          $http.get(url).then(function(response) {
            deferred.resolve(response.data);
          });
          return deferred.promise;
        }
      };
    });

})();
