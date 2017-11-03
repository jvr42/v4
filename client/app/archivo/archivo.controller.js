'use strict';

angular.module('posApp')
  .controller('ArchivoCtrl', function ($scope, $http, Auth, socket, $modal, $state) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });
    
    $scope.cargando = true;

    $http.get('/api/ordenes/all').then(function(response) {
      $scope.ordenes = response.data;
      $scope.cargando = false;
    });

    $scope.abierta = function(orden) {
      if (orden.status == 'cerrada')
        return false;
      else
        return true;
    }

    $scope.productCount = function(orden){
    	var servidoCounter = 0;

    	$.each(orden.productos, function(i,p){
    		if (p.servido == true)
    		{
    			servidoCounter++;
    		}
    	});

    	return servidoCounter + " / " + orden.productos.length;
    }

    $scope.edit = function(id){
      $state.go('editar',{id:id});
    }

    $scope.ver = function (orden) {
        var modalInstance = $modal.open({
          templateUrl: 'verOrden.html',
          controller: 'verCtrl',
          resolve: {
            orden: function () {
              return orden;
            }
          }
        });
    };
  });
