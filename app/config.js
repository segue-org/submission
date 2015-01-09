(function() {
  "use strict";

  angular
    .module('segue.submission')
    .constant('Config', {
      PROPOSAL_LANGUAGES: [
        { abbr: 'pt', name: 'português' },
        { abbr: 'es', name: 'espanhol' },
        { abbr: 'en', name: 'inglês' },
      ],
      PROPOSAL_LEVELS: [ "beginner", "advanced" ]
    });

})();
