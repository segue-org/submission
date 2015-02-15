(function() {
  "use strict";

  angular
    .module('segue.submission.home', [
      'segue.submission.authenticate.service',
      'segue.submission.proposal.service',
      'segue.submission.home.controller'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '^/home',
          views: {
            header: {                               templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'HomeController', templateUrl: 'modules/Home/home.html'  }
          },
          resolve: {
            myProposals:     function(Proposals) { return Proposals.getOwnedByCredentials(); },
            currentProposal: function(Proposals) { return Proposals.current(); },
          }
        });

    });
  angular
    .module('segue.submission.home.controller', [])
    .controller('HomeController', function($scope, $state, Proposals, myProposals, currentProposal) {
      $scope.myProposals     = myProposals;
      $scope.currentProposal = (_.isEmpty(currentProposal))? null : currentProposal;

      $scope.removeCurrent = function(ev) {
        $scope.currentProposal = null;
        Proposals.localForget();
        ev.stopPropagation();
      };

      $scope.$on('auth:changed', $scope.home);
    });
})();
