(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
      'segue.submission.directives',
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
    .module('segue.submission.proposal.controller', ['segue.submission.proposal'])
    .controller('NewProposalController', function($scope, $state, Config,
                                                  Proposals, Validator, Auth, focusOn,
                                                  currentProposal, userLocation) {
      focusOn('proposal.title');

      $scope.languages = Config.PROPOSAL_LANGUAGES;
      $scope.levels    = Config.PROPOSAL_LEVELS;

      $scope.proposal  = currentProposal;
      $scope.$watch('proposal', Proposals.localSave);

      $scope.userLocation = userLocation;

      $scope.authorsOption = null;

      function setErrors(errors) {
        $scope.errors = errors;
      }

      $scope.account = Auth.glue($scope, 'account');

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'proposal/new_proposal')
                 .then(Proposals.post)
                 .then(Proposals.localForget)
                 .then(_.partial($state.go, 'home'))
                 .catch(setErrors);
      };

    })
    .controller('NewProposalAuthorController', function($scope, AuthModal, focusOn) {
      $scope.author = {};

      $scope.openLoginModal = AuthModal.login;

      $scope.focusName = _.partial(focusOn, 'author.name');

    });
})();
