(function() {

  angular
    .module('segue.submission.libs', [ 'segue.submission' ])
    .service('tv4', function() { return tv4; })

    .service('Validator', function($http, $q, tv4) {
      return {
        validate: function(data, path) {
          var deferred = $q.defer();
          $http.get('//localhost:5000/api/'+path+'.schema').then(function(response) {
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
    });

})();
