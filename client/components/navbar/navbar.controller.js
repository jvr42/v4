'use strict';

angular.module('posApp')
  .controller('NavbarCtrl', function ($scope, Auth, $http, socket, message) {

    $scope.menu = [
    {
      'title': 'Caja',
      'state': 'caja',
      'auth' : [{role: 'administrador'},{role: 'caja'}]
    },
    {
      'title': 'Ventas',
      'state': 'main',
      'auth' : [{role: 'administrador'},{role: 'caja'},{role: 'mesero'}]
    },
    {
      'title': 'Ordenes',
      'state': 'ordenes',
      'auth' : [{role: 'administrador'},{role: 'caja'},{role: 'mesero'}]
    },
    {
      'title': 'Productos',
      'state': 'productos',
      'auth' : [{role: 'administrador'}]
    },
    {
      'title': 'Usuarios',
      'state': 'usuarios',
      'auth' : [{role: 'administrador'}]
    },
    {
      'title': 'Visor de Cocina',
      'state': 'cocina',
      'auth' : [{role: 'administrador'},{role: 'cocina'}]
    },
    {
      'title': 'Visor de Bar',
      'state': 'bar',
      'auth' : [{role: 'administrador'},{role: 'bar'}]
    },
    {
      'title': 'Reportes',
      'state': 'reportes',
      'auth' : [{role: 'administrador'}]
    },
    {
      'title': 'Configuracion',
      'state': 'config',
      'auth' : [{role: 'administrador'}]
    }
    ];

    $scope.getRole = Auth.getRole;
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $http.get('api/messages/user/' + $scope.getCurrentUser().name).then(function(response){
       $scope.mensajes = response.data
       $scope.mensajes = $scope.mensajes.filter(function(mensaje){
          if (mensaje.read == false)
            return true;
       });       

       socket.syncUpdates('messages', $scope.mensajes);

    })

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      //$scope.status.isopen = !$scope.status.isopen;
    };

    $scope.deleteMensaje = function(mensaje){
      message.remove({id: mensaje._id});
    }

    $scope.check = function(roles,role){
      if(_.find(roles,{role: role})){
        return true;
      }
      else{
        return false;
      }
    }

  });
