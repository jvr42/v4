'use strict';

angular.module('posApp')
  .controller('UsuariosCtrl', function ($scope, User, Auth, socket, $state) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });

  	$scope.editing = false;
  	$scope.tipo = 'administrador';

    $scope.usuarios = User.query();
    socket.syncUpdates('user', $scope.usuarios);
    
    $scope.add = function() {
      if ($scope.name && $scope.password){
        var user = {
          name: $scope.name,
          rut: $scope.rut,
          password: $scope.password,
          role: $scope.tipo
        };

        Auth.createUser(user,function() {
          $scope.name = '';
          $scope.rut = '';
          $scope.tipo = '';
          $scope.password = '';
        });
      }
      else
      {
        alert('Completa el formulario antes de ingresar un Usuario');
      }
    }

    $scope.edit = function(user) {
      $scope.editing = true;

      $scope.id = user._id;
      $scope.name = user.name;
      $scope.rut = user.rut;
      $scope.tipo = user.role;
      $scope.password = user.password;
    }

    $scope.update = function() {
      $scope.user = User.get({ id: $scope.id }, function() {
        $scope.user.name = $scope.name;
        $scope.user.rut = $scope.rut;
        $scope.user.role = $scope.tipo;
        $scope.user.password = $scope.password;

        $scope.user.$update(function(){
          $scope.id = '';
          $scope.name = '';
          $scope.rut = '';
          $scope.tipo = 'administrador';
          $scope.password = '';

          $scope.editing = false;
        });
      });
    }

    $scope.cancelar = function(){
      $scope.id = '';
      $scope.name = '';
      $scope.rut = '';
      $scope.tipo = 'administrador';
      $scope.password = '';

      $scope.editing = false;
    }

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      $scope.usuarios.splice(this.$index, 1);
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('producto');
    });
  });
