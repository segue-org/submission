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
            signup:           function(Account)   { return Account.get(); }
          }
        });

    });
  angular
    .module('segue.submission.home.controller', [])
    .controller('HomeController', function($scope, $state, $stateParams,
                                           Auth, Proposals, Purchases, myPurchases, myProposals, myInvites, myCaravan, currentProposal, signup, Account, Validator, FormErrors, ngToast) {
      if (!Auth.credentials()) { $state.go('splash'); }

      $scope.myCaravan       = myCaravan;
      $scope.myPurchases     = myPurchases;
      $scope.myProposals     = myProposals;
      $scope.myInvites       = myInvites;
      $scope.currentProposal = (_.isEmpty(currentProposal))? null : currentProposal;
      $scope.caravan_hash    = $stateParams.caravan_hash;
      $scope.lockEmail = true;
      $scope.signup = signup;
      
      $scope.isMyCaravan = myCaravan.owner_id == $scope.signup.id;
      $scope.hasCaravan = _.has(myCaravan, '$type');
      
      $scope.signup[Account.getDocumentField($scope.signup.country)] = $scope.signup.document;

      $scope.removeCurrent = function(ev) {
        $scope.currentProposal = null;
        Proposals.localForget();
        ev.stopPropagation();
      };
      
      $scope.payment = { method: null };

      $scope.doPayment = function(purchaseObject, method) {
        purchaseObject.post('pay/' + method)
                      .then(Purchases.followPaymentInstructions);
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
