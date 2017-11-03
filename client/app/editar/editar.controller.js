'use strict';


angular.module('posApp')
  .controller('EditarCtrl', function($scope, $http, $state, socket, Producto, Auth, $stateParams, Orden, Modal, $modal) {
    Auth.isLoggedIn(function(response) {
      if (!response) {
        $state.go('login');
      }
    });

    $scope.ticket = [];

    $scope.orden_id = $stateParams.id;
    $scope.userRole = Auth.getCurrentUser().role;

    $scope.data = {
      tipo: 'servir',
      mesa: 't 1',
      orden_id: ''
    };

    $http.get('/api/ordenes/' + $scope.orden_id).then(function(response) {
      $scope.orden = response.data;
      $scope.ticket = $scope.orden.productos;

      $scope.data.orden_id = $scope.orden.orden_id;
      $scope.data.tipo = $scope.orden.tipo;
      $scope.data.mesa = $scope.orden.mesa;
    });

    $http.get('/api/productos').then(function(response) {
      $scope.productos = response.data;
      socket.syncUpdates('producto', $scope.productos);
    });

    $scope.delete = function(item) {
      var modalInstance = $modal.open({
        templateUrl: 'deleteProducto.html',
        controller: 'deleteProductoCtrl',
        resolve: {
          item: function() {
            return item;
          },
          ticket: function() {
            return $scope.orden;
          }
        }
      });
    };


    $scope.mostrarObservacion = function(item) {
      if (item.showObservacion)
        item.showObservacion = false;
      else
        item.showObservacion = true;
    }

    $scope.updateTicket = function() {

      if ($scope.ticket.length != 0 && $scope.tipo != "") {
        var orden = {};
        var user = Auth.getCurrentUser();

        orden.fechaEditado = new Date().getTime();
        orden.status = 'abierta';
        orden.ultimoEditor = user;
        orden.tipo = $scope.data.tipo;
        orden.mesa = $scope.data.mesa;
        orden.productos = $scope.ticket;
        orden.total = $scope.calculateTotal();
        orden.servida = false;

        Orden.update({ id: $scope.orden._id }, orden, function() {
          $scope.ticket = [];
          $scope.data.tipo = "servir";
          $scope.data.mesa = "1";
          $state.go('ordenes');
        });
      } else {
        alert("Ingrese productos a la orden antes de continuar...");
      }
    }

    $scope.addToTicket = function(producto) {
      if (_.find($scope.ticket, { _id: producto._id })) {
        _.find($scope.ticket, { _id: producto._id }).cantidad++;
      } else {
        producto._id = new Date().getTime();
        $scope.ticket.push(producto);
      }
    }

    $scope.deleteItem = function(item) {

      if (_.find($scope.ticket, { _id: item._id })) {
        _.find($scope.ticket, { _id: item._id }).cantidad--;
        if (_.find($scope.ticket, { _id: item._id }).cantidad == 0) {
          _.remove($scope.ticket, { _id: item._id });
          item.cantidad = 1;
          return true;
        }
        return true;
      } else {
        _.remove($scope.ticket, { _id: item._id });
        return true;
      }

    }

    $scope.calculateTotal = function() {
      var total = 0;

      for (var i = 0; i < $scope.ticket.length; i++) {
        var valor = $scope.ticket[i].precio * $scope.ticket[i].cantidad;
        total = total + valor;
      }

      return total;
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('producto');
    });

    $scope.$on('productoBorrado', function(event,observacion, item) {

      $scope.deleteItem(item);

      var OBSERVACION = {
        producto: item,
        observacion: observacion,
        fecha: new Date().getTime()
      }

      $scope.orden.observaciones.push(OBSERVACION);
      Orden.update({id: $scope.orden._id}, $scope.orden);

    });

  });


angular.module('posApp')
  .controller('deleteProductoCtrl', function($rootScope, $scope, $modalInstance, Orden, ticket, item) {

    $scope.showDeleteButton = function(){
      if ($scope.observacion == undefined || $scope.observacion == ''){
        return false;
      }
      else{
        return true;
      }
    }

    $scope.borrar = function() {
      $rootScope.$broadcast('productoBorrado', $scope.observacion, item);
      $modalInstance.dismiss();
    }
  });


