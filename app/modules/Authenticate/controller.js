(function() {
  "use string";

  angular
    .module("segue.submission.authenticate",[
      "segue.submission",
      "segue.submission.authenticate.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('authenticate', {
          url: '^/authenticate',
          views: {
            "header": { templateUrl: 'modules/common/nav.html' },
            "main":   { template: '<section ui-view="left"></section><section ui-view="right"></section>' },
            "left@authenticate":  { controller: 'LoginController',  templateUrl: 'modules/Authenticate/login.html' },
            "right@authenticate": { controller: 'SignUpController', templateUrl: 'modules/Authenticate/signup.html' }
          }
        });
    });

  angular
    .module("segue.submission.authenticate.controller", [])
    .controller("LoginController", function($scope) {
    })
    .controller("SignUpController", function($scope) {
    });
})();
