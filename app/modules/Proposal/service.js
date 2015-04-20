(function() {
  "use strict";

  angular
    .module('segue.submission.proposal.service',[
      'segue.submission',
      'restangular',
      'ngStorage',
    ])
    .factory('Tracks', function(Restangular) {
      var service = Restangular.service('proposals/tracks');
      var extensions = {};
      return _.extend(service, extensions);
    })
    .factory('Proposals', function(Restangular, Auth, Validator, FormErrors, $localStorage, $q) {
      var service = Restangular.service('proposals');
      var extensions = {};

      extensions.cfpState = function() {
        return service.one('cfp-state').get().then(function(data) {
          return data.state;
        });
      };
      extensions.current = function() {
        return $localStorage.savedProposal || {};
      };
      extensions.localSave = function(value) {
        $localStorage.savedProposal = value || {};
      };
      extensions.localForget = function() {
        $localStorage.savedProposal = {};
      };
      extensions.getOwnedByCredentials = function() {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return service.getList({ owner_id: credentials.id });
      };
      extensions.getByCoAuthors = function() {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return service.getList({ coauthor_id: credentials.id });
      };
      extensions.saveIt = function(object) {
        return object.save();
      };
      extensions.createInvites = function(newInvites) {
        return function(proposal) {
          return $q.all(newInvites.map(function(invite) {
            return Validator.validate(invite, 'proposals/new_invite')
                            .then(function() { proposal.post('invites', invite); })
                            .catch(function() { console.log(arguments); });
          }));
        };
      };

      return _.extend(service, extensions);
    });
})();
