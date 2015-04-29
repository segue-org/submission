(function() {
  "use strict";

  angular
    .module('segue.submission.corporate',[
      'segue.submission.directives',
      'segue.submission.libs',
      'segue.submission.errors',
      'segue.submission.corporate.controller',
      'segue.submission.corporate.service',
      'segue.submission.purchase.service',
      'segue.submission.authenticate',
      'ngDialog'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('corporate', {
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { template:    "<div ui-view='form'></div>", controller: 'CorporateController' }
          },
          resolve: {

          }
        })
        .state('corporate.new', {
          parent: 'corporate',
          url: '^/corporate/new',
          views: {
            form: { controller: 'NewCorporateController', templateUrl: 'modules/Corporate/form.html' }
          },
          resolve: {
            currentCorporate: function(Corporates) { return Corporates.current(); },
            products_list: function(Products) { return Products.getCorporateList(); }
          }
        })
        .state('corporate.edit', {
          parent: 'corporate',
          url: '^/corporate/:id',
          views: {
            form: { controller: 'EditCorporateController', templateUrl: 'modules/Corporate/form.html' }
          },
          resolve: {
            currentCorporate: function(Corporates, $stateParams) {
              return Corporates.one($stateParams.id).get();
            },
            products_list: function(Products) { return Products.getCorporateList(); },
            invites: function(Corporates, $stateParams) {
              return Corporates.one($stateParams.id).getList('invites');
            }
          }
        })
    });

  angular
    .module('segue.submission.corporate.controller', ['segue.submission.corporate'])
    .controller('CorporateController', function($scope, Config, Auth, focusOn) {
      $scope.credentials = Auth.glue($scope, 'credentials');
      $scope.isCorporate = true;
    })
    .controller('NewCorporateController', function($scope, ngDialog, Products, Product, Purchases,
                                                  FormErrors, Validator, Corporates,
                                                  currentCorporate, products_list) {
      $scope.selectedProduct = { price: 0 };

      $scope.productsByPeriod = _(products_list).groupBy('sold_until')
                                           .pairs()
                                           .map(function(p) { return [p[0],_.groupBy(p[1], 'category')]; })
                                           .value();

      $scope.buyer = currentCorporate;
      $scope.buyer.kind = 'company';
      $scope.$watch('corporate', Corporates.localSave);
      $scope.payment = { method: 'boleto' };
      $scope.temp_name = $scope.buyer.name;

      $scope.numberOfTickets = function() {
          return $scope.newEmployees.length;
      };

      $scope.totalValueOfTickets = function() {
        return $scope.selectedProduct.price * ($scope.numberOfTickets())
      };

      $scope.updateSelectedProduct = function(newId) {
        $scope.selectedProduct = _(products_list).findWhere({ id: newId });
      };

      $scope.isDirty = function() {
        return $scope.credentials && $scope.newEmployees.length > 0 && (($scope.corporate_form.$dirty));
      };

      $scope.submit = function() {
        Corporates.localSave($scope.buyer);
        Validator.validate($scope.buyer, 'purchases/buyer')
                 .then(Corporates.saveIt($scope.buyer, $scope.selectedProduct.id, $scope.newEmployees))
                 .then(Purchases.pay($scope.payment.method))
                 .then(Purchases.followPaymentInstructions)
                 .then(Purchases.localForget)
                 .catch(FormErrors.set);
      };

      $scope.openEmployeeModal = function() {
        var employeeConfig = { controller: "NewEmployeeController", template: 'modules/Corporate/employee.html' };
        var dialog = ngDialog.open(employeeConfig);
        return dialog.closePromise.then(function(data) {
          FormErrors.clear();
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.newEmployees.push(data.value);
        });
      };
    })
    .controller('NewCorporateLoginController', function($scope, AuthModal, focusOn) {
      $scope.signup = {};

      $scope.openLoginModal = AuthModal.login;
      $scope.focusName = _.partial(focusOn, 'person.name');
    })
    .controller('NewEmployeeController', function($scope, FormErrors, Validator, focusOn) {
      $scope.employee = {};
      $scope.submitEmployee = function() {
        return Validator.validate($scope.employee, 'corporates/new_employee')
                        .then($scope.closeThisDialog)
                        .catch(FormErrors.set);
      };
    });
})();
