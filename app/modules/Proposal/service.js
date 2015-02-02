(function() {
  "use strict";

  angular
    .module('segue.submission.proposal.service',[
      'segue.submission',
      'restangular',
      'ngStorage'
    ])
    .factory('Proposals', function(Restangular, $localStorage) {
      var extensions = {};
      extensions.current = function() {
        return $localStorage.savedProposal;
      };
      extensions.localSave = function(value) {
        $localStorage.savedProposal = value;
      };

      var service = Restangular.service('proposal');

      return _.extend(service, extensions);
    });
})();
