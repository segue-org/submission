(function() {
  "use strict";

  angular
    .module('segue.submission.filters', [ ])
    .filter('dateFromTimestamp', function() {
      return function(input) {
        var year  = input.substring(0,4);
        var month = input.substring(5,7);
        var day   = input.substring(8,10);
        return day + "/" + month + "/" + year;
      };
    })
    .filter('date_locale',function() {
      return function(input) {
        if (input) {
          var d = new Date(input);
          return d.toLocaleDateString();
        } else {
          return "";
        }
      };
    })
    .filter('datetime_locale', function(Config) {
      return function(input, timezone) {
        if (!timezone) { timezone = Config.TIMEZONE; }

        if (input) {
          var d = new Date(input+timezone);
          return d.toLocaleString();
        } else {
          return "";
        }
      };
    })
    .filter('realbrasileiro', function() {
      return function(input) {
        function formatCurrency( n ) {
          return n.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
        }
        return 'R$ ' + formatCurrency(parseFloat(input));
      };
    });
})();
