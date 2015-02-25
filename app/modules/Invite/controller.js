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
        .state('invite.answer', {
          parent: 'invite',
          url: '^/proposal/:proposal_id/invite/:hash/answer',
          views: {
            "main@": { templateUrl: 'modules/Invite/invite.html', controller: 'InviteController' }
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
      "segue.submission.invite.service"
    ])
    .controller("InviteController", function($scope, Auth, Invites, invite) {
      Auth.logout();
      $scope.invite = invite;

      $scope.accept  = _.partial(Invites.accept, invite);
      $scope.decline = _.partial(Invites.decline, invite);
    });
})();
