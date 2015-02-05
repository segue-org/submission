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
      'angular-loading-bar',

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
      $scope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        console.log('error moving from', fromState, 'to', toState);
        console.log('toParams:', toParams);
        console.log('fromParams:', fromParams);
        console.log(error);
      });

      $scope.home = function() {
        if (Auth.account()) {
          $state.go('home');
        }
        else {
          $state.go('splash');
        }
      };
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
