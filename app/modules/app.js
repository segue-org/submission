(function() {
  'use strict';

  angular
    .module('templates', []);

  angular
    .module('segue.submission',[
      'templates',
      'ui.router',
      'ui.router.compat',
    ])

    .controller('SubmissionCtrl', function($scope) {
      $scope.$on('$stateChangeSuccess', function(event, newState) {
        $scope.topState = newState.name.split('.')[0];
        $scope.state    = newState;
      });
    })

    .config(function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    });
})();
