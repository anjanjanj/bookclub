'use strict';

angular.module('bookclubApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.fullName = $scope.getCurrentUser().fullName;
    $scope.city = $scope.getCurrentUser().city;
    $scope.state = $scope.getCurrentUser().state;

    $scope.updateInformation = function(form) {
      if (form.$valid) {
        // server needs to check if id matches currently logged in user
        $http.patch('/api/users', {fullName: $scope.fullName, city: $scope.city, state: $scope.state})
        .then( function(response) {
          // success
          console.log(response);
          $scope.message2 = 'Information updated!';
        }, function(response) {
          // failure
          console.log(response);
          $scope.message2 = 'Error updating information: ' + response.data;
        });
      }
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
