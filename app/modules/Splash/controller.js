(function() {
  "use strict";

  angular
    .module('segue.submission.splash', [
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
          }
        });

    });

  angular
    .module('segue.submission.splash.controller', [])
    .controller('SplashController', function($scope, $state, Auth) {
      if (Auth.credentials()) { $state.go('home'); }

      $scope.$on('auth:changed', $scope.home);
    });
})();
