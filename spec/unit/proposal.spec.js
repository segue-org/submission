(function() {
  "use strict";

  var $scope;

  var mockValidator = noopMock('validate');
  var mockService   = noopMock('post', 'localSave');
  var mockUserLocation = { city: 'Porto Alegre' };
  var mockProposal  = { fake: 'fields', everywhere: 'because it is a mock' };
  var mockErrors    = { errors: [ { complex: 'object' }, { but: 'is mocked' } ] };

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
    beforeEach(module('ui.router'));
    beforeEach(module('segue.submission.proposal.controller'));
    beforeEach(module('segue.submission.proposal.service'));
    beforeEach(loadQ);

    beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
    }));


    describe("there is a saved pending proposal", function() {
      beforeEach(function() {
        spyOn(mockService, 'localSave');
      });
      beforeEach(loadController);

      it("saved proposal gets updated automatically", function() {
        $scope.proposal.title = "modified";
        $scope.$digest();

        expect(mockService.localSave).toHaveBeenCalledWith($scope.proposal, jasmine.any(Object), jasmine.any(Object));
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

  describe("proposal service", function() {
    var mockStorage = {};
    var mockAuth = noopMock('account');
    var http, service;

    beforeEach(mockDep('$localStorage', 'ngStorage').toBe(mockStorage));
    beforeEach(mockDep('Auth', 'segue.submission.authenticate.service').toBe(mockAuth));
    beforeEach(module('segue.submission.proposal.service'));

    beforeEach(inject(function(_$httpBackend_, Proposals) {
      service = Proposals;
      http = _$httpBackend_;
    }));

    it("gets list of proposals owned by the currently logged account", function(done) {
      spyOn(mockAuth, 'account').and.returnValue({ id: 123 });
      var response = { items: [ 1,2,3 ] };
      http.expectGET('http://192.168.33.91:5000/api/proposals?owner_id=123').respond(200, response);

      var promise = service.getOwnedByAccount();

      promise.then(function(value) {
        expect(value).toEqual([1,2,3]);
        done();
      });

      http.flush();
    });

  });


})();
