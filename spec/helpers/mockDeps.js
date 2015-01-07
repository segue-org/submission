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
