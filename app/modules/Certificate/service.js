(function() {
  "use strict";

  angular
    .module('segue.submission.certificate.service',[ ])
    .service('Survey', function(Restangular, Auth) {
      var credentials = Auth.credentials();

      function serviceFor(accountId) {
        return Restangular.service('survey', Restangular.one('accounts', accountId));
      }

      var service = {};

      service.get = function() {
        return serviceFor(credentials.id).getList();
      };

      service.saveAnswers = function(data) {
        return serviceFor(credentials.id).post({ answers: data });
      };

      return service;
    })
    .service('Certificates', function(Restangular, Auth) {
      var credentials = Auth.credentials();

      function serviceFor(accountId) {
        return Restangular.service('certificates', Restangular.one('accounts', accountId));
      }

      var service = {};

      service.getOwnedByCredentials = function() {
        return serviceFor(credentials.id).getList();
      };

      service.issue = function(descriptor) {
        return serviceFor(credentials.id).post({ descriptor: descriptor });
      };

      return service;
    });
})();
