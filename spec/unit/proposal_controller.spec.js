(function() {
  "use strict";

  var $scope;
  var $httpBackend;

  var mockValidator = noopMock('validate');
  var mockService   = noopMock('post');
  var mockProposal  = { fake: 'fields', everywhere: 'because it is a mock' };
  var mockErrors    = { errors: [ { complex: 'object' }, { but: 'is mocked' } ] };

  beforeEach(module('ui.router'));

  beforeEach(module('segue.submission.proposal.controller'));
  beforeEach(module('segue.submission.proposal.service'));

  beforeEach(inject(function($rootScope) {
    $scope = $rootScope.$new();
  }));

  describe("submitting a new proposal", function() {
    beforeEach(function() {
      inject(function($controller, _$httpBackend_, $state) {
        $controller('NewProposalController', {
          $scope: $scope, $state: $state,
          Proposals: mockService,
          Validator: mockValidator
        });
        $scope.proposal = mockProposal;
      });
    });

    it("valid proposals are posted to the service", inject(function(ProposalBuilder) {
      spyOn(mockValidator,'validate').and.callFake(pipeArg().toPromise);
      spyOn(mockService,'post');

      $scope.submit();

      expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'new_proposal');
      expect(mockService.post).toHaveBeenCalledWith(mockProposal);
    }));

    it("invalid proposals do not get posted to the service, and errors get in the scope", inject(function(ProposalBuilder) {
      spyOn(mockValidator,'validate').and.callFake(pipe(mockErrors).toFailure);
      spyOn(mockService,'post');

      $scope.submit();

      expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'new_proposal');
      expect($scope.errors).toBe(mockErrors);
      expect(mockService.post).not.toHaveBeenCalled();
    }));
  });

})();
