(function() {
  "use strict";

  angular
    .module('segue.submission.notification.service',[
      'restangular',
    ])

    .service("Notifications", function(Restangular) {
      var service = {};
      var backend = Restangular.service('notifications');

      service.get = function(hash) {
        return backend.one(hash).get();
      };
      service.accept = function(hash) {
        return backend.one(hash).post('accept');
      };
      service.decline = function(hash) {
        return backend.one(hash).post('decline');
      };

      return service;
    });
})();
