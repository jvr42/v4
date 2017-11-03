'use strict';

angular.module('posApp')
  .controller('ReportesCtrl', function($scope, $http, $filter, Auth, $state, $modal, $timeout, Orden, Producto, User) {
    Auth.isLoggedIn(function(response) {
      if (!response) {
        $state.go('login');
      }
    });

    $scope.productos = Producto.query();
    $scope.usuarios = User.query();
    $scope.producto = {
      hide: true,
      text: 'Todos'
    }
    $scope.usuario = {
      hide: true,
      text: 'Todos'
    }
    $scope.numeroPedidos = 0;
    $scope.results = {};
    $scope.ordenes = [];
    $scope.productosVendidos = [];
    $scope.general = [];
    $scope.orden_id = '';
    $scope.isActiveTickets = false;
    $scope.isActiveVentas = false;
    $scope.totalVentas = 0;

    $scope.desde = {
      today: new Date(),
      status: {
        opened: false
      }
    };
    $scope.hasta = {
      today: new Date(),
      status: {
        opened: false
      }
    };

    $scope.ver = function(orden) {
      var modalInstance = $modal.open({
        templateUrl: 'verOrden.html',
        controller: 'verCtrl',
        resolve: {
          orden: function() {
            return orden;
          }
        }
      });
    };

    $scope.delete = function(orden) {
      var modalInstance = $modal.open({
        templateUrl: 'deleteOrden.html',
        controller: 'deleteCtrl',
        resolve: {
          orden: function() {
            return orden;
          }
        }
      });
    };

    $scope.selectProduct = function(producto) {
      $scope.producto.text = producto.name;
      $scope.producto.hide = true;
    }

    $scope.selectUser = function(user) {
      $scope.usuario.text = user.name;
      $scope.usuario.hide = true;
    }

    $scope.open = function($event) {
      if ($event.currentTarget.name == 'desde')
        $scope.desde.status = {
          opened: true
        };

      if ($event.currentTarget.name == 'hasta')
        $scope.hasta.status = {
          opened: true
        };
    };

    $scope.getPedidos = function(desde, hasta) {

        Orden.getAmmountSales({ desde: desde.getTime(), hasta: hasta.getTime() }, function(data) {
            $scope.general = data;
            var sum = 0;

            $scope.general.forEach(function(tipo){
              sum += tipo.value; 
            });

            $scope.totalVentas = sum;
        });

        Orden.getOrdenesByRange({ desde: desde.getTime(), hasta: hasta.getTime() }, function(data) {
            $scope.ordenes = data;
        });

        Orden.getProductosVendidos({ desde: desde.getTime(), hasta: hasta.getTime() }, function(data) {
            $scope.productosVendidos = data;
        });


        $scope.isActiveVentas = true;
    };

    $scope.getOrden = function(orden_id) {
       Orden.getOrden({id: orden_id}, function(data){
         $scope.ordenes = data;
         $scope.orden_id = '';
         $scope.isActiveTickets = true;
       });
    };

  });
