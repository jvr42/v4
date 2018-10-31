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
      caja: 'Caja Principal',
      numPersonas: '',
      tipo: 'servir',
      mesa: '',
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

    $http.get('/api/cajas').then(function(response) {
      $scope.cajas = response.data;
      $scope.selecciones = response.data;

      // tengo que saber si el usuario actual es cajero asignado o es parte de los meseros asignados a una caja auxiliar existente.

      // filtrar para ver si el usuario actual es un cajero asignado.
      var cajero = $scope.cajas.filter(function(caja){
        if (caja.cajero_asignado.name == $scope.u.name){
          return true;
        }
      })

      // si el usuario actual es un cajero asignado...
      if (cajero.length > 0){
        // rellenar automaticamente el nombre de la caja al cual debera ingresar el pedido.
        $scope.data.caja = cajero[0].nombre
      } else {          

        var array = [];

        $scope.cajas.forEach(function(caja){
          caja.meseros_asignados.forEach(function(mesero){
            if (mesero.name == $scope.u.name)
              array.push(caja)
          })
        })

        if (array.length > 0){
          $scope.data.caja = array[0].nombre
        }
      }      
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
            orden.tipo = $scope.data.tipo;
            orden.numPersonas = $scope.data.numPersonas;
            orden.mesa = $scope.data.mesa;
            orden.productos = $scope.ticket;
            orden.fecha = new Date().getTime();
            orden.fecha_alt = new Date().toLocaleString();
            orden.total = $scope.calculateTotal();
            orden.servida = false;
            orden.observaciones = [];

            if ($scope.data.caja != 'Caja Principal'){              
              orden.caja = $scope.data.caja;
            }

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
