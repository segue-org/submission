(function() {
  "use strict";

  angular
    .module('segue.submission.authenticate.directive',[
      'segue.submission.authenticate.service'
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
    .directive("loggedAs", function(Auth) {
      return {
        templateUrl: 'modules/Authenticate/logged-as.html',
        controller: function($scope) {
          $scope.account = Auth.glue($scope,'account');
          $scope.logout  = Auth.logout;
        }
      };
    });
})();
