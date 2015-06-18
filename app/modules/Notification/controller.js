(function() {
  "use strict";

  angular
    .module("segue.submission.notification",[
      "segue.submission.directives",
      "segue.submission.notification.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('notification', {
          abstract: true,
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
          },
        })
        .state('notification.answer', {
          parent: 'notification',
          url: '^/notification/:hash/:type/answer',
          views: {
            "main@": { templateUrl: 'modules/Notification/answer.html', controller: 'NotificationController' }
          },
          resolve: {
            notification: function(Notifications, $stateParams) { return Notifications.get($stateParams.hash); }
          }
        });
    });

  angular
    .module("segue.submission.notification.controller",[
      "segue.submission.notification.service",
    ])
    .controller("NotificationController", function($scope, $state, notification, Notifications) {
      $scope.notification = notification;

      function reload() { $state.reload(); }

      $scope.accept  = function() {
        Notifications.accept(notification.hash).then(reload);
      };
      $scope.decline = function() {
        Notifications.decline(notification.hash).then(reload);
      };
    });
})();
