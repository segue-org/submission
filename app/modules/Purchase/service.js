(function() {
  "use strict";

  angular
    .module('segue.submission.purchase.service',[
      'segue.submission',
      'restangular',
      'ngStorage',
    ])
    .factory('Products', function(Restangular) {
      var service = Restangular.service('products');
      var extensions = {};
      
      extensions.getCaravanList = function(caravan_hash) {
        return Restangular.all('products/caravan/' + caravan_hash).getList();
      };
      
      return _.extend(service, extensions);
    })
    .factory('Product', function(Restangular) {
      var service = Restangular.service('products') ;
      var extensions = {};

      extensions.purchase = function(product_id) {
        return function(buyer_data) {
          var product = service.one(product_id);
          return product.post('purchase', buyer_data);
        };
      };

      return _.extend(service, extensions);
    })
    .factory('Purchases', function(Restangular, Auth, Validator, FormErrors, $localStorage, $q, $window) {
      var service = Restangular.service('purchases');
      var extensions = {};

      extensions.current = function() {
        return $localStorage.savedPurchase || {};
      };
      extensions.localSave = function(value) {
        $localStorage.savedPurchase = value || {};
      };
      extensions.localForget = function() {
        $localStorage.savedPurchase = {};
      };
      extensions.saveIt = function(object) {
        return object.save();
      };
      extensions.pay = function(method) {
        return function(purchaseObject) {
          var purchase = service.one(purchaseObject.id);
          return purchase.post('pay/' + method);
        };
      };
      extensions.followPaymentInstructions = function(response) {
        $window.location.href = response.redirectUserTo;
      };
      extensions.getOwnedByCredentials = function() {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return service.getList({ customer_id: credentials.id });
      };

      return _.extend(service, extensions);
    });
})();
