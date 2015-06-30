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

      var anEmptyList = function() { return []; };

      extensions.getCaravanList = function(hash) {
        if (!hash) { return []; }
        return service.one('caravan').getList(hash);
      };

      extensions.getProponentOffer = function(hash) {
        return service.one('proponent').getList(hash).catch(anEmptyList);
      };

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

      extensions.purchaseMode = function() {
        return service.one('mode').get().then(function(data) {
          return data.mode;
        });
      };

      extensions.guide = function(purchaseId, paymentId) {
        return service.one(purchaseId).one('payments').one(paymentId).one('guide').get();
      };

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
