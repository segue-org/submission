(function() {
  "use strict";

  angular
    .module('segue.submission.reception',[ ])
    .config(function($stateProvider) {
      $stateProvider
        .state('reception', {
          url: '^/reception/:hash',
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { templateUrl: 'modules/Reception/reception.html', controller: 'ReceptionController' }
          },
          resolve: {
            person: function(Reception, $stateParams) { return Reception.one($stateParams.hash).get(); }
          }
        });
    })
    .controller('ReceptionController', function($scope, Reception, person) {
      $scope.person = person;

      var promocode_payment = _.findWhere(person.payments, { "type": "promocode" });
      if (promocode_payment) { $scope.promocode = promocode_payment.promocode; }
    })
    .service('Reception', function(Restangular) {
      var service = Restangular.service('fd/reception');
      return service;
    });
})();
