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
        var ret = null;
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

      extensions.resetPassword = function(accountId) {
        return function(resetData) {
          return service.one(accountId)
                        .one('reset', resetData.hash_code)
                        .post('',resetData)
                        .then(function(data) { return Auth.login(data.email, resetData.password); });
        };
      };

      extensions.isRegistered = function(email) {
        return Restangular.service('accounts/is_registered').one().get({'email': email});
      }

      return _.extend(service, extensions);
    });
})();
