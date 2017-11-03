'use strict';

angular.module('posApp')
  .controller('OrdenesCtrl', function ($scope, $http, Auth, socket, $modal, $state) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });
    
    $http.get('/api/ordenes/user/' + Auth.getCurrentUser().name).then(function(response) {
      $scope.ordenes = response.data;
      socket.syncUpdates('ordenes', $scope.ordenes, function(event, item, array){
        if (Auth.getCurrentUser().name != item.usuario.name){
          var dropItem = _.find($scope.ordenes, {_id: item._id});
          var index = $scope.ordenes.indexOf(dropItem);
          $scope.ordenes.splice(index,1);
        }
        if (item.status == "cerrada"){
          var dropItem = _.find($scope.ordenes, {_id: item._id});
          var index = $scope.ordenes.indexOf(dropItem);
          $scope.ordenes.splice(index,1);
        }
      });
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
