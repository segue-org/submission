(function() {
  "use strict";

  angular
    .module('segue.submission.caravan',[
      'segue.submission.directives',
      'segue.submission.libs',
      'segue.submission.errors',
      'segue.submission.caravan.controller',
      'segue.submission.caravan.service',
      'segue.submission.authenticate',
      'ngDialog'
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('caravan', {
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { template:    "<div ui-view='form'></div>", controller: 'CaravanController' }
          },
          resolve: {
            
          }
        })
        .state('caravan.new', {
          parent: 'caravan',
          url: '^/caravan/new',
          views: {
            form: { controller: 'NewCaravanController', templateUrl: 'modules/Caravan/form.html' }
          },
          resolve: {
            currentCaravan: function(Caravans) { return Caravans.current(); }
          }
        })
        .state('caravan.edit', {
          parent: 'caravan',
          url: '^/caravan/:id',
          views: {
            form: { controller: 'EditCaravanController', templateUrl: 'modules/Caravan/form.html' }
          },
          resolve: {
            currentCaravan: function(Caravans, $stateParams) {
              return Caravans.one($stateParams.id).get();
            },
            invites: function(Caravans, $stateParams) {
              return Caravans.one($stateParams.id).getList('invites');
            }
          }
        })
    });

  angular
    .module('segue.submission.caravan.controller', ['segue.submission.caravan'])
    .controller('CaravanController', function($scope, Config, Auth, focusOn) {
      $scope.credentials = Auth.glue($scope, 'credentials');
    })
    .controller('EditCaravanController', function($scope, ngDialog,
                                                  FormErrors, Validator, Caravans,
                                                  currentCaravan, invites) {
      $scope.caravan = currentCaravan;
      $scope.$watch('caravan', Caravans.localSave);
      $scope.lockCity = true;
      $scope.invites = invites;

      $scope.newInvites = [];

      $scope.isDirty = function() {
        return $scope.credentials && (($scope.caravan_form.$dirty) || ($scope.newInvites.length > 0));
      };

      $scope.submit = function() {
        Validator.validate($scope.caravan, 'caravans/edit_caravan')
                 .then(Caravans.saveIt)
                 .then(Caravans.createInvites($scope.newInvites))
                 .then(Caravans.localForget)
                 .then($scope.home)
                 .catch(FormErrors.set);
      };

      $scope.openInviteModal = function() {
        var inviteConfig = { controller: "NewInviteController", template: 'modules/Caravan/invite.html' };
        var dialog = ngDialog.open(inviteConfig);
        return dialog.closePromise.then(function(data) {
          FormErrors.clear();
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.newInvites.push(data.value);
        });
      };
    })
    .controller('NewCaravanController', function($scope, ngDialog,
                                                  FormErrors, Validator, Caravans,
                                                  currentCaravan) {
      $scope.caravan = currentCaravan;
      $scope.$watch('caravan', Caravans.localSave);

      $scope.newInvites = [];

      $scope.isDirty = function() {
        return $scope.credentials && (($scope.caravan_form.$dirty) || ($scope.newInvites.length > 0));
      };

      $scope.submit = function() {
        Validator.validate($scope.caravan, 'caravans/new_caravan')
                 .then(Caravans.post)
                 .then(Caravans.createInvites($scope.newInvites))
                 .then(Caravans.localForget)
                 .then($scope.home)
                 .catch(FormErrors.set);
      };

      $scope.openInviteModal = function() {
        var inviteConfig = { controller: "NewInviteController", template: 'modules/Caravan/invite.html' };
        var dialog = ngDialog.open(inviteConfig);
        return dialog.closePromise.then(function(data) {
          FormErrors.clear();
          if (_(data.value).isString()) { return; }
          if (_(data.value).isEmpty()) { return; }
          $scope.newInvites.push(data.value);
        });
      };
    })
    .controller('NewCaravanInviteController', function($scope, AuthModal, focusOn) {
      $scope.signup = {};

      $scope.openLoginModal = AuthModal.login;
      $scope.focusName = _.partial(focusOn, 'person.name');
    })
    .controller('NewInviteController', function($scope, FormErrors, Validator, focusOn) {
      $scope.invite = {};
      $scope.submitInvite = function() {
        return Validator.validate($scope.invite, 'caravans/new_invite')
                        .then($scope.closeThisDialog)
                        .catch(FormErrors.set);
      };
    });
})();
