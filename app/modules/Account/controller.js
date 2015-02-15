(function() {
  "use strict";

  angular
    .module("segue.submission.account",[
      "ngDialog",

      "segue.submission",
      "segue.submission.account.controller"
    ]);

  angular
    .module("segue.submission.account.controller",[
      "segue.submission.account.service"
    ])
    .controller("SignUpController", function($scope, Account, Auth, Validator, FormErrors, focusOn) {
      $scope.signup = Account.localLoad();
      $scope.$watch('signup', Account.localSave);

      function finishedSignUp() {
        $scope.signup = null;
        // HACK: ugly hack to ensure we are not inside the proposal creation form before home()ing
        if ($scope.$parent.accountOption === undefined) {
          $scope.home();
        }
      }

      $scope.submit = function() {
        Validator.validate($scope.signup, 'accounts/signup')
                 .then(Account.post)
                 .then(Account.localForget)
                 .then(_.partial(Auth.login, $scope.signup.email, $scope.signup.password))
                 .then(finishedSignUp)
                 .catch(FormErrors.set);
      };
    });
})();
