(function() {
  'use strict';

  angular
    .module('templates', []);

  angular
    .module('segue.submission',[
      'templates',
      'ui.router',
      'ui.router.compat',

      'segue.submission.locale',
      'segue.submission.proposal'
    ])

    .controller('SubmissionCtrl', function($scope, Locale) {
      $scope.$on('$stateChangeSuccess', function(event, newState) {
        $scope.topState = newState.name.split('.')[0];
        $scope.state    = newState;
      });
      $scope.languages = Locale.languages();
      $scope.switchLanguage = Locale.switchTo;
    })

    .config(function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    });
})();
