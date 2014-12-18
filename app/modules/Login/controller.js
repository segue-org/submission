(function() {
  "use string";

  angular
    .module("segue.submission.login",[
      "segue.submission"
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
    })
    .controller("LoginController", function() {
    });
})();
