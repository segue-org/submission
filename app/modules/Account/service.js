(function() {
  "use strict";

  angular
    .module('segue.submission.account.service',[
      'restangular',
      'ngStorage'
    ])
    .service("Account", function(Restangular, Auth, $localStorage, ngToast, isBrazil) {
      var service = Restangular.service('accounts');
      var extensions = {};

      extensions.get = function() {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return service.one(credentials.id).get();
      };
      extensions.getDocumentField = function(country) {
        if (isBrazil(country)) {
          return 'cpf';
        } else {
          return 'passport';
        }
      };
      extensions.localLoad = function() {
        return $localStorage.savedAccount || {};
      };
      extensions.localSave = function(value) {
        $localStorage.savedAccount = value || {};
      };
      extensions.localForget = function() {
        $localStorage.savedAccount = {};
      };
      extensions.saveIt = function(object) {
        return object.save();
      };

      extensions.askReset = function(data) {
        return service.one('reset').post('', data);
      };
      extensions.setCertificateName = function(data) {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return service.one(credentials.id).post('certificate-name', data);
      };

      extensions.resetPassword = function(accountId) {
        return function(resetData) {
          return service.one(accountId)
                        .one('reset', resetData.hash_code)
                        .post('',resetData)
                        .then(function(data) { return Auth.login(data.email, resetData.password); });
        };
      };

      return _.extend(service, extensions);
    });
})();
