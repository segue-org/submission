(function() {
  "use strict";

  angular
    .module('segue.submission.proposal.service',[
      'segue.submission',
      'restangular',
    ])
    .factory('Proposals', function(Restangular) {
      return Restangular.service('proposal');
    })
    .service('ProposalBuilder', function() {
      this.empty = function() { return {}; };

      this.faked = function() {
        return {
          "title": "one talk",
          "summary": "one summary",
          "full": "one full",
          "level": "beginner",
          "language": "pt"
        };
      };
    });
})();
