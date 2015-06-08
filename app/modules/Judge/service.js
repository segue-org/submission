(function() {
  "use strict";

  angular
    .module('segue.submission.judge.service',[
      'restangular',
      'ngStorage',
    ])

    .service("Judges", function(Restangular, $localStorage) {
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

      service.instructions = {
        display: $localStorage.displayJudgeInstructions && true,
        setDisplay: function(value) {
          service.instructions.display = value;
          $localStorage.displayJudgeInstructions = value;
        }
      };

      return service;
    });
})();
