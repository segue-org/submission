(function() {
  "use strict";

  angular
    .module('segue.submission.locale', [
      'gettext',
      'ngStorage',
    ])
    .service('Locale', function(gettextCatalog, $window, $localStorage, $rootScope) {
      var self = {};

      function useLanguage(lang) {
        gettextCatalog.setCurrentLanguage(lang);
        gettextCatalog.loadRemote('/public/translations/messages.'+lang+'.json');
        self.currentLanguage = lang;
        $rootScope.$broadcast('locale:changed', lang);
      }
      function saveLanguage(lang) {
        $localStorage.savedLanguage = lang;
      }

      function detectLanguage() {
        var browser   = ($window.navigator.userLanguage || $window.navigator.language || '').substring(0,2);
        var saved     = $localStorage.savedLanguage;
        var candidate = saved || browser;
        var fallback  = 'pt';
        var valid     = _(self.languages).where({ abbr: candidate }).size();
        return valid? candidate : fallback;
      }

      self.selectLanguage = function(lang) {
        useLanguage(lang);
        saveLanguage(lang);
      };

      self.languages = [
        { abbr: 'pt', full: 'português' },
        { abbr: 'en', full: 'english' },
      ];

      useLanguage(detectLanguage());

      return self;
    })
    .directive('ifLocale', function(Locale) {
      return function(scope, elem, attr) {
        function hideOrShow(newLocale) {
          if (myLocale == newLocale) { elem.removeClass('ng-hide'); }
          else { elem.addClass('ng-hide'); }
        }

        var myLocale = attr.ifLocale;
        scope.$on('locale:changed', function(_,newLocale) { hideOrShow(newLocale); });
        hideOrShow(Locale.currentLanguage);
      };
    })
    .directive('localeSelector', function(Locale) {
      return {
        scope: {},
        controller: function($scope) {
          $scope.Locale = Locale;
        },
        templateUrl: 'modules/Locale/locale.html'
      };
    });

})();
