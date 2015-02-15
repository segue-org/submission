(function() {
  "use strict";

  angular
    .module('segue.submission.account.service',[
      'restangular',
      'ngStorage'
    ])
    .service("Account", function(Restangular, $localStorage) {
      var service = Restangular.service('accounts');
      var extensions = {};

      extensions.localLoad = function() {
        return $localStorage.savedAccount || {};
      };
      extensions.localSave = function(value) {
        $localStorage.savedAccount = value || {};
      };
      extensions.localForget = function() {
        $localStorage.savedAccount = {};
      };

      return _.extend(service, extensions);
    });
})();
