(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
      'segue.submission',
      'segue.submission.proposals'
    ])
    .controller('ProposalCtrl', function($scope, Proposals, ProposalBuilder) {
      $scope.proposal = ProposalBuilder.faked();

      $scope.submit = function() {
        Proposals.post($scope.proposal);
      };
    })
    .config(function($stateProvider) {
      $stateProvider
        .state('proposal', {
          url: '^/',
          views: {
            header: {                             templateUrl: 'modules/views/nav.html'      },
            main:   { controller: 'ProposalCtrl', templateUrl: 'modules/views/proposal.html' }
          }
        });

    });
})();
