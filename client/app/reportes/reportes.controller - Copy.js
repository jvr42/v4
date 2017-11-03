'use strict';

angular.module('posApp')
  .controller('ReportesCtrl', function ($scope, $http, $filter, Auth, $state, $modal, $timeout) {
  Auth.isLoggedIn(function(response){
    if (!response){
      $state.go('login');
    }
  });

  $scope.ordenes = [];
  $scope.user = 'todos';
  $scope.productoField = 'todos';
  $scope.cargando = true;

  $http.get('/api/ordenes/all').then(function(response){
    $scope.data = response.data;
    $scope.cargando = false;
  });  

  $http.get('/api/productos').success(function(data){
    $scope.productos = data;
  });

  $http.get('/api/users').success(function(data){
    $scope.usuarios = data;
  });

  $scope.change = function(name){
    $scope.productoField = name;
    $scope.search();
  };

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

  $scope.today = function() {
    $scope.desde = new Date();
    $scope.hasta = new Date();
  };

  $scope.time = function() {
    $scope.desdeTime = '00:00';
    $scope.hastaTime = '23:59';
  }

  $scope.today();
  $scope.time();

  $scope.desde.status = {
    opened: false
  };

  $scope.hasta.status = {
    opened: false
  };

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

  $scope.search = function()
  { 
    
    var desde = $filter('date')($scope.desde, 'MM/dd/yyyy');
    var hasta = $filter('date')($scope.hasta, 'MM/dd/yyyy');
    var desdeTime = $scope.desdeTime;
    var hastaTime = $scope.hastaTime;

    var d = desde + " " + desdeTime;
    var h = hasta + " " + hastaTime;

    d = new Date(d);
    h = new Date(h);

    var cocinaTotal = 0;
    var barTotal = 0;   
    var cantidadTotalProducto = 0;
    var productoTotal = 0;

    $scope.ordenes = [];

    $.each($scope.data, function(index, orden){
      if (orden.fecha >= d.getTime()) {
        if (orden.fecha <= h.getTime()) {

          if (orden.status == "cerrado" || orden.status == "cerrada") {

            if ($scope.user == "todos") {

              $.each(orden.productos, function(index, producto){

                if ($scope.productoField == "todos") {
                  if (producto.tipo == "cocina"){
                    var totalCocina = producto.precio * producto.cantidad;
                    cocinaTotal += totalCocina;
                  }

                  if (producto.tipo == "bar"){
                    var totalBar = producto.precio * producto.cantidad;
                    barTotal += totalBar;
                  }
                  //$scope.ordenes.push(orden);                   
                }
                else {
                  if (producto.name == $scope.productoField){
                    var totalProducto = producto.precio * producto.cantidad;

                    cantidadTotalProducto += producto.cantidad;
                    productoTotal += totalProducto;
                  }
                 // $scope.ordenes.push(orden);                
                }

              });            
                 
            }
            else {
              if (orden.usuario.name == $scope.user){
              $.each(orden.productos, function(index, producto){

                if ($scope.productoField == "todos") {
                  if (producto.tipo == "cocina"){
                    var totalCocina = producto.precio * producto.cantidad;
                    cocinaTotal += totalCocina;
                  }

                  if (producto.tipo == "bar"){
                    var totalBar = producto.precio * producto.cantidad;
                    barTotal += totalBar;
                  }
                 // $scope.ordenes.push(orden); 
                }
                else {
                  if (producto.name == $scope.productoField){
                    var totalProducto = producto.precio * producto.cantidad;

                    cantidadTotalProducto += producto.cantidad;
                    productoTotal += totalProducto;
                  }
                  //$scope.ordenes.push(orden);                
                }
              });

              }              
            }
          }          
        }        
      }
    });
    
    $scope.cantidadTotalProducto = cantidadTotalProducto;
    $scope.productoTotal = productoTotal;
    $scope.cocinaTotal = cocinaTotal;
    $scope.barTotal = barTotal;
  }

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'dd/MM/yyyy';
  });
