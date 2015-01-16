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
            "main":   { template: '<fieldset ui-view="left"></fieldset><fieldset ui-view="right"></fieldset>' },
            "left@authenticate":  { controller: 'LoginController',  templateUrl: 'modules/Authenticate/login.html' },
            "right@authenticate": { controller: 'SignUpController', templateUrl: 'modules/Authenticate/signup.html' }
          }
        });
    });

  angular
    .module("segue.submission.authenticate.controller", [
      "segue.submission.authenticate.service",
    ])
    .directive("grabFocus", function($rootScope) {
      return function(scope, element, attrs) {
        element.addClass("normal");
        element.find("*").on("focus", function() {
          element.removeClass("normal");
          element.removeClass("collapsed");
          element.addClass("expanded");
          $rootScope.$broadcast("collapse-others", scope.$id);
          element.one("transitionend", function() { element.addClass("done"); });
        });
        scope.$on("collapse-others", function(event, expandedId) {
          if (expandedId == scope.$id) { return; }
          element.removeClass("normal");
          element.removeClass("expanded");
          element.removeClass("done");
          element.addClass("collapsed");
        });
      };
    })
    .controller("LoginController", function($scope, Auth) {
      $scope.tryLogin = function() {
        Auth.login($scope.email, $scope.password);
      };

    })
    .controller("SignUpController", function($scope) {
    });
})();
