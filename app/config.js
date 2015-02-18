(function() {
  "use strict";

  angular
    .module('segue.submission')
    .constant('Config', {
      API_HOST: 'http://192.168.33.91',
      API_PATH: '/api',
      GEOIP_API: 'http://ip-api.com/json',
      PROPOSAL_LANGUAGES: [
        { abbr: 'pt', name: 'português' },
        { abbr: 'es', name: 'espanhol' },
        { abbr: 'en', name: 'inglês' },
      ],
      PROPOSAL_LEVELS: [ "beginner", "advanced" ]
    });

})();
