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
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { template:    "<div ui-view='form'></div>", controller: 'ProposalController' }
          },
          resolve: {
            userLocation: function(UserLocation) { return UserLocation.get(); },
          }
        })
        .state('proposal.new', {
          parent: 'proposal',
          url: '^/proposal/new',
          views: {
            form: { controller: 'NewProposalController', templateUrl: 'modules/Proposal/form.html' }
          },
          resolve: {
            currentProposal: function(Proposals) { return Proposals.current(); }
          }
        })
        .state('proposal.edit', {
          parent: 'proposal',
          url: '^/proposal/:id',
          views: {
            form: { controller: 'EditProposalController', templateUrl: 'modules/Proposal/form.html' }
          },
          resolve: {
            currentProposal: function(Proposals, $stateParams) {
              return Proposals.one($stateParams.id).get();
            }
          }
        });
    });

  angular
    .module('segue.submission.proposal.controller', ['segue.submission.proposal'])
    .controller('ProposalController', function($scope, Config, Auth, userLocation, focusOn) {
      focusOn('proposal.title');
      $scope.userLocation = userLocation;
      $scope.account = Auth.glue($scope, 'account');

      $scope.languages = Config.PROPOSAL_LANGUAGES;
      $scope.levels    = Config.PROPOSAL_LEVELS;
    })
    .controller('EditProposalController', function($scope, FormErrors, Validator, Proposals, currentProposal) {
      $scope.proposal = currentProposal;
      $scope.$on('auth:changed', $scope.home);

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'proposals/edit_proposal')
                 .then(Proposals.saveIt)
                 .then($scope.home)
                 .catch(FormErrors.set);
      };
    })
    .controller('NewProposalController', function($scope, FormErrors, Validator, Proposals, currentProposal) {
      $scope.proposal = currentProposal;
      $scope.$watch('proposal', Proposals.localSave);

      $scope.authorsOption = null;

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'proposals/new_proposal')
                 .then(Proposals.post)
                 .then(Proposals.localForget)
                 .then($scope.home)
                 .catch(FormErrors.set);
      };

    })
    .controller('NewProposalAuthorController', function($scope, AuthModal, focusOn) {
      $scope.signup = {};

      $scope.openLoginModal = AuthModal.login;
      $scope.focusName = _.partial(focusOn, 'person.name');
    });
})();
