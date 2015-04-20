(function() {
  "use strict";

  angular
    .module("segue.submission.caravaninvite",[
      "segue.submission.directives",
      "segue.submission.caravaninvite.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('caravaninvite', {
          abstract: true,
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
          },
        })
        .state('caravaninvite.register', {
          parent: 'caravaninvite',
          url: '^/caravan/:caravan_id/invite/:hash/register',
          views: {
            "main@": { templateUrl: 'modules/CaravanInvite/register.html', controller: 'RegisterCaravanInviteController' }
          },
          resolve: {
            invite: function(CaravanInvites, $stateParams) {
              return CaravanInvites.of($stateParams.caravan_id).one($stateParams.hash).get();
            }
          }

        })
        .state('caravaninvite.answer', {
          parent: 'caravaninvite',
          url: '^/caravan/:caravan_id/invite/:hash/answer',
          views: {
            "main@": { templateUrl: 'modules/CaravanInvite/answer.html', controller: 'AnswerCaravanInviteController' }
          },
          resolve: {
            invite: function(CaravanInvites, $stateParams) {
              return CaravanInvites.of($stateParams.caravan_id).one($stateParams.hash).get();
            }
          }
        });
    });

  angular
    .module("segue.submission.caravaninvite.controller",[
      "segue.submission.caravaninvite.service",
      "segue.submission.authenticate.controller"
    ])
    .controller("RegisterCaravanInviteController", function($scope, $stateParams, $state,
                                                     Validator, Auth, Account, FormErrors, UserLocation, CaravanInvites,
                                                     invite, focusOn) {
      Auth.logout();
      $scope.signup = { name: invite.name, email: invite.recipient };
      $scope.lockEmail = true;
      UserLocation.autobind($scope, 'signup');

      focusOn('signup.name', 100);
      
      function finishedSignUp(signup) {
        Auth.login($scope.signup.email, $scope.signup.password).then(function() {
          $scope.signup = null;
          $state.go('home', { caravan_hash: $stateParams.hash });
        });
      }

      $scope.submit = function() {
        Validator.validate($scope.signup, 'accounts/signup')
                 .then(CaravanInvites.registerInvitee(invite))
                 .then(finishedSignUp)
                 .catch(FormErrors.set);
      };
    })
    .controller("AnswerCaravanInviteController", function($scope, $state, $stateParams, Auth, AuthModal, CaravanInvites, invite) {
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
        if ($scope.account) {
          $state.go('home', { caravan_hash: $stateParams.hash });
        }
        else { $state.go('caravaninvite.register', $state.params); }
      }

      $scope.accept  = function() {
        CaravanInvites.accept(invite)
               .then(moveToNextState)
               .catch(retryWithLogin);
      };
      $scope.decline = _.partial(CaravanInvites.decline, invite);
    });
})();
