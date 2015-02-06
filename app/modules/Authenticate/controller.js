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

      "segue.submission.libs",
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
    })
    .controller("SignUpController", function($scope, Account, Validator, FormErrors, focusOn) {
      $scope.signup = Account.localLoad();
      $scope.$watch('signup', Account.localSave);
      $scope.submit = function() {
        console.log($scope.signup);
        Validator.validate($scope.signup, 'accounts/signup')
                 .then(Account.post)
                 .then($scope.home)
                 .catch(FormErrors.set);
      };
      focusOn("signup.name");
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
