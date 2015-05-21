(function() {
  "use strict";

  angular
    .module('segue.submission.caravan.service',[
      'segue.submission',
      'restangular',
      'ngStorage',
    ])
    .factory('Caravans', function(Restangular, Auth, Validator, FormErrors, $localStorage, $q) {
      var service = Restangular.service('caravans');
      var extensions = {};

      extensions.current = function() {
        return $localStorage.savedCaravan || {};
      };
      extensions.localSave = function(value) {
        $localStorage.savedCaravan = value || {};
      };
      extensions.localForget = function() {
        $localStorage.savedCaravan = {};
      };
      extensions.saveIt = function(object) {
        return object.save();
      };
      extensions.createInvites = function(newInvites) {
        return function(caravan) {
          return $q.all(newInvites.map(function(invite) {
            return Validator.validate(invite, 'caravans/new_invite')
                            .then(function() { caravan.post('invites', invite); })
                            .catch(function() { console.log(arguments); });
          }));
        };
      };
      extensions.getOwnedByCredentials = function() {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return service.one().get({owner_id: credentials.id});
      };
      extensions.getPaidRiders = function(invites, paid_riders) {
        _(invites).each(function(invite) {
          var found = _(paid_riders).find(function(item) {
            return item.customer.email == invite.recipient;
          });
          invite.paid = 'pending';
          if (found) {
            if (found.status == 'paid' || found.status == 'confirmed') {
              invite.paid = 'paid';
            }
          }
        });

        return invites;
      };

      return _.extend(service, extensions);
    });
})();
