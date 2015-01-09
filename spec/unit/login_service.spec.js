(function() {
  "use strict";

  var auth, http;
  var mockStorage = {};

  describe("authentication services", function() {
    beforeEach(module("segue.submission.login.service"));
    beforeEach(mockDep('$localStorage', 'ngStorage').toBe(mockStorage));
    beforeEach(function() { delete mockStorage.session; });
    beforeEach(inject(function(_$httpBackend_, Auth) {
      auth = Auth;
      http = _$httpBackend_;
    }));

    describe("login", function() {
      var email = "email@example.com";
      var password = "password";
      var role = "user";
      var id = 123;
      var token = "a token";
      var account = { email: email, id: id, role: role };
      var payload = { email: email, password: password };
      var response = { token: token, account: account }

      it("correct login, creates session", function() {
        http.expectPOST('http://localhost:5000/api/session', payload)
            .respond(201, response);

        auth.login(email, password);
        http.flush();

        expect(auth.account()).toEqual(account);
      });
    });
  });
})();
