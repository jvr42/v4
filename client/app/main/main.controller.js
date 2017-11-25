'use strict';

angular.module('posApp')
  .controller('MainCtrl', function($scope, $http, $state, socket, Producto, Auth, Counter, User) {
    Auth.isLoggedIn(function(response) {
      if (!response) {
        $state.go('login');
      }
    });

    $scope.u = Auth.getCurrentUser();

    $scope.ticket = [];

    $scope.data = {
      tipo: 'servir',
      mesa: 't 1',
      u: $scope.u.name,
      role: $scope.u.role
    };

    $http.get('/api/users').success(function(data) {
      $scope.usuarios = data;
    });

    $http.get('/api/productos').then(function(response) {
      $scope.productos = response.data;
      socket.syncUpdates('producto', $scope.productos);
    });

    $scope.mostrarObservacion = function(item) {
      if (item.showObservacion)
        item.showObservacion = false;
      else
        item.showObservacion = true;
    }

    $scope.addTickeToQueue = function() {

      if ($scope.ticket.length != 0 && $scope.tipo != "") {
        var orden = {};
        var user = User.getByName({ id: $scope.data.u }, function(data) {
          var selectedUser = data;

          Counter.query(function(data) {

            console.log(data)

            $scope.CounterObjectId = data[0]._id;
            $scope.currentOrdenId = data[0].orden_id;
            $scope.orden_id = $scope.currentOrdenId + 1;

            var counter = {
              orden_id: $scope.orden_id
            };

            Counter.update({ id: $scope.CounterObjectId }, counter);

            orden.orden_id = $scope.orden_id;
            orden.fechaEditado = new Date().getTime();
            orden.status = 'abierta';
            orden.usuario = selectedUser;
            orden.propina = '';
            orden.numeroBoleta = '';
            orden.fechaCierre = '';
            orden.descuento = '';
            orden.tipo = $scope.data.tipo;
            orden.mesa = $scope.data.mesa;
            orden.productos = $scope.ticket;
            orden.fecha = new Date().getTime();
            orden.fecha_alt = new Date().toLocaleString();
            orden.total = $scope.calculateTotal();
            orden.servida = false;
            orden.observaciones = [];

            $http.post('/api/ordenes', orden).then(function() {
              $scope.ticket = [];
              $scope.data.tipo = "servir";
              $scope.data.mesa = "1";
              $state.go('ordenes');
            });
          });
        });

      } else {
        alert("Ingrese todos los datos antes de continuar...");
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
        }

      } else {
        _.remove($scope.ticket, { _id: item._id });
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
      socket.unsyncUpdates('thing');
    });
  });
