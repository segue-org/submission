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
          url: '^/proposal',
          views: {
            header: {                                   templateUrl: 'modules/common/nav.html'    },
            main:   { controller: 'ProposalController', templateUrl: 'modules/Proposal/form.html' }
          }
        });

    });


  angular
    .module('segue.submission.proposal.controller', [])
    .controller('ProposalController', function($scope, Proposals, ProposalBuilder) {
      $scope.proposal = ProposalBuilder.faked();

      $scope.submit = function() {
        Proposals.post($scope.proposal);
      };
    });
})();
