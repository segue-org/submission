var Q;

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
  return {
    then: function(success, fail) {
      success(v);
    }
  };
}
function fail(v) {
  return {
    then: function(success, fail) {
      fail(v);
    }
  };
}
function pipe(value) {
  return {
    toPromise: function() { return when(value); },
    toFailure: function() { return fail(value); }
  };
}
function pipeArg() {
  return {
    toPromise: function(arg) { return when(arg); },
    toFailure: function(arg) { return fail(arg); }
  };
}
