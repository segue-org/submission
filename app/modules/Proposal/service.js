(function() {
  "use strict";

  angular
    .module('segue.submission.proposal.service',[
      'segue.submission.libs',
      'restangular',
    ])
    .factory('Proposals', function(Restangular) {
      return Restangular.service('//localhost:5000/api/proposal');
    })
    .service('Validator', function($http, $q, tv4) {
      return {
        validate: function(data, name) {
          var deferred = $q.defer()
          $http.get('//localhost:5000/api/proposal/'+name+'.schema').then(function(response) {
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
      }
    })
    .service('ProposalBuilder', function() {
      this.empty = function() { return {}; };

      this.faked = function() {
        return {
          "title": "one talk",
          "summary": "one summary",
          "full": "one full",
          "level": "beginner",
          "language": "pt"
        };
      };
    });
})();
