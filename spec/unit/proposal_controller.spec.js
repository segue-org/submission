(function() {
  "use strict";

  var $scope;
  var $httpBackend;

  var mockValidator = noopMock('validate');
  var mockService   = noopMock('post');
  var mockProposal  = { fake: 'fields', everywhere: 'because it is a mock' };
  var mockErrors    = { errors: [ { complex: 'object' }, { but: 'is mocked' } ] };
  var mockStorage   = {};

  function loadController() {
    inject(function($controller, _$httpBackend_, $state) {
      $controller('NewProposalController', {
        $scope: $scope, $state: $state,
        Proposals: mockService,
        Validator: mockValidator
      });
    });
  }

  describe("new proposal controller", function() {
    beforeEach(mockDep('$localStorage','ngStorage').toBe(mockStorage));
    beforeEach(module('ui.router'));
    beforeEach(module('segue.submission.proposal.controller'));
    beforeEach(module('segue.submission.proposal.service'));

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

      it("valid proposals are posted to the service", inject(function(ProposalBuilder) {
        spyOn(mockValidator,'validate').and.callFake(pipeArg().toPromise);
        spyOn(mockService,'post');

        $scope.proposal = mockProposal;
        $scope.submit();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposal/new_proposal');
        expect(mockService.post).toHaveBeenCalledWith(mockProposal);
      }));

      it("invalid proposals do not get posted to the service, and errors get in the scope", inject(function(ProposalBuilder) {
        spyOn(mockValidator,'validate').and.callFake(pipe(mockErrors).toFailure);
        spyOn(mockService,'post');

        $scope.proposal = mockProposal;
        $scope.submit();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposal/new_proposal');
        expect($scope.errors).toBe(mockErrors);
        expect(mockService.post).not.toHaveBeenCalled();
      }));
    });
  });
})();
