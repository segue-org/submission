(function() {
  "use string";

  angular
    .module("segue.submission.authenticate",[
      "ngDialog",

      "segue.submission",
      "segue.submission.authenticate.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('authenticate', {
          url: '^/authenticate',
          views: {
            "header": { templateUrl: 'modules/common/nav.html' },
            "main":   { template: '<fieldset ui-view="left"></fieldset><fieldset ui-view="right"></fieldset>' },
            "left@authenticate":  { controller: 'LoginController',  templateUrl: 'modules/Authenticate/login.html' },
            "right@authenticate": { controller: 'SignUpController', templateUrl: 'modules/Authenticate/signup.html' }
          }
        });
    });

  angular
    .module("segue.submission.authenticate.controller", [
      "segue.submission.directives",
      "segue.submission.authenticate.directive",
      "segue.submission.authenticate.service",
    ])
    .controller("LoginController", function($scope, $state, Auth, focusOn) {
      $scope.login = {};

      function succeed(account) {
        if ($scope.closeThisDialog) {
          $scope.closeThisDialog();
        }
        else {
          $scope.home();
        }
      }
      $scope.tryLogin = function() {
        Auth.login($scope.login.email, $scope.login.password)
            .then(succeed);
      };
      focusOn('login.email', 400);
    })
    .controller("SignUpController", function($scope) {
    })
    .factory('AuthModal', function (ngDialog) {
      var loginConfig  = { controller: "LoginController",  template: 'modules/Authenticate/login.html' };
      var signupConfig = { controller: "SignUpController", template: 'modules/Authenticate/signup.html' };
      return {
        login:  function() { ngDialog.open(loginConfig);  return true; },
        signup: function() { ngDialog.open(signupConfig); return true; }
      };
    });
})();
