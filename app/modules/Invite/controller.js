(function() {
  "use strict";

  angular
    .module("segue.submission.invite",[
      "segue.submission.directives",
      "segue.submission.invite.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('invite', {
          abstract: true,
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
          },
        })
        .state('invite.register', {
          parent: 'invite',
          url: '^/proposal/:proposal_id/invite/:hash/register',
          views: {
            "main@": { templateUrl: 'modules/Invite/register.html', controller: 'RegisterInviteController' }
          },
          resolve: {
            invite: function(Invites, $stateParams) {
              return Invites.of($stateParams.proposal_id).one($stateParams.hash).get();
            }
          }

        })
        .state('invite.answer', {
          parent: 'invite',
          url: '^/proposal/:proposal_id/invite/:hash/answer',
          views: {
            "main@": { templateUrl: 'modules/Invite/answer.html', controller: 'AnswerInviteController' }
          },
          resolve: {
            invite: function(Invites, $stateParams) {
              return Invites.of($stateParams.proposal_id).one($stateParams.hash).get();
            }
          }
        });
    });

  angular
    .module("segue.submission.invite.controller",[
      "segue.submission.invite.service",
      "segue.submission.authenticate.controller"
    ])
    .controller("RegisterInviteController", function($scope, Validator, Auth, Account, FormErrors, invite, focusOn) {
      Auth.logout();
      $scope.signup = { name: invite.name, email: invite.recipient };

      focusOn('signup.name', 100);

      function finishedSignUp(signup) {
        Auth.login($scope.signup.email, $scope.signup.password);
        $scope.signup = null;
        $scope.home();
      }

      $scope.submit = function() {
        Validator.validate($scope.signup, 'accounts/signup')
                 .then(Account.post)
                 .then(Account.localForget)
                 .then(finishedSignUp)
                 .catch(FormErrors.set);
      };
    })
    .controller("AnswerInviteController", function($scope, $state, Auth, AuthModal, Invites, invite) {
      Auth.logout();

      $scope.account = Auth.glue($scope, 'account');
      $scope.invite = invite;

      function retryWithLogin() {
        AuthModal.login().closePromise.then(function(data) {
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.accept();
        });
      }
      function moveToNextState(invite) {
        if ($scope.account) { $scope.home(); }
        else { $state.go('invite.register', $state.params); }
      }

      $scope.accept  = function() {
        Invites.accept(invite)
               .then(moveToNextState)
               .catch(retryWithLogin);
      };
      $scope.decline = _.partial(Invites.decline, invite);
    });
})();
