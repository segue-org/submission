(function() {
  "use strict";

  var auth, session, http;

  describe("login services", function() {
    beforeEach(module("segue.submission.login.service"));
    beforeEach(inject(function(_$httpBackend_, Auth, Session) {
      auth = Auth;
      session = Session;
      http = _$httpBackend_;
    }));

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
