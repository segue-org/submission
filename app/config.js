(function() {
  "use strict";

  angular
    .module('segue.submission')
    .constant('Config', {
      API_HOST: 'http://192.168.33.91:5000',
      API_PATH: '/api',
      PROPOSAL_LANGUAGES: [
        { abbr: 'pt', name: 'português' },
        { abbr: 'es', name: 'espanhol' },
        { abbr: 'en', name: 'inglês' },
      ],
      PROPOSAL_LEVELS: [ "beginner", "advanced" ]
    });

})();
