'use strict';

angular.module('posApp')
  .controller('TicketCtrl', function($scope, Counter, $interval, Auth, $state, $stateParams, $http,$rootScope) {

    $scope.orden_id = $stateParams.id;

    $http.get('/api/ordenes/' + $scope.orden_id).then(function(response) {
      $scope.orden = response.data;

      $scope.orden.productos = $scope.orden.productos.filter(function(producto) {
        if (producto.cantidad != producto.pagados)
          return true;
      })

      $scope.orden.pendiente = $scope.orden.productos.reduce(function(total, producto) {
        return total = total + producto.precio * (producto.cantidad - producto.pagados)
      }, 0)

      $scope.orden.propina = $scope.orden.pendiente * 0.10;

    });


  });
