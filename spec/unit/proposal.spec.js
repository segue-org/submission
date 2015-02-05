(function() {
  "use strict";

  var $scope;

  var mockValidator = noopMock('validate');
  var mockService   = noopMock('post', 'saveIt', 'localSave');
  var mockUserLocation = { city: 'Porto Alegre' };
  var mockProposal  = { fake: 'fields', everywhere: 'because it is a mock' };
  var mockErrors    = { errors: [ { complex: 'object' }, { but: 'is mocked' } ] };

  var mockFormErrors = noopMock('set');

  function loadController(controllerName) {
    return function() {
      inject(function($controller, $state) {
        $controller(controllerName, {
          $scope: $scope,
          FormErrors: mockFormErrors,
          Validator: mockValidator,
          Proposals: mockService,
          currentProposal: mockProposal
        });
      });
    };
  }
  describe("edit proposal controller", function() {
    beforeEach(module('ui.router'));
    beforeEach(module('segue.submission.proposal.controller'));
    beforeEach(module('segue.submission.proposal.service'));
    beforeEach(loadQ);
    beforeEach(inject(function($rootScope) {
      $scope = $rootScope.$new();
      $scope.home = jasmine.createSpy()
    }));

    describe("editing a proposal", function() {
      beforeEach(loadController('EditProposalController'));

      it("valid proposals are put to the service", function() {
        spyOn(mockValidator,'validate').and.returnValue(when(mockProposal));
        spyOn(mockFormErrors,'set');
        spyOn(mockService,'saveIt');

        $scope.proposal = mockProposal;
        $scope.submit();
        $scope.$apply();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposals/edit_proposal');
        expect(mockService.saveIt).toHaveBeenCalledWith(mockProposal);
        expect(mockFormErrors.set).not.toHaveBeenCalled();
      });

      it("invalid proposals set FormErrors", function() {
        spyOn(mockValidator,'validate').and.returnValue(fail(mockErrors));
        spyOn(mockFormErrors,'set');
        spyOn(mockService,'saveIt');

        $scope.proposal = mockProposal;
        $scope.submit();
        $scope.$apply();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposals/edit_proposal');
        expect(mockService.saveIt).not.toHaveBeenCalled();
        expect(mockFormErrors.set).toHaveBeenCalledWith(mockErrors);
      });
    });
  });


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
      beforeEach(loadController('NewProposalController'));

      it("saved proposal gets updated automatically", function() {
        $scope.proposal.title = "modified";
        $scope.$digest();

        expect(mockService.localSave).toHaveBeenCalledWith($scope.proposal, jasmine.any(Object), jasmine.any(Object));
      });
    });

    describe("submitting a new proposal", function() {
      beforeEach(loadController('NewProposalController'));

      it("valid proposals are posted to the service", function() {
        spyOn(mockValidator,'validate').and.returnValue(when(mockProposal));
        spyOn(mockFormErrors,'set');
        spyOn(mockService,'post');

        $scope.proposal = mockProposal;
        $scope.submit();
        $scope.$apply();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposals/new_proposal');
        expect(mockService.post).toHaveBeenCalledWith(mockProposal);
        expect(mockFormErrors.set).not.toHaveBeenCalled();
      });

      it("invalid proposals do not get posted to the service, and errors get in the scope", function() {
        spyOn(mockValidator,'validate').and.returnValue(fail(mockErrors));
        spyOn(mockFormErrors, 'set');
        spyOn(mockService,'post');

        $scope.proposal = mockProposal;
        $scope.submit();
        $scope.$apply();

        expect(mockValidator.validate).toHaveBeenCalledWith(mockProposal, 'proposals/new_proposal');
        expect(mockService.post).not.toHaveBeenCalled();
        expect(mockFormErrors.set).toHaveBeenCalledWith(mockErrors);
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

    it("saves a passed proposal (inverted control)", function(done) {
      var proposal;
      var firstResponse  = { resource: { 'id': 456, 'title': 'xitle' } };
      var secondResponse = { resource: { 'id': 456, 'title': 'mitle' } };
      http.expectGET('http://192.168.33.91:5000/api/proposals/456').respond(200, firstResponse);
      http.expectPUT('http://192.168.33.91:5000/api/proposals/456').respond(200, secondResponse);

      service.one(456).get().then(function(existing) {
        expect(existing.title).toEqual('xitle');
        return service.saveIt(existing);
      }).then(function(modified) {
        expect(modified.title).toEqual('mitle');
        done();
      });

      http.flush();
    });

    it("gets list of proposals owned by the currently logged account", function(done) {
      spyOn(mockAuth, 'account').and.returnValue({ id: 123 });
      var response = { items: [ 1,2,3 ] };
      http.expectGET('http://192.168.33.91:5000/api/proposals?owner_id=123').respond(200, response);

      service.getOwnedByAccount().then(function(value) {
        expect(value).toEqual([1,2,3]);
        done();
      });

      http.flush();
    });

  });


})();
