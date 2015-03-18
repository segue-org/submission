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
          url: '^/purchase/new',
          views: {
            form: { controller: 'NewPurchaseController', templateUrl: 'modules/Purchase/form.html' }
          },
          resolve: {
            currentPurchase: function(Purchases) { return Purchases.current(); }
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

      var objPayment = _.select(purchase.payments, function (payment) {
        return payment.id == payment_id;
      });
      
      objPayment = objPayment[0];
      
      if (objPayment !== undefined) {
        $scope.status = objPayment.status;
      }
      
      $scope.purchase = purchase;
    })
    .controller('NewPurchaseController', function($scope, Config, Auth, focusOn, products, Product, Purchases, currentPurchase, Validator, FormErrors, Account) {
      _.each(products, function(k, v) {
        var added = {
          short_description: new String(products[v].description).replace("ingresso FISL16 - ", "")
        }
        products[v] = _.extend(k, added);
      });
      
      $scope.products = products;
      
      $scope.buyer = currentPurchase;
      delete $scope.buyer.id;
      
      $scope.$watch('buyer', Purchases.localSave);

      var updateData = function() {
        if ($scope.credentials) {
          Account.get().then(function(account) {
            $scope.buyer.contact         = account.name;
            $scope.buyer.address_country = account.country;
            $scope.buyer.address_city    = account.city;
            $scope.buyer.document        = account.document;
          });
        } else { return; }
      }
      
      $scope.$parent.$on("product:changed", function(ev, el) {
        var cat = el.attr("data-category");
        $scope.buyer.kind = cat;
        $scope.selectedProduct = el.val();
      });
      
      $scope.$on("auth:changed", function(e, c) {
        updateData();
      });
      
      updateData();
      
      $scope.isDirty = function() {
        return $scope.credentials && $scope.buyer.product_id != "" && ( ($scope.purchase_form.$dirty) );
      };
      
      $scope.submit = function() {
        if ($scope.buyer.kind == "student") { $scope.buyer.kind = "person"; }
        $scope.buyer.name = $scope.credentials.name;
        Validator.validate($scope.buyer, 'purchases/buyer')
                 .then(Product.purchase($scope.selectedProduct))
                 .then(Purchases.pay('pagseguro'))
                 .then(Purchases.followPaymentInstructions)
                 .then(Purchases.localForget)
                 .catch(FormErrors.set);
      };
    });
})();
