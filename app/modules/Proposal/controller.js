(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
      'segue.submission',
      'segue.submission.proposal.controller',
      'segue.submission.proposal.service'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('proposal', {
          url: '^/',
          views: {
            header: {                             templateUrl: 'modules/common/nav.html'    },
            main:   { controller: 'ProposalCtrl', templateUrl: 'modules/Proposal/form.html' }
          }
        });

    });


  angular
    .module('segue.submission.proposal.controller', [])
    .controller('ProposalCtrl', function($scope, Proposals, ProposalBuilder) {
      $scope.proposal = ProposalBuilder.faked();

      $scope.submit = function() {
        Proposals.post($scope.proposal);
      };
    });
})();
