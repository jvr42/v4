'use strict';

angular.module('posApp')
  .controller('TicketCtrl', function($scope, Counter, $interval, Auth, $state, $stateParams, $http) {
    Auth.isLoggedIn(function(response) {
      if (!response) {
        $state.go('login');
      }
    });

    $scope.orden_id = $stateParams.id;

    $http.get('/api/ordenes/' + $scope.orden_id).then(function(response) {
      $scope.orden = response.data;
      console.log($scope.orden);


      $scope.calculateTotal = function() {
        var total = 0;

        for (var i = 0; i < $scope.orden.productos.length; i++) {
          var valor = $scope.orden.productos[i].precio * $scope.orden.productos[i].cantidad;
          total = total + valor;
        }

        return total;
      }

      $scope.calculatePendiente = function() {
        var total = 0;
        var totalProductosPagos = 0;

        for (var i = 0; i < $scope.orden.productos.length; i++) {
          var valorProductosPagos = $scope.orden.productos[i].pagados * $scope.orden.productos[i].precio;
          var valor = $scope.orden.productos[i].precio * $scope.orden.productos[i].cantidad;

          totalProductosPagos = totalProductosPagos + valorProductosPagos;
          total = total + valor;
        }

        return total - totalProductosPagos;
      }

      $scope.aplicarPropina = function(){    
        $scope.totalPropina = $scope.calculatePendiente() * 0.10;
        $scope.totalWithPropina = $scope.totalPropina + $scope.calculatePendiente();
      }

          $scope.aplicarPropina();
          window.print();
    });



  });
