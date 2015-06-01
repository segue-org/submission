(function() {
  "use strict";

  angular
    .module('segue.submission.judge.service',[
      'restangular',
    ])

    .service("Judges", function(Restangular) {
      var judges  = Restangular.service('judges');
      var matches = Restangular.service('matches');
      var service = {};

      service.vote = function(matchId, judgeHash, vote) {
        var data = { hash: judgeHash, vote: vote };
        return matches.one(matchId).post('vote', data);
      };

      service.judge = function(judgeHash) {
        return judges.one(judgeHash).get();
      };
      service.match = function(judgeHash) {
        return judges.one(judgeHash).one('match').get();
      };

      return service;
    });
})();
