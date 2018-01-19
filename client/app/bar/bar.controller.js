'use strict';

angular.module('posApp')
  .controller('BarCtrl', function ($scope, $http, socket, Orden, Auth, $state) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });

    $scope.categories = [];


    $http.get('/api/categories').then(function(response){
      $scope.categories = response.data;
      $scope.busqueda = {category:{name:$scope.categories[0].name}};
    })


    $http.get('/api/ordenes/').then(function(response) {
      $scope.ordenes = response.data;
      socket.syncUpdates('ordenes', $scope.ordenes);
    });

    $scope.listo = function(o, p){
      _.find(o.productos,{_id:p._id}).servido = true;
      Orden.update({id: o._id}, o);
    }

    $scope.revisa = function(orden){

      var productosBar = orden.productos.filter(function(producto){
        if (producto.tipo == 'bar'){
          return true;
        }
      });

      var productosPendientes = productosBar.filter(function(producto){
        if(producto.servido == false){
          return true;
        }
      });

      var productosPorCategoria = productosPendientes.filter(function(producto){
        if (producto.category == $scope.busqueda.category.name)
        {
          return true;
        }
      })

      if (productosPorCategoria.length > 0){
        return true;
      }

    }
  });
