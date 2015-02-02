(function() {
  "use strict";

  angular
    .module("segue.submission.directives", [ 'segue.submission' ])
    .directive("focusable", function($timeout) {
      return function(scope, elem, attr) {
        var myName = attr.focusable || attr.ngModel;
        console.log('building', myName);
        scope.$on('focus-on', function(e, name) {
          console.log(name, myName);
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
          console.log('signaling', name);
          $rootScope.$broadcast('focus-on', name);
        }, timeout || 100);
      };
    });
})();
