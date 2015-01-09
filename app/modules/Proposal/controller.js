(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
      'ngStorage',

      'segue.submission.libs',
      'segue.submission.proposal.controller',
      'segue.submission.proposal.service'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('proposal', {
          url: '^/proposal',
          views: {
            header: {                                   templateUrl: 'modules/common/nav.html'    },
            main:   { controller: 'NewProposalController', templateUrl: 'modules/Proposal/form.html' }
          }
        });
    });

  angular
    .module('segue.submission.proposal.controller', [])
    .controller('NewProposalController', function($scope, $state, $localStorage, Proposals, ProposalBuilder, Validator, Config) {
      $scope.languages = Config.PROPOSAL_LANGUAGES;
      $scope.levels    = Config.PROPOSAL_LEVELS;

      $scope.proposal  = $localStorage.savedProposal || ProposalBuilder.faked();

      $scope.$watch('proposal', function(newValue) {
        $localStorage.savedProposal = newValue;
      });

      function setErrors(errors) {
        $scope.errors = errors;
      }

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'proposal/new_proposal')
                 .then(Proposals.post, setErrors);
      };

    });
})();
