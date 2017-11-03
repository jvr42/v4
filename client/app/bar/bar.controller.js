'use strict';

angular.module('posApp')
  .controller('BarCtrl', function ($scope, $http, socket, Orden, Auth, $state) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });

    $http.get('/api/ordenes/').then(function(response) {
      $scope.ordenes = response.data;
      socket.syncUpdates('ordenes', $scope.ordenes);
    });

    $scope.listo = function(o, p){
      _.find(o.productos,{_id:p._id}).servido = true;
      Orden.update({id: o._id}, o);
    }

    $scope.revisa = function(orden){
      if (_.find(orden.productos,{tipo: 'bar'})){
        if (_.find(orden.productos,{servido: false,tipo: 'bar'})){
          return true;
        } else {          
          return  false;
        }
      }
      return false;
    }
  });
