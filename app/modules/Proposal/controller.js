(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
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
            main:   { controller: 'ProposalController', templateUrl: 'modules/Proposal/form.html' }
          }
        })
        .state('proposal.wait', {
          url: '^/proposal/wait',
          views: {
            'header@': {                                   templateUrl: 'modules/common/nav.html'    },
            'main@':   { controller: 'ProposalController', templateUrl: 'modules/Proposal/wait.html' }
          }
        })
        .state('proposal.confirmed', {
          url: '^/proposal/confirm',
          views: {
            'header@': {                                   templateUrl: 'modules/common/nav.html'    },
            'main@':   { controller: 'ProposalController', templateUrl: 'modules/Proposal/wait.html' }
          }
        });
    });

  angular
    .module('segue.submission.proposal.controller', [])
    .controller('ProposalController', function($scope, $state, Proposals, ProposalBuilder, Validator) {
      $scope.proposal = ProposalBuilder.faked();

      function setErrors(errors) {
        $scope.errors = errors;
      }

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'new_proposal')
                 .then(Proposals.post, setErrors);
      };

      $scope.confirm = function() {
        $state.go('proposal.confirmed');
      };
    });
})();
