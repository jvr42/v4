'use strict';

angular.module('posApp')
  .controller('LoginCtrl', function($scope, Auth, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          rut: $scope.user.rut,
          password: $scope.user.password
        })
        .then(function(user) {
          // Logged in, redirect to home
          if (user.role == 'cocina'){
            $state.go('cocina');
          }
          else{
            if(user.role == 'bar'){
              $state.go('bar');
            }
            else{
              $state.go('main');
            }
          }
        })
        .catch(function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
