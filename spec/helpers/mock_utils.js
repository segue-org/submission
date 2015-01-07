function mockDep(depName, modName) {
  return {
    toBe: function(mock) {
      return function() {
        if (modName) { module(modName); }
        module(function($provide) {
          $provide.value(depName, mock);
        });
      };
    }
  };
}

function noopMock() {
  var self = {};
  for (var i = 0; i < arguments.length; i++) {
    self[arguments[i]] = angular.noop;
  }
  return self;
}
