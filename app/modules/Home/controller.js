(function() {
  "use strict";

  angular
    .module('segue.submission.home', [
      'segue.submission.authenticate.service',
      'segue.submission.proposal.service',
      'segue.submission.purchase.service',
      'segue.submission.caravan.service',
      'segue.submission.home.controller'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '^/home?caravan_hash',
          views: {
            header: {                               templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'HomeController', templateUrl: 'modules/Home/home.html'  }
          },
          resolve: {
            myCaravan:        function(Caravans)  { return Caravans.getOwnedByCredentials(); },
            myProposals:      function(Proposals) { return Proposals.getOwnedByCredentials(); },
            myInvites:        function(Proposals) { return Proposals.getByCoAuthors(); },
            myPurchases:      function(Purchases) { return Purchases.getOwnedByCredentials(); },
            currentProposal:  function(Proposals) { return Proposals.current(); },
            signup:           function(Account)   { return Account.get(); },
            cfpState:         function(Proposals) { return Proposals.cfpState(); },
            purchaseMode:     function(Purchases) { return Purchases.purchaseMode(); }
          }
        });

    });
  angular
    .module('segue.submission.home.controller', [])
    .controller('HomeController', function($scope, $state, $stateParams, $window,
                                           Auth, Proposals, Purchases, Account,
                                           myPurchases, myProposals, myInvites, myCaravan,
                                           currentProposal, signup, cfpState,
                                           Validator, FormErrors, purchaseMode, ngToast) {
      if (!Auth.credentials()) { $state.go('splash'); }

      $scope.purchaseMode    = purchaseMode;
      $scope.myCaravan       = myCaravan;
      $scope.myPurchases     = myPurchases;
      $scope.myProposals     = myProposals;
      $scope.myInvites       = myInvites;
      $scope.currentProposal = (_.isEmpty(currentProposal))? null : currentProposal;
      $scope.caravan_hash    = $stateParams.caravan_hash;
      $scope.cfpState        = cfpState;
      $scope.lockEmail = true;
      $scope.signup = signup;

      $scope.today = new Date();

      $scope.hasCaravan = _.has(myCaravan, '$type');
      $scope.isCaravan = _.has($stateParams, 'caravan_hash') && !_.isUndefined($stateParams.caravan_hash);

      if (_.has($scope.signup, 'country')) {
        $scope.signup[Account.getDocumentField($scope.signup.country)] = $scope.signup.document;
      }

      $scope.removeCurrent = function(ev) {
        $scope.currentProposal = null;
        Proposals.localForget();
        ev.stopPropagation();
      };

      $scope.payment = { method: null };

      $scope.clonePayment = function(purchaseObject) {
        purchaseObject.post('clone')
                      .then($state.reload);
      };

      var to_date = function(strDate) {
        return new Date(strDate);
      };

      $scope.doPayment = function(purchaseObject, method) {
        purchaseObject.post('pay/' + method)
                      .then(Purchases.followPaymentInstructions);
      };

      $scope.canStartPayment = function(purchaseObject) {
        return $scope.purchaseMode == 'online' &&
               $scope.isPending(purchaseObject) &&
               $scope.paymentMethodIsBlank() &&
               $scope.isTimely(purchaseObject);
      };

      $scope.isExpired = function(purchaseObject) {
        return $scope.isPending(purchaseObject) &&
               $scope.paymentMethodIsBlank() &&
               !$scope.isTimely(purchaseObject);
      };

      $scope.isPending = function(purchaseObject) {
        return purchaseObject.status == 'pending';
      };

      $scope.isTimely = function(purchaseObject) {
        var today = new Date();
        return to_date(purchaseObject.product.sold_until) >= today;
      };

      $scope.paymentMethodIsBlank = function() {
        return $scope.payment.method === null;
      };

      $scope.submit = function() {
        Validator.validate($scope.signup, 'accounts/edit_account')
                 .then(Account.saveIt)
                 .then($scope.home)
                 .then(ngToast.create('alterações salvas com sucesso.'))
                 .catch(FormErrors.set);
      };

      $scope.$on('auth:changed', $scope.home);
    });
})();
