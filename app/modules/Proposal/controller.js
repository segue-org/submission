(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
      'segue.submission.libs',
      'segue.submission.proposal.controller',
      'segue.submission.proposal.service',
      'segue.submission.authenticate'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('proposal', {
          url: '^/proposal',
          views: {
            header: {                                      templateUrl: 'modules/common/nav.html'    },
            main:   { controller: 'NewProposalController', templateUrl: 'modules/Proposal/form.html' }
          },
          resolve: {
            userLocation: function(UserLocation) { return UserLocation.get(); },
            currentProposal: function(Proposals) { return Proposals.current(); }
          }
        });
    });

  angular
    .module('segue.submission.proposal.controller', [])
    .controller('NewProposalController', function($scope, $state, AuthModal, Auth,
                                                  Proposals, Validator, Config,
                                                  currentProposal, userLocation) {
      $scope.languages = Config.PROPOSAL_LANGUAGES;
      $scope.levels    = Config.PROPOSAL_LEVELS;

      $scope.proposal  = currentProposal;
      $scope.$watch('proposal', Proposals.localSave);

      $scope.userLocation = userLocation;

      $scope.authorsOption = '';
      $scope.openLoginModal  = AuthModal.login;
      $scope.openSignUpModal = AuthModal.signup;

      function setErrors(errors) {
        $scope.errors = errors;
      }

      $scope.account = Auth.glue($scope, 'account');

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'proposal/new_proposal')
                 .then(Proposals.post)
                 .catch(setErrors);
      };

    });
})();
