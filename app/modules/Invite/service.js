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
