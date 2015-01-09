(function() {
  "use strict";

  var auth, session, http;
  var mockStorage = {};

  describe("login services", function() {
    beforeEach(module("segue.submission.login.service"));
    beforeEach(mockDep('$localStorage', 'ngStorage').toBe(mockStorage));
    beforeEach(function() { delete mockStorage.auth; });
    beforeEach(inject(function(_$httpBackend_, Auth, Session) {
      auth = Auth;
      session = Session;
      http = _$httpBackend_;
    }));

    describe("loading & saving from storage", function() {
      beforeEach(function() {
        mockStorage.auth = { token: 'token', account: 'account' };
      });

      it("loads logged account from storage", function() {
        expect(auth.isLogged()).toBe(true);
        expect(session.current()).toBe(mockStorage.auth);
      });

      it("saves logged account to storage", function() {
        session.current({ token: 'another token', account: 'another account' });
        expect(mockStorage.auth.token).toBe('another token');
        expect(mockStorage.auth.account).toBe('another account');
      });
    });

    describe("sign up", function() {
      var token = "le-token";
      var account = "le-account";
      var email = "email@example.com";
      var password = "le-passsword";

      it("if account is successfully created, log the user", function() {
        var payload = { email: email, password: password };
        var response = { token: token, account: account };

        http.expectPOST('http://localhost:5000/api/account', payload)
            .respond(201, response);

        auth.signUp(email, password);
        http.flush();

        expect(auth.isLogged()).toBe(true);
        expect(session.current().token).toBe(token);
        expect(session.current().account).toBe(account);
      });

      it("if creation fails, do not log user", function() {
        var payload = { email: email, password: password };
        var response = { token: token, account: account };

        http.expectPOST('http://localhost:5000/api/account', payload)
            .respond(400, response);

        auth.signUp(email, password);
        http.flush();

        expect(auth.isLogged()).toBe(false);
        expect(session.current()).toEqual({})
      });
    });
  });
})();
