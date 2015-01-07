(function() {
  "use strict";

  var $scope;
  var $httpBackend;

  var mockValidator = noopMock('validate');
  var mockProposals = noopMock('post');

  beforeEach(module('ui.router'));

  beforeEach(module('segue.submission.proposal.controller'));
  beforeEach(module('segue.submission.proposal.service'));

  beforeEach(inject(function($rootScope) {
    $scope = $rootScope.$new();
  }));

  beforeEach(function() {
    inject(function($controller, _$httpBackend_, $state) {
      $controller('ProposalController', {
        $scope: $scope, $state: $state,
        Proposals: mockProposals,
        Validator: mockValidator
      });
    });
  });


  describe("submitting a new proposal", function() {
    it("tilts", inject(function(ProposalBuilder, $q) {
      spyOn(mockValidator,'validate').and.callFake(function(data,schema) {
        return { then: function(success, fail) { success(data); } }
      });
      spyOn(mockProposals,'post');

      $scope.proposal = ProposalBuilder.faked();
      $scope.submit();

      expect(mockValidator.validate).toHaveBeenCalledWith($scope.proposal, 'new_proposal');
      expect(mockProposals.post).toHaveBeenCalledWith($scope.proposal);
    }));
  });

})();
