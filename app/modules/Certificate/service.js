(function() {
  "use strict";

  angular
    .module('segue.submission.certificate.service',[ ])
    .service('Survey', function(Restangular) {
    })
    .service('Certificates', function(Restangular, Auth) {
      function serviceFor(accountId) {
        return Restangular.service('certificates', Restangular.one('accounts', accountId));
      }
      var service = {};

      service.getOwnedByCredentials = function() {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return serviceFor(credentials.id).getList();
      };

      service.issue = function(descriptor) {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return serviceFor(credentials.id).post({ descriptor: descriptor });
      };

      return service;
    });
})();
