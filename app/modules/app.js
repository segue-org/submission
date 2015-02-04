(function() {
  'use strict';

  angular
    .module('templates', []);

  angular
    .module('segue.submission',[
      'templates',
      'ui.router',
      'ui.router.compat',
      'ui.gravatar',
      'restangular',

      'segue.submission.libs',
      'segue.submission.locale',
      'segue.submission.home',
      'segue.submission.splash',
      'segue.submission.authenticate',
      'segue.submission.proposal',
    ])

    .controller('SubmissionController', function($scope, $state, Auth) {
      $scope.$on('$stateChangeSuccess', function(event, newState) {
        $scope.topState = newState.name.split('.')[0];
        $scope.state    = newState;
      });

      $scope.home = function() {
        if (Auth.account()) {
          $state.go('home');
        }
        else {
          $state.go('splash');
        }
      };

      $scope.home();
    })

    .config(function(RestangularProvider, Config) {
      RestangularProvider.setBaseUrl(Config.API_HOST + Config.API_PATH);
      RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        if (operation == "getList") { return data.items; }
        if (data.resource) { return data.resource; }
        return data;
      });
    })
    .config(function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    })
    .config(function(gravatarServiceProvider) {
      gravatarServiceProvider.defaults = {
        'default': 'identicon',
        'rating': 'pg'
      };
    });

})();
