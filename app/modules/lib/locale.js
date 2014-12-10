(function() {
  "use strict";

  angular
    .module('segue.submission.locale', [
      'gettext'
    ])
    .service('Locale', function(gettextCatalog, $window) {
      var self = {};

      function useLanguage(lang) {
        gettextCatalog.setCurrentLanguage(lang);
        gettextCatalog.loadRemote('/public/translations/messages.'+lang+'.json');
      }
      function saveLanguage(lang) {
      }

      function detectLanguage() {
        var browser = ($window.navigator.userLanguage || $window.navigator.language).substring(0,2);
        var saved = null;
        var fallback = 'en';
        return browser;
      }

      self.selectLanguage = function(lang) {
        useLanguage(lang);
        saveLanguage(lang);
      };

      self.languages = function() {
        return [
          { abbr: 'pt', full: 'português' },
          { abbr: 'en', full: 'english' },
        ];
      };

      useLanguage(detectLanguage());

      return self;
    });

})();
