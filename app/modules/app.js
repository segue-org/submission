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
      'ngToast',
      'ui.utils.masks',
      
      'segue.submission.libs',
      'segue.submission.locale',
      'segue.submission.home',
      'segue.submission.splash',
      'segue.submission.account',
      'segue.submission.authenticate',
      'segue.submission.proposal',
      'segue.submission.invite',
      'segue.submission.purchase',
      'segue.submission.caravan',
      'segue.submission.caravaninvite'
    ])
    .controller('SubmissionController', function($scope, $state, Auth, $stateParams) {
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
        if (Auth.credentials()) {
          var params = {};
          if (_.has($stateParams, 'caravan_hash')) {
            params = {
              caravan_hash: $stateParams.caravan_hash
            };
          }
          $state.go('home', params);
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
