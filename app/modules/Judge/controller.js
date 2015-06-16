(function() {
  "use strict";

  function okEmpty() { return {}; }

  angular
    .module("segue.submission.judge",[
      "segue.submission.judge.controller",
      "segue.submission.judge.service"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('judge', {
          url: '^/judge/:hash',
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { templateUrl: 'modules/Judge/match.html', controller: 'JudgeController' }
          },
          resolve: {
            judge: function(Judges, $stateParams) { return Judges.judge($stateParams.hash); },
            match: function(judge, Judges, $stateParams) {
              if (judge.remaining === 0) { return {}; }
              if (judge.tournament_state == 'closed') { return {}; }
              return Judges.match($stateParams.hash);
            }
          }
        });
    });

  angular
    .module("segue.submission.judge.controller",[ ])
    .controller("JudgeController", function($scope, $state, judge, match, Judges, ngToast) {
      $scope.endOfTournament = (judge.tournament_state == 'closed');
      $scope.judge = judge;
      $scope.match = match;
      $scope.displayResume = {};

      $scope.instructions = Judges.instructions;

      $scope.toggleResume = function(id) {
        $scope.displayResume[id] = !$scope.displayResume[id];
      };

      $scope.voteFor = function(desiredVote) {
        Judges.vote(match.id, judge.hash, desiredVote)
              .then(nextMatch)
              .catch(voteFailed);
      };

      function nextMatch(d) {
        ngToast.create({content: 'voto registrado!' });
        $state.transitionTo($state.current, { hash: judge.hash }, { reload: true, inherit: true, notify: true });
      }
      function voteFailed(e) {
        console.log(e);
      }
    });
})();
