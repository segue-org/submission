(function() {
  "use strict";

  angular
    .module('segue.submission.invite.service',[
      'restangular',
    ])

    .service("Invites", function(Restangular) {
      return {
        of: function(proposalId) {
          return Restangular.service('invites', Restangular.one('proposals', proposalId));
        },
        registerInvitee: function(object) {
          return function(signup) {
            object.id = object.hash;
            return object.post('register', signup);
          };
        },
        accept: function(object) {
          object.id = object.hash;
          return object.post('accept', {});
        },
        decline: function(object) {
          object.id = object.hash;
          return object.post('decline', {});
        }
      };
    });
})();
