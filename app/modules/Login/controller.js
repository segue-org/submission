(function() {
  "use string";

  angular
    .module("segue.submission.login",[
      "segue.submission",
      "segue.submission.login.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('login', {
          url: '^/login',
          views: {
            header: {                                templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'LoginController', templateUrl: 'modules/Login/form.html' }
          }
        });
    });

  angular
    .module("segue.submission.login.controller", [])
    .controller("LoginController", function($scope) {

      $scope.tryLogin = function() {
      };

      $scope.forgot = function() {
      };
    });
})();
