(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
      'segue.submission.directives',
      'segue.submission.libs',
      'segue.submission.errors',
      'segue.submission.proposal.controller',
      'segue.submission.proposal.service',
      'segue.submission.authenticate',
      'ngDialog'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('proposal', {
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { template:    "<div ui-view='form'></div>", controller: 'ProposalController' }
          },
          resolve: {
            tracks: function(Tracks) { return Tracks.getList(); },
            cfpState: function(Proposals) { return Proposals.cfpState(); }
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
            },
            invites: function(Proposals, $stateParams) {
              return Proposals.one($stateParams.id).getList('invites');
            }
          }
        });
    });

  angular
    .module('segue.submission.proposal.controller', ['segue.submission.proposal'])
    .controller('ProposalController', function($scope, Config, Auth, cfpState, tracks, focusOn) {
      focusOn('proposal.title');
      $scope.credentials = Auth.glue($scope, 'credentials');

      $scope.languages = Config.PROPOSAL_LANGUAGES;
      $scope.levels    = Config.PROPOSAL_LEVELS;
      $scope.tracks    = tracks;
      $scope.cfpState  = cfpState;
    })
    .controller('NewProposalController', function($scope, ngDialog,
                                                  FormErrors, Validator, Proposals,
                                                  currentProposal) {
      $scope.proposal = currentProposal;
      $scope.$watch('proposal', Proposals.localSave);

      $scope.newInvites = [];

      $scope.isDirty = function() {
        return $scope.credentials && (($scope.proposal_form.$dirty) || ($scope.newInvites.length > 0));
      };

      $scope.canInviteMore = function() {
        return (1 + $scope.newInvites.length) < 5;
      };

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'proposals/new_proposal')
                 .then(Proposals.post)
                 .then(Proposals.createInvites($scope.newInvites))
                 .then(Proposals.localForget)
                 .then($scope.home)
                 .catch(FormErrors.set);
      };

      $scope.openInviteModal = function() {
        var inviteConfig = { controller: "NewInviteController", template: 'modules/Proposal/invite.html' };
        var dialog = ngDialog.open(inviteConfig);
        return dialog.closePromise.then(function(data) {
          FormErrors.clear();
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.newInvites.push(data.value);
        });
      };
    })
    .controller('NewProposalAuthorController', function($scope, AuthModal, focusOn) {
      $scope.signup = {};

      $scope.openLoginModal = AuthModal.login;
      $scope.focusName = _.partial(focusOn, 'person.name');
    })
    .controller('NewInviteController', function($scope, FormErrors, Validator, focusOn) {
      $scope.invite = {};
      $scope.submitInvite = function() {
        return Validator.validate($scope.invite, 'proposals/new_invite')
                        .then($scope.closeThisDialog)
                        .catch(FormErrors.set);
      };
      focusOn('invite.recipient');
    })
    .controller('EditProposalController', function($scope, ngDialog,
                                                   FormErrors, Validator, Proposals,
                                                   currentProposal, invites) {
      $scope.proposal = currentProposal;
      $scope.proposal.track_id = (currentProposal.track)? currentProposal.track.id : null;
      $scope.invites = invites;
      $scope.newInvites = [];

      $scope.$on('auth:changed', $scope.home);

      $scope.isDirty = function() {
        return $scope.credentials && (($scope.proposal_form.$dirty) || ($scope.newInvites.length > 0));
      };
      $scope.canInviteMore = function() {
        return (1 + $scope.invites.length + $scope.newInvites.length) < 5;
      };

      $scope.submit = function() {
        Validator.validate($scope.proposal, 'proposals/edit_proposal')
                 .then(Proposals.saveIt)
                 .then(Proposals.createInvites($scope.newInvites))
                 .then($scope.home)
                 .catch(FormErrors.set);
      };

      $scope.openInviteModal = function() {
        var inviteConfig = { controller: "NewInviteController", template: 'modules/Proposal/invite.html' };
        var dialog = ngDialog.open(inviteConfig);
        return dialog.closePromise.then(function(data) {
          FormErrors.clear();
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.newInvites.push(data.value);
        });
      };

    });
})();
