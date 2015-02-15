(function() {
  "use strict";

  var $scope;

  var mockValidator = noopMock('validate');
  var mockFormErrors = noopMock('set','clear');

  function loadController(controllerName) {
    return function() {
      inject(function($controller, $state) {
        $controller(controllerName, {
          $scope: $scope,
          ngDialog: mockDialog,
          FormErrors: mockFormErrors,
          Validator: mockValidator,
        });
      });
    };
  }
  describe("signup controller", function() {
    beforeEach(module('ui.router'));
    beforeEach(module('segue.submission.account.controller'));
    beforeEach(loadQ);
    beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
    }));

    beforeEach(loadController('SignUpController'));

  });


})();
