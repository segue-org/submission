(function() {
  "use strict";

  angular
    .module('segue.submission.libs', [
      'segue.submission',
      'ngStorage'
    ])
    .service('tv4', function() { return tv4; })
    .service('Validator', function($http, $q, tv4, Config) {
      return {
        validate: function(data, path) {
          var deferred = $q.defer();
          var url = Config.API_HOST + Config.API_PATH + "/" + path + ".schema";
          $http.get(url).then(function(response) {
            var validation = tv4.validateMultiple(data, response.data);
            if (validation.errors.length) {
              deferred.reject(validation.errors);
            }
            else {
              deferred.resolve(data);
            }
          });
          return deferred.promise;
        }
      };
    })
    .filter('dateFromTimestamp', function() {
      return function(input) {
        var year  = input.substring(0,4);
        var month = input.substring(5,7);
        var day   = input.substring(8,10);
        return day + "/" + month + "/" + year;
      };
    })
    .filter('realbrasileiro', function() {
      return function(input) {
        function formatReal( int ){
          var tmp = int+'';
          var res = tmp.replace('.','');
          tmp = res.replace(',','');
          var neg = false;
          if(tmp.indexOf('-') === 0){
            neg = true;
            tmp = tmp.replace('-','');
          }
          if(tmp.length === 1) {
            tmp = '0'+tmp;
          }
          tmp = tmp.replace(/([0-9]{2})$/g, ',$1');
          if( tmp.length > 6){
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
          }
          if( tmp.length > 9){
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,'.$1.$2,$3');
          }
          if( tmp.length > 12){
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,'.$1.$2.$3,$4');
          }
          if(tmp.indexOf('.') === 0){
            tmp = tmp.replace('.','');
          }
          if(tmp.indexOf(',') === 0){
            tmp = tmp.replace(',','0,');
          }
          return (neg ? '-'+tmp : tmp);
        }

        return 'R$ ' + formatReal(input);
      };
    })
    .directive('watch', function() {
      return function(scope, elem, attr) {
        elem.on('change', function(ev) {
          scope.$emit(attr.watch, elem);
        });
      };
    })

})();

