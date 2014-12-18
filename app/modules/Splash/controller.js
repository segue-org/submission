(function() {
  "use strict";

  angular
    .module('segue.submission.splash', [
      'segue.submission',
      'segue.submission.proposal'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('splash', {
          url: '^/',
          views: {
            header: {                                 templateUrl: 'modules/common/nav.html'    },
            main:   { controller: 'SplashController', templateUrl: 'modules/Splash/splash.html' }
          }
        });

    })
    .controller('SplashController', function($scope, $state) {
      $scope.propose = function() {
        $state.go('proposal');
      };
      $scope.login = function() {
        $state.go('login');
      };
    });
})();
