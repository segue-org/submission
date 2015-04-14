(function() {
  "use strict";

  angular
    .module('segue.submission.caravaninvite.service',[
      'restangular',
    ])

    .service("CaravanInvites", function(Restangular) {
      return {
        of: function(caravanId) {
          return Restangular.service('invites', Restangular.one('caravans', caravanId));
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
