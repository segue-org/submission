(function() {
  "use strict";

  angular
    .module('segue.submission.home', [
      'segue.submission.proposal.service',
      'segue.submission.home.controller'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '^/',
          views: {
            header: {                               templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'HomeController', templateUrl: 'modules/Home/home.html'  }
          },
          resolve: {
            proposals: function(Proposals) { return Proposals.getOwnedByAccount(); }
          }
        });

    });
  angular
    .module('segue.submission.home.controller', [])
    .controller('HomeController', function($scope, $state, proposals) {
      $scope.proposals = proposals;
    });
})();
