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
        if (!credentials) { return null; }
        return serviceFor(credentials.id).getList();
      };

      service.saveAnswers = function(data) {
        if (!credentials) { return null; }
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
        if (!credentials) { return null; }
        return serviceFor(credentials.id).getList();
      };

      service.issue = function(descriptor) {
        if (!credentials) { return null; }
        return serviceFor(credentials.id).post({ descriptor: descriptor });
      };

      return service;
    });
})();
