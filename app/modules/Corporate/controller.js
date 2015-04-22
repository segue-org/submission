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
      $scope.selectedProduct = {};

      $scope.newInvites = [];
      
      $scope.productsByPeriod = _(products_list).groupBy('sold_until')
                                           .pairs()
                                           .map(function(p) { return [p[0],_.groupBy(p[1], 'category')]; })
                                           .value();

      $scope.$watch('corporate', Corporates.localSave);
      $scope.buyer = {};
      $scope.buyer.kind = 'company';
      $scope.payment = { method: 'boleto' };
      $scope.temp_name = $scope.buyer.name;
      
      $scope.updateSelectedProduct = function(newId) {
        $scope.selectedProduct = _(products_list).findWhere({ id: newId });
      };
      
      $scope.isDirty = function() {
        return $scope.credentials && (($scope.corporate_form.$dirty) || ($scope.newInvites.length > 0));
      };

      $scope.submit = function() {
        Validator.validate($scope.buyer, 'purchases/buyer')
                 .then(Corporates.saveIt($scope.buyer, $scope.selectedProduct.id, $scope.newInvites))
                 .then(Purchases.pay($scope.payment.method, $scope.newInvites, $scope.selectedProduct))
                 .then(Purchases.followPaymentInstructions)
                 .then(Purchases.localForget)
                 .catch(FormErrors.set);
      };

      $scope.openInviteModal = function() {
        var inviteConfig = { controller: "NewCorporateInviteController", template: 'modules/Corporate/invite.html' };
        var dialog = ngDialog.open(inviteConfig);
        return dialog.closePromise.then(function(data) {
          FormErrors.clear();
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.newInvites.push(data.value);
        });
      };
    })
    .controller('NewCorporateAuthorController', function($scope, AuthModal, focusOn) {
      $scope.signup = {};

      $scope.openLoginModal = AuthModal.login;
      $scope.focusName = _.partial(focusOn, 'person.name');
    })
    .controller('NewCorporateInviteController', function($scope, FormErrors, Validator, focusOn) {
      $scope.invite = {};
      $scope.submitInvite = function() {
        return Validator.validate($scope.invite, 'corporates/new_invite')
                        .then($scope.closeThisDialog)
                        .catch(FormErrors.set);
      };
    })
    .controller('EditCorporateController', function($scope, ngDialog,
                                                  FormErrors, Validator, Corporates,
                                                  currentCorporate, invites, products_list) {
      $scope.productsByPeriod = _(products_list).groupBy('sold_until')
                                           .pairs()
                                           .map(function(p) { return [p[0],_.groupBy(p[1], 'category')]; })
                                           .value();

      $scope.corporate = currentCorporate;
      $scope.$watch('corporate', Corporates.localSave);
      $scope.invites = invites;

      $scope.newInvites = [];

      $scope.isDirty = function() {
        return $scope.credentials && (($scope.corporate_form.$dirty) || ($scope.newInvites.length > 0));
      };

      $scope.submit = function() {
        Validator.validate($scope.corporate, 'corporates/edit_corporate')
                 .then(Corporates.saveIt)
                 .then(Corporates.createInvites($scope.newInvites))
                 .then(Corporates.localForget)
                 .then($scope.home)
                 .catch(FormErrors.set);
      };

      $scope.openInviteModal = function() {
        var inviteConfig = { controller: "NewCorporateInviteController", template: 'modules/Corporate/invite.html' };
        var dialog = ngDialog.open(inviteConfig);
        return dialog.closePromise.then(function(data) {
          FormErrors.clear();
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.newInvites.push(data.value);
        });
      };
    });
})();
