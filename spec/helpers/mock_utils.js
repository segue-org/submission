var Q;

function loadQ() {
  // NOTE: this can only be run after all module() calls
  return inject(function($q) {
    Q = $q;
  });
}

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

function when(v) {
  var deferred = Q.defer();
  deferred.resolve(v);
  return deferred.promise;
}
function fail(v) {
  var deferred = Q.defer();
  deferred.reject(v);
  return deferred.promise;
}
