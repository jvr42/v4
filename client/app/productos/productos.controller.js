'use strict';

angular.module('posApp')
  .controller('ProductosCtrl', function ($scope, Producto, socket, Auth, $state, $http) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });

  	$scope.tipo = 'cocina';

    $scope.categories = [];

    $http.get('/api/categories').then(function(response){
      $scope.categories = response.data;
    })

    $scope.category = '';
    $scope.productos = Producto.query();
    socket.syncUpdates('producto', $scope.productos);

    $scope.delete = function(producto) {
		Producto.remove({ id: producto._id });
		$scope.productos.splice(this.$index, 1);
    };

    $scope.add = function() {
        if ($scope.name && $scope.precio){
            var producto = {
                name: $scope.name,
                precio: $scope.precio,
                cantidad: 1,
                tipo: $scope.tipo,
                category: $scope.category
            };

            Producto.save(producto, function(){
                $scope.name = '';
                $scope.precio = '';
                $scope.tipo = 'cocina';
                $scope.category = '';
            });
        }
        else
        {
            alert('Debes completar el formulario antes de ingresar un Producto');
        }
    };

    $scope.edit = function(producto){
    	$scope.editing = true;

    	$scope.id = producto._id;
    	$scope.name = producto.name;
    	$scope.precio = producto.precio;
		  $scope.tipo = producto.tipo;
      $scope.category = producto.category;
    }

    $scope.update = function()
    {
		$scope.producto = Producto.get({ id: $scope.id }, function() {

		  $scope.producto.name = $scope.name;
		  $scope.producto.precio = $scope.precio;
		  $scope.producto.tipo = $scope.tipo;
      $scope.producto.category = $scope.category;

		  $scope.producto.$update(function() {
        $scope.id = '';
        $scope.name = '';
        $scope.precio = '';
        $scope.tipo = 'cocina';
        $scope.category = '';
        $scope.editing = false;
		  });

		});
    }

    $scope.cancelar = function(){
        $scope.id = '';
        $scope.name = '';
        $scope.precio = '';
        $scope.tipo = 'cocina';
        $scope.category = '';
        $scope.editing = false;
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('producto');
    });
  });
