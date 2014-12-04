(function() {
  "use strict";

  angular
    .module('segue.submission.proposal',[
      'segue.submission'
    ])
    .controller('ProposalCtrl', function($scope) {
      $scope.proposal = {};
    })
    .config(function($stateProvider) {
      $stateProvider
        .state('proposal', {
          url: '^/',
          views: {
            header: {                             templateUrl: 'modules/views/nav.html'      },
            main:   { controller: 'ProposalCtrl', templateUrl: 'modules/views/proposal.html' }
          }
        });

    });
})();
