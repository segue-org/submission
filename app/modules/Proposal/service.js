(function() {
  "use strict";

  angular
    .module('segue.submission.proposal.service',[
      'segue.submission',
      'restangular',
      'ngStorage',
    ])
    .factory('Proposals', function(Restangular, Auth, Validator, FormErrors, $localStorage, $q) {
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
      extensions.createInvites = function(newInvites) {
        return function(proposals) {
          return $q.all(newInvites.map(function(invite) {
            return Validator.validate(invite, 'proposals/new_invite')
                            .then(function() { proposals.post('invites', invite); })
                            .catch(FormErrors.set);
          }));
        };
      };

      return _.extend(service, extensions);
    });
})();
