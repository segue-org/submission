(function() {
  "use strict";

  angular
    .module('segue.submission.purchase',[
      'segue.submission.directives',
      'segue.submission.libs',
      'segue.submission.errors',
      'segue.submission.purchase.controller',
      'segue.submission.purchase.service',
      'segue.submission.authenticate',
      'ngDialog'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('purchase', {
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { template:    "<div ui-view='form'></div>", controller: 'PurchaseController' }
          },
          resolve: {
            products: function(Products) { return Products.getList(); }
          }
        })
        .state('purchase.new', {
          parent: 'purchase',
          url: '^/purchase/new?caravan_hash',
          views: {
            form: { controller: 'NewPurchaseController', templateUrl: 'modules/Purchase/form.html' }
          },
          resolve: {
            currentPurchase:  function(Purchases, $window)     { return Purchases.current(); },
            products_caravan: function(Products, $stateParams) { if ($stateParams.caravan_hash) return Products.getCaravanList($stateParams.caravan_hash); else return []; }
          }
        })
        .state('purchase.conclude', {
          parent: 'purchase',
          url: '^/purchase/:purchase_id/payment/:payment_id/conclude',
          views: {
            "main@": { controller: 'ConcludePurchaseController', templateUrl: 'modules/Purchase/conclude.html' }
          },
          resolve: {
            purchase: function(Purchases, $stateParams) {
              return Purchases.one($stateParams.purchase_id).get();
            },
            payment_id: function($stateParams) {
              return $stateParams.payment_id;
            }
          }
        });
    });

  angular
    .module('segue.submission.purchase.controller', ['segue.submission.purchase'])
    .controller('PurchaseController', function($scope, Config, Auth, focusOn, Validator, FormErrors, products, Account) {
      $scope.credentials = Auth.glue($scope, 'credentials');
      $scope.products = products;
    })
    .controller('ConcludePurchaseController', function($scope, purchase, payment_id, Auth) {
      $scope.credentials = Auth.glue($scope, 'credentials');
      $scope.$on('auth:changed', $scope.home);

      $scope.purchase = purchase;
    })
    .controller('NewPurchaseController', function($rootScope, $scope, $stateParams, Config, Auth, focusOn, products, products_caravan, Product, Purchases, currentPurchase, Validator, FormErrors, Account, ContractModal) {
      $scope.selectedProduct = {};
      
      var products_list = null;
      
      if ($stateParams.caravan_hash) {
        products_list = products_caravan;
        $scope.isCaravan = true;
      } else {
        products_list = products;
        $scope.isCaravan = false;
      }
      
      $scope.productsByPeriod = _(products_list).groupBy('sold_until')
                                           .pairs()
                                           .map(function(p) { return [p[0],_.groupBy(p[1], 'category')]; })
                                           .value();

      $scope.updateSelectedProduct = function(newId) {
        $scope.selectedProduct = _(products_list).findWhere({ id: newId });
        if ($scope.selectedProduct.category == 'student') {
          $scope.buyer.kind = 'person';
          $scope.showDialog('student');
        }
      };
      
      $scope.showDialog = ContractModal.show;
      
      $scope.$watch('buyer', Purchases.localSave);
      $scope.buyer = currentPurchase;
      $scope.buyer.kind = 'person';
      $scope.payment = { method: 'boleto' };
      $scope.temp_name = $scope.buyer.name;
      delete $scope.buyer.id;
      
      $scope.changeBuyerType = function() {
        if ($scope.buyer.kind == 'company') {
          $scope.temp_name = $scope.buyer.name;
          $scope.buyer.name = '';
        } else {
          $scope.buyer.name = $scope.temp_name;
        }
      }
      
      $scope.$watch($scope.credentials, function() {
        if ($scope.credentials) {
          Account.get().then(function(account) {
            $scope.temp_name             = account.name;
            $scope.buyer.name            = account.name;
            $scope.buyer.address_country = account.country;
            $scope.buyer.address_city    = account.city;
            $scope.buyer.document        = account.document;
            if ($stateParams.caravan_hash) {
              $scope.buyer.caravan_invite_hash = $stateParams.caravan_hash;
            }
          });
        }
      });

      $scope.isDirty = function() {
        return $scope.credentials && $scope.selectedProduct.id && $scope.purchase_form.$dirty;
      };
      
      $scope.submit = function() {
        Validator.validate($scope.buyer, 'purchases/buyer')
                 .then(Product.purchase($scope.selectedProduct.id))
                 .then(Purchases.pay($scope.payment.method))
                 .then(Purchases.followPaymentInstructions)
                 .then(Purchases.localForget)
                 .catch(FormErrors.set);
      };
    });
})();
