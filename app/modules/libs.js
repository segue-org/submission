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
        function formatCurrency( n ) {
          return n.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
        }
        return 'R$ ' + formatCurrency(parseFloat(input));
      };
    })
    .directive('watch', function() {
      return function(scope, elem, attr) {
        elem.on('change', function(ev) {
          scope.$emit(attr.watch, elem);
        });
      };
    })
    .controller("ContractController", function($scope, $rootScope, $state, $window) {
      var contract_type = $scope.ngDialogData.contract_type;
      $scope.contract_type = "modules/common/contract_" + contract_type + ".html";
      
      $scope.acceptContract = function() {
        if ($rootScope.accepted_contracts === undefined) {
          $rootScope.accepted_contracts = new Array();
        }
        
        if (!_.include($rootScope.accepted_contracts, contract_type)) {
          $rootScope.accepted_contracts.push(contract_type);
        }
        
        $scope.closeThisDialog(true);
      }
      
      $scope.rejectContract = function() {
        $window.location = "/";
      }
    })
    .factory('ContractModal', function (ngDialog, $rootScope) {
      var contractConfig  = { controller: "ContractController",  template: 'modules/common/contract.html' };
      return {
        show:  function(contract_type, dialog_size) {
          if (!_.include($rootScope.accepted_contracts, contract_type)) {
            var size = 'contract_default';
            if (!_.isUndefined(dialog_size)) { size = dialog_size; }
            _.extend(contractConfig, { className: 'ngdialog-theme-default ' + size, data: { contract_type: contract_type} });
            return ngDialog.open(contractConfig);
          } else { return false; }
        }
      };
    });

})();
