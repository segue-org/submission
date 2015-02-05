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
            myProposals:     function(Proposals) { return Proposals.getOwnedByAccount(); },
            currentProposal: function(Proposals) { return Proposals.current(); },
            account:         function(Auth)      { return Auth.account(); }
          }
        });

    });
  angular
    .module('segue.submission.home.controller', [])
    .controller('HomeController', function($scope, $state, myProposals, currentProposal, account) {
      $scope.account         = account;
      $scope.myProposals     = myProposals;
      $scope.currentProposal = (_.isEmpty(currentProposal))? null : currentProposal;

      $scope.$on('auth:changed', function(newAccount) {
        $scope.home();
      });
    });
})();
