(function() {
  "use strict";

  angular
    .module('segue.submission.home', [
      'segue.submission.authenticate.service',
      'segue.submission.proposal.service',
      'segue.submission.home.controller'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '^/home',
          views: {
            header: {                               templateUrl: 'modules/common/nav.html' },
            main:   { controller: 'HomeController', templateUrl: 'modules/Home/home.html'  }
          },
          resolve: {
            myProposals:     function(Proposals) { return Proposals.getOwnedByCredentials(); },
            currentProposal: function(Proposals) { return Proposals.current(); },
            signup:          function(Account)   { return Account.get(); }
          }
        });

    });
  angular
    .module('segue.submission.home.controller', [])
    .controller('HomeController', function($scope, $state,
                                           Auth, Proposals, myProposals, currentProposal, signup, Account, Validator, FormErrors) {
      if (!Auth.credentials()) { $state.go('splash'); }

      $scope.myProposals     = myProposals;
      $scope.currentProposal = (_.isEmpty(currentProposal))? null : currentProposal;
      $scope.lockEmail = true;
      $scope.signup = signup;

      $scope.removeCurrent = function(ev) {
        $scope.currentProposal = null;
        Proposals.localForget();
        ev.stopPropagation();
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
