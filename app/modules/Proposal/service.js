(function() {
  "use strict";

  angular
    .module('segue.submission.proposal.service',[
      'segue.submission',
      'restangular',
      'ngStorage'
    ])
    .factory('Proposals', function(Restangular, Auth, $localStorage) {
      var service = Restangular.service('proposals');
      var extensions = {};

      extensions.current = function() {
        return $localStorage.savedProposal || {};
      };
      extensions.localSave = function(value) {
        $localStorage.savedProposal = value || {};
      };
      extensions.localForget = function() {
        $localStorage.savedProposal = {};
      };
      extensions.getOwnedByAccount = function() {
        var accountId = Auth.account().id;
        return service.getList({ owner_id: accountId });
      };
      extensions.saveIt = function(object) {
        return object.save();
      };

      return _.extend(service, extensions);
    });
})();
