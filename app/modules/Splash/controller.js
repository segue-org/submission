(function() {
  "use strict";

  angular
    .module('segue.submission.splash', [
      'segue.submission.splash.controller'
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

    });
  angular
    .module('segue.submission.splash.controller', [])
    .controller('SplashController', function($scope, $state) {
      $scope.propose = function() {
        $state.go('proposal');
      };
      $scope.login = function() {
        $state.go('authenticate');
      };
    });
})();
