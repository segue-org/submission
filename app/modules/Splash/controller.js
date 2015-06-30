(function() {
  "use strict";

  angular
    .module('segue.submission.splash', [
      'segue.submission.libs',
      'segue.submission.authenticate.service',
      'segue.submission.splash.controller'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('splash', {
          url: '^/',
          views: {
            header: {                                 templateUrl: 'modules/common/nav.html'    },
            main:   { controller: 'SplashController', templateUrl: 'modules/Splash/splash.html' }
          },
          resolve: {
            cfpState: function(Proposals) { return Proposals.cfpState(); },
            purchaseMode: function(Purchases) { return Purchases.purchaseMode(); }
          }
        });
    });

  angular
    .module('segue.submission.splash.controller', [])
    .controller('SplashController', function($rootScope, $scope, $state, $window, cfpState, purchaseMode, Auth, ContractModal) {
      $scope.purchaseMode = purchaseMode;
      $scope.cfpState = cfpState;

      if (Auth.credentials()) { $state.go('home'); }

      delete $rootScope.accepted_contracts;

      $scope.$on('auth:changed', $scope.home);

      $rootScope.$watch('accepted_contracts', function() {
        if (_.include($rootScope.accepted_contracts, 'initial')) {
          $window.location = "#/purchase/new";
        }
        if (_.include($rootScope.accepted_contracts, 'caravan')) {
          $window.location = "#/caravan/new";
        }
      });

      $scope.showInfo = ContractModal.show;
    });
})();
