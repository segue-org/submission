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
      
      extensions.getCorporateList = function() {
        return Restangular.all('products/corporate').getList();
      };
      
      return _.extend(service, extensions);
    })
    .factory('Product', function(Restangular, $q, Validator) {
      var service = Restangular.service('products') ;
      var extensions = {};

      extensions.purchase = function(product_id) {
        return function(buyer_data) {
          var product = service.one(product_id);
          return product.post('purchase', buyer_data);
        };
      };

      extensions.groupPurchase = function(product_id, newInvites) {
        return function(buyer_data) {
          return $q.all(newInvites.map(function(invite) {
            return Validator.validate(invite, 'corporates/new_invite')
                            .then(function() { buyer_data.post('invites', invite); })
                            .catch(function() { console.log(arguments); });
          }));
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
      extensions.pay = function(method, invites, product) {
        return function(purchaseObject) {
          var payload = purchaseObject;
          var purchase = service.one(purchaseObject.id);
          if (!_.isUndefined(invites)) {
            payload.amount = product.price * invites.length;
          }
          return purchase.post('pay/' + method, payload);
        };
      };
      extensions.payGroupPurchase = function(method) {
        return function(purchaseObject) {
          var purchase = service.one(purchaseObject.id);
          return purchase.post('group_pay/' + method);
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
