(function() {
  "use strict";

  angular
    .module('segue.submission.proposals',[
      'restangular',

      'segue.submission'
    ])
    .factory('Proposals', function(Restangular) {
      return Restangular.service('proposals');
    })
    .service('ProposalBuilder', function() {
      this.empty = function() { return {}; };

      this.faked = function() {
        return {
          "title": "one talk",
          "summary": "one summary",
          "full": "one full",
          "email": "one@email.com"
        };
      };
    });
})();
