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
      $scope.loading = true;
      Orden.getRange({ desde: desde.getTime(), hasta: hasta.getTime() }, function(data) {

        $scope.ordenes = [];
        $scope.numeroPedidos = data.length;

        var total = 0;
        var totalCocina = 0;
        var totalBar = 0;
        var totalProductosCocina = 0;
        var totalProductosBar = 0;
        var totalOrdenes = 0;
        var totalOrdenesBorradas = 0;
        var totalSingleProduct = 0;

        data.map(function(orden) {
          if (orden.status == 'cerrada') {
            if ($scope.usuario.text == 'Todos' && $scope.producto.text == 'Todos') {
              orden.productos.map(function(producto) {
                if (producto.tipo == 'cocina') {
                  totalProductosCocina++;
                  totalCocina += producto.precio * producto.cantidad;
                } else {
                  totalProductosBar++;
                  totalBar += producto.precio * producto.cantidad;
                }
              });
              total += orden.total;
              totalOrdenes++;
              $scope.ordenes.push(orden);
              console.log("if #1");
            }

            if ($scope.usuario.text != 'Todos' && $scope.producto.text == 'Todos') {
              if (orden.usuario.name == $scope.usuario.text) {
                orden.productos.map(function(producto) {
                  if (producto.tipo == 'cocina') {
                    totalProductosCocina++;
                    totalCocina += producto.precio * producto.cantidad;
                  } else {
                    totalProductosBar++;
                    totalBar += producto.precio * producto.cantidad;
                  }
                });
                total += orden.total;
                totalOrdenes++;
                $scope.ordenes.push(orden);
                console.log("if #2");
              }
            }

            if ($scope.usuario.text == 'Todos' && $scope.producto.text != 'Todos') {
              orden.productos.map(function(producto) {
                if ($scope.producto.text == producto.name) {

                  if (producto.tipo == 'cocina') {
                    totalProductosCocina++;
                    totalCocina += producto.precio * producto.cantidad;
                  } else {
                    totalProductosBar++;
                    totalBar += producto.precio * producto.cantidad;
                  }

                  total += orden.total;
                  totalOrdenes++;
                  $scope.ordenes.push(orden);
                  console.log("if #3");
                }

              });
            }

            if ($scope.usuario.text != 'Todos' && $scope.producto.text != 'Todos') {
              orden.productos.map(function(producto) {
                if (orden.usuario) {
                  if (orden.usuario.name == $scope.usuario.text && producto.name == $scope.producto.text) {

                    if (producto.tipo == 'cocina') {
                      totalProductosCocina++;
                      totalCocina += producto.precio * producto.cantidad;
                    } else {
                      totalProductosBar++;
                      totalBar += producto.precio * producto.cantidad;
                    }

                    total += orden.total;
                    totalOrdenes++;
                    $scope.ordenes.push(orden);
                    console.log("if #4");
                  }
                }
              });
            }
          }
        });

        $scope.results = {
          total: total,
          totalCocina: totalCocina,
          totalBar: totalBar,
          totalProductosCocina: totalProductosCocina,
          totalProductosBar: totalProductosBar,
          totalOrdenes: totalOrdenes,
          totalOrdenesBorradas: totalOrdenesBorradas
        }

        $scope.loading = false;
      });
    };
  });
