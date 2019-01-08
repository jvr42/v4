'use strict';

angular.module('posApp')
  .controller('ReportesCtrl', function($scope, $http, $filter, Auth, $state, $modal, $timeout, Orden, Producto, User, socket) {
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

    $http.get('/api/cajas').then(function(response) {
      $scope.cajas = response.data
      $scope.selecciones = response.data
    })

    $scope.data = {
      caja: "Todas"
    }

    $scope.getPedidos = function(desde, hasta) {
      Orden.getOrdenesByRange({ desde: desde.getTime(), hasta: hasta.getTime() }, function(data) {
        $scope.ordenes = data;
        $scope.ordenes = $scope.ordenes.filter(function(orden) {
          if (orden.status == "cerrada") { return true }
        });

        if ($scope.data.caja != "Todas"){
          $scope.ordenes = $scope.ordenes.filter(function(orden) {
            if ($scope.data.caja == "Caja Principal") {
              if (orden.caja == "" || !orden.caja) {
                return true
              }
            }
  
            if (orden.caja == $scope.data.caja) { return true }
          });
        }
      
        $scope.totalVentasGeneral = $scope.ordenes.reduce(function(acc, val){
          return acc += val.total
        }, 0)        

        var productosBar = []
        $scope.ordenes.map(function(orden){
          orden.productos.map(function(producto){
            if (producto.tipo === "bar")
              productosBar.push(producto)
          })
        })

        var precios = []
        productosBar.map(function(producto){
          precios.push(producto.precio * producto.cantidad)
        })

        $scope.totalBar = precios.reduce(function(acc, precio){
          return acc += precio
        },0)


        var productosCocina = []
        $scope.ordenes.map(function(orden){
          orden.productos.map(function(producto){
            if (producto.tipo === "cocina")
              productosCocina.push(producto)
          })
        })

        var precios = []
        productosCocina.map(function(producto){
          precios.push(producto.precio * producto.cantidad)
        })

        $scope.totalCocina = precios.reduce(function(acc, precio){
          return acc += precio
        },0)


        $scope.descuentos = $scope.ordenes.reduce(function(acc, val){
          return acc += val.descuento.reduce(function(a,v){
            return a += v
          })
        },0)

        console.log($scope.descuentos)

        var productoArray = [];
        $scope.ordenes.map(function(orden){
        	orden.productos.map(function(producto){
        		productoArray.push(producto)
        	})
        })

        $scope.ranking = [];
        productoArray.map(function(producto){
        	var found = $scope.ranking.find(function(el, index, array){
        		if (el.name === producto.name)
        			return true
        	})

        	if (found){    
        	    found.cantidad = found.cantidad + producto.cantidad
        	} else {
	        	$scope.ranking.push({
	        		name: producto.name,
	        		cantidad: producto.cantidad
	        	});        		
        	}
        })
		
        var cocina = [];
        var bar = [];

        $scope.ordenes.forEach(function(orden){
          var sum = 0;
          $scope.cocina = orden.productos.reduce(function(acc,producto){
            if (producto.tipo == "cocina"){
              return sum += producto.precio * producto.cantidad
            }else{
              return 0
            }
          }, 0)

          $scope.bar = orden.productos.reduce(function(acc,producto){
            if (producto.tipo == "bar"){
              return sum += producto.precio * producto.cantidad
            }else{
              return 0
            }
          }, 0)

          cocina.push($scope.cocina)
          bar.push($scope.bar)
        })

        cocina = cocina.filter(function(item){
          if (item){
            return true;
          }
        })


        bar = bar.filter(function(item){
          if (item){
            return true;
          }
        })

        if (cocina.length > 0){
          cocina = cocina.reduce(function(sum, item){
            return sum += item;
          })          
        }

        if (bar.length > 0){
          bar = bar.reduce(function(sum, item){
            return sum += item;
          })          
        }

    		$scope.isActiveTickets = false;
    		$scope.isActiveRanking = false;
    		$scope.isActiveVentas = true;

      });
    };

    $scope.getOrden = function(orden_id) {
      Orden.getOrden({ id: orden_id }, function(data) {
        $scope.ordenes = data;
        $scope.orden_id = '';
        $scope.isActiveTickets = true;
      });
    };

    $http.get('/api/cajas').then(function(response) {
      $scope.cajas = response.data
    })


    $http.get('/api/ordenes').then(function(response) {
      $scope.setestadistica = response.data;

      var sum = 0;
      $scope.totalGeneral = $scope.setestadistica.reduce(function(acc, orden) {
        return sum += orden.total
      }, 0)

      $scope.ordenesCajaAuxiliar = function(caja) {
        var x = []
        if ($scope.setestadistica.length > 0) {
          x = $scope.setestadistica.filter(function(orden) {
            return orden.caja == caja.nombre
          })

          $scope.totalAuxiliar = x.reduce(function(sum, value) {
            return sum += value.total
          }, 0)

          return {
            length: x.length,
            ordenes: $scope.totalAuxiliar
          }
        } else {
          return {
            length: 0,
            ordenes: 0
          }
        }
      }

      $scope.ordenesCajaPrincipal = $scope.setestadistica.filter(function(orden) {
        return orden.caja == "" || !orden.caja
      })

      $scope.totalOrdenesCajaPrincipal = $scope.ordenesCajaPrincipal.reduce(function(sum, value) {
        return sum += value.total
      }, 0)

    })

  });
