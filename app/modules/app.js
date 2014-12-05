(function() {
  'use strict';

  angular
    .module('templates', []);

  angular
    .module('segue.submission',[
      'gettext',
      'templates',
      'ui.router',
      'ui.router.compat',

      'segue.submission.proposal'
    ])

    .controller('SubmissionCtrl', function($scope, gettextCatalog) {
      $scope.$on('$stateChangeSuccess', function(event, newState) {
        $scope.topState = newState.name.split('.')[0];
        $scope.state    = newState;
      });

      gettextCatalog.setCurrentLanguage('en');
      gettextCatalog.loadRemote('/public/translations/messages.en.json');
    })

    .config(function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
    });
})();
