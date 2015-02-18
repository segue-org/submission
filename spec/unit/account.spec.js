(function() {
  "use strict";

  var $scope;

  var mockAuth = noopMock('login');
  var mockService = noopMock('post','localLoad','localForget');
  var mockValidator = noopMock('validate');
  var mockFormErrors = noopMock('set','clear');

  function loadController(controllerName) {
    return function() {
      inject(function($controller) {
        $controller(controllerName, {
          $scope: $scope,
          FormErrors: mockFormErrors,
          Validator: mockValidator,
          Auth: mockAuth,
          Account: mockService,
          focusOn: jasmine.createSpy()
        });
      });
    };
  }
  describe("signup controller", function() {
    var signup = { email: 'xoxanga@xinga.com', password: 'xingalinga' };
    beforeEach(module('ui.router'));
    beforeEach(module('segue.submission.account.controller'));
    beforeEach(loadQ);
    beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
      $scope.home = jasmine.createSpy();
      spyOn(mockService, 'localLoad').and.returnValue(signup);
    }));

    beforeEach(loadController('SignUpController'));

    it("loads signup data from users machine", function() {
      expect(mockService.localLoad).toHaveBeenCalled();
      expect($scope.signup).toEqual(signup);
    });


    it("validates, post, forgets local, logs in, and sends home", function() {
      spyOn(mockValidator, 'validate').and.returnValue(when(signup));
      spyOn(mockService, 'post');
      spyOn(mockService, 'localForget');
      spyOn(mockAuth, 'login');
      spyOn(mockFormErrors, 'set');

      $scope.submit();
      $scope.$apply();

      expect(mockValidator.validate).toHaveBeenCalledWith(signup, 'accounts/signup');
      expect(mockService.post).toHaveBeenCalledWith(signup);
      expect(mockService.localForget).toHaveBeenCalled();
      expect(mockAuth.login).toHaveBeenCalledWith(signup.email, signup.password);
      expect(mockFormErrors.set).not.toHaveBeenCalled();
      expect($scope.home).toHaveBeenCalled();
    });

  });


})();
