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
      "segue.submission.authenticate.directive",
      "segue.submission.authenticate.service",
    ])
   .controller("LoginController", function($scope, $state, Auth) {
      function succeed(account) {
        if ($scope.closeThisDialog) {
          $scope.closeThisDialog();
        }
        else {
          $state.go('splash');
        }
      }
      $scope.tryLogin = function() {
        Auth.login($scope.email, $scope.password)
            .then(succeed);
      };

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
