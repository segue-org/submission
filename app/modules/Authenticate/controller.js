(function() {
  "use string";

  angular
    .module("segue.submission.authenticate",[
      "ngDialog",

      "segue.submission",
      "segue.submission.authenticate.controller",
      "segue.submission.account.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('authenticate', {
          url: '^/authenticate',
          views: {
            "header": { templateUrl: 'modules/common/nav.html' },
            "main":   { templateUrl: 'modules/Authenticate/master.html' },
            "left@authenticate":  { controller: 'LoginController',  templateUrl: 'modules/Authenticate/login.html' },
            "right@authenticate": { controller: 'SignUpController', templateUrl: 'modules/Account/signup.html' }
          },
        })
        .state('forgot', {
          url: '^/forgot/{email}',
          views: {
            "header": {                                         templateUrl: 'modules/common/nav.html' },
            "main":   { controller: 'ForgotPasswordController', templateUrl: 'modules/Authenticate/forgot.html' },
          }
        });
    });

  angular
    .module("segue.submission.authenticate.controller", [
      "segue.submission.directives",

      "segue.submission.errors",
      "segue.submission.authenticate.directive",
      "segue.submission.authenticate.service",
    ])
    .controller("ForgotPasswordController", function($scope, $stateParams, Account, FormErrors, focusOn) {
      $scope.forgot = { email: $stateParams.email };
      $scope.sent = false;
      focusOn("forgot.email", 100);

      function markAsSent() {
        $scope.sent = true;
      }

      $scope.askReset = function() {
        Account.askReset($scope.forgot)
               .then(markAsSent)
               .catch(FormErrors.set);
      };
    })
    .controller("LoginController", function($scope, $state, Auth, focusOn) {
      $scope.login = {};

      function succeed(credentials) {
        if ($scope.closeThisDialog) {
          $scope.closeThisDialog(credentials);
        }
        else {
          $scope.home();
        }
      }
      $scope.tryLogin = function() {
        Auth.login($scope.login.email, $scope.login.password)
            .then(succeed);
      };

      $scope.forgotPassword = function() {
        $state.go('forgot', { email: $scope.login.email });
      };
    })

    .factory('AuthModal', function (ngDialog) {
      var loginConfig  = { controller: "LoginController",  template: 'modules/Authenticate/login.html' };
      return {
        login:  function() { return ngDialog.open(loginConfig); }
      };
    });
})();
