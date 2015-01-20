(function() {
  "use strict";

  var auth, http;
  var mockStorage = {};

  var email = "email@example.com";
  var password = "password";
  var role = "user";
  var id = 123;
  var token = "a token";
  var account = { email: email, id: id, role: role };
  var payload = { email: email, password: password };
  var response = { token: token, account: account };


  describe("authentication services", function() {
    beforeEach(module("segue.submission.authenticate.service"));
    beforeEach(mockDep('$localStorage', 'ngStorage').toBe(mockStorage));
    beforeEach(function() { delete mockStorage.session; });
    beforeEach(inject(function(_$httpBackend_, Auth) {
      auth = Auth;
      http = _$httpBackend_;
    }));

    describe("logout", function() {
      beforeEach(function() {
        http.expectPOST('http://192.168.33.91:5000/api/session', payload)
            .respond(201, response);
        auth.login(email, password);
        http.flush();
      });
      it("account is cleared",function() {
        auth.logout();

        expect(auth.account()).toBe(undefined);
      });
      it("token is cleared",function() {
        auth.logout();

        expect(auth.token()).toBe(undefined);
      });
    });

    describe("login", function() {

      it("correct login, creates session", function() {
        http.expectPOST('http://192.168.33.91:5000/api/session', payload)
            .respond(201, response);

        auth.login(email, password);
        http.flush();

        expect(auth.token()).toEqual(token);
        expect(auth.account()).toEqual(account);
      });
      it("wrong login, no session", function() {
        http.expectPOST('http://192.168.33.91:5000/api/session', payload)
            .respond(401, {});

        auth.login(email, password);
        http.flush();

        expect(auth.account()).toBe(undefined);
      });
    });
  });
})();
