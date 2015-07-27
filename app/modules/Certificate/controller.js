(function() {
  "use strict";

  angular
    .module('segue.submission.certificate',[
      'segue.submission.certificate.service',
      'segue.submission.account.service',
      'segue.submission.directives',
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('certificate', {
          url: '^/certificate/',
          abstract: 'true',
          views: {
            header: { templateUrl: 'modules/common/nav.html' }
          },
          resolve: {
            account: function(Account) { return Account.get(); },
            certificates: function(Certificates) { return Certificates.getOwnedByCredentials(); }
          }
        })
        .state('certificate.survey', {
          url: '^/certificate/survey',
          views: {
            "main@": { templateUrl: 'modules/Certificate/certificate.survey.html', controller: 'SurveyController' }
          },
          resolve: {
            survey: function(Survey) { return Survey.get(); }
          }
        })
        .state('certificate.name', {
          url: '^/certificate/set-name',
          views: {
            "main@": { templateUrl: 'modules/Certificate/certificate.name.html', controller: 'NameController' }
          },
        })
        .state('certificate.issue', {
          url: '^/certificate/issue',
          views: {
            "main@": { templateUrl: 'modules/Certificate/certificate.issue.html', controller: 'IssueController' }
          },
        });
    })
    .controller('IssueController', function($scope, Certificates, Config, certificates) {
      $scope.pending_certificates = _(certificates).where({ status: 'issuable' }).value();
      $scope.issued_certificates  = _(certificates).where({ status: 'issued' }).value();

      function moveFromPendingToIssued(issuedCert) {
        _($scope.pending_certificates).remove({ descriptor: issuedCert.descriptor });
        $scope.issued_certificates.push(issuedCert);
      }
      function markFailure(failedCert) {
        var cert = _($scope.pending_certificates).findWhere({ descriptor: failedCert.descriptor });
        if (!cert) { return; }
        cert.status = 'failed';
      }
      $scope.issue = function(descriptor) {
        return Certificates.issue(descriptor, $scope.language)
                           .then(moveFromPendingToIssued)
                           .catch(markFailure);
      };
      _($scope.pending_certificates).each(function(certificate) {
        $scope.issue(certificate.descriptor);
      });
    })
    .controller('SurveyController', function($scope, $state, Survey, survey) {
      $scope.survey = survey;
      $scope.responses = {};
      $scope.doSubmit = function() {
        Survey.saveAnswers($scope.responses).then(function(data) {
          $state.go('certificate.name');
        });
      };
    })
    .controller('NameController', function($scope, $state, Account, account, certificates, focusOn) {
      if (account.certificate_name) {
        console.log('name already set, skipping');
        $state.go('certificate.issue');
        return;
      }
      $scope.certificates = certificates;
      $scope.new_name     = account.name;

      $scope.doSubmit = function() {
        Account.setCertificateName({ name: $scope.new_name }).then(function(data) {
          $state.go('certificate.issue');
        });
      };
      focusOn('new_name');
    });
})();
