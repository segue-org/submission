(function() {
  "use strict";

  angular
    .module("segue.submission.directives", [ 'segue.submission' ])
    .directive("focusable", function($timeout) {
      return function(scope, elem, attr) {
        var myName = attr.focusable || attr.ngModel;
        scope.$on('focus-on', function(e, name) {
          if(name === myName) {
            $timeout(function() {
              elem[0].focus();
            });
          }
        });
      };
    })
    .factory('focusOn', function ($rootScope, $timeout) {
      return function(name, timeout) {
        $timeout(function (){
          $rootScope.$broadcast('focus-on', name);
        }, timeout || 100);
      };
    })
})();
