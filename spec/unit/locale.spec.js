(function() {
  "use strict";

  var mockWindow = { navigator: {} };
  var mockStorage = {};
  var mockGettext = jasmine.createSpyObj('gettext', ['setCurrentLanguage','loadRemote']);

  beforeEach(mockDep('$window').toBe(mockWindow));
  beforeEach(mockDep('$localStorage','ngStorage').toBe(mockStorage));
  beforeEach(mockDep('gettextCatalog','gettext').toBe(mockGettext));

  beforeEach(module('segue.submission.locale'));


  describe('locale', function() {
    describe('there is a valid saved language', function() {
      beforeEach(function() {
        mockStorage.savedLanguage = 'en';
        mockWindow.navigator.userLanguage = 'en';
      });
      it('shows up as default', inject(function(Locale) {
        expect(Locale.currentLanguage).toBe('en');
      }));
      it('selecting another language overwrites the saved one', inject(function(Locale) {
        Locale.selectLanguage('pt');
        expect(Locale.currentLanguage).toBe('pt');
        expect(mockStorage.savedLanguage).toBe('pt');
        expect(mockGettext.setCurrentLanguage).toHaveBeenCalledWith('pt');
        expect(mockGettext.loadRemote).toHaveBeenCalledWith('/public/translations/messages.pt.json');
      }));
    });

    describe('there is only a valid browser-set language', function() {
      beforeEach(function() {
        mockStorage.savedLanguage = undefined;
        mockWindow.navigator.userLanguage = 'en';
      });
      it('uses that browser-set language', inject(function(Locale) {
        expect(Locale.currentLanguage).toBe('en');
        expect(mockGettext.setCurrentLanguage).toHaveBeenCalledWith('en');
        expect(mockGettext.loadRemote).toHaveBeenCalledWith('/public/translations/messages.en.json');
      }));
    });

    describe('there is only an invalid browser-set language', function() {
      beforeEach(function() {
        mockStorage.savedLanguage = undefined;
        mockWindow.navigator.userLanguage = 'fr';
      });
      it('uses that fallback default language', inject(function(Locale) {
        expect(Locale.currentLanguage).toBe('pt');
        expect(mockGettext.setCurrentLanguage).toHaveBeenCalledWith('pt');
        expect(mockGettext.loadRemote).toHaveBeenCalledWith('/public/translations/messages.pt.json');
      }));
    });
  });

})();
