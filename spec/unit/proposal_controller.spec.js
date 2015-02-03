(function() {
  "use strict";

  var $scope;

  var mockValidator = noopMock('validate');
  var mockService   = noopMock('post');
  var mockUserLocation = { city: 'Porto Alegre' };
  var mockProposal  = { fake: 'fields', everywhere: 'because it is a mock' };
  var mockErrors    = { errors: [ { complex: 'object' }, { but: 'is mocked' } ] };
  var mockStorage   = {};

  function loadController() {
    inject(function($controller, $state) {
      $controller('NewProposalController', {
        $scope: $scope, $state: $state,
        Proposals: mockService,
        Validator: mockValidator,
        currentProposal: mockProposal,
        userLocation: mockUserLocation,
      });
    });
  }

  describe("new proposal controller", function() {
    beforeEach(mockDep('$localStorage','ngStorage').toBe(mockStorage));
    beforeEach(module('ui.router'));
    beforeEach(module('segue.submission.proposal.controller'));
    beforeEach(module('segue.submission.proposal.service'));
    beforeEach(loadQ);

    beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
    }));


    describe("there is a saved pending proposal", function() {
      beforeEach(function() {
        mockStorage.savedProposal = mockProposal;
      });
      beforeEach(loadController);

      it("loads the saved proposal into the scope", function() {
        expect($scope.proposal).toBe(mockProposal);
      });
      it("saved proposal gets updated automatically", function() {
        $scope.proposal.title = "modified";
        $scope.$digest();

        expect(mockStorage.savedProposal.title).toBe("modified");
      });
    });

    describe("submitting a new proposal", function() {
      beforeEach(loadController);

      it("valid proposals are posted to the service", function() {
        spyOn(mockValidator,'validate').and.returnValue(when(mockProposal));
        spyOn(mockService,'post');

        $scope.proposal = mockProposal;
        $scope.submit();
        $scope.$apply();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposals/new_proposal');
        expect(mockService.post).toHaveBeenCalledWith(mockProposal);
      });

      it("invalid proposals do not get posted to the service, and errors get in the scope", function() {
        spyOn(mockValidator,'validate').and.returnValue(fail(mockErrors));
        spyOn(mockService,'post');

        $scope.proposal = mockProposal;
        $scope.submit();
        $scope.$apply();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposals/new_proposal');
        expect($scope.errors).toBe(mockErrors);
        expect(mockService.post).not.toHaveBeenCalled();
      });
    });
  });
})();
