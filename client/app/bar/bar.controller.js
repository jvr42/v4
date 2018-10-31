'use strict'

angular.module('posApp')
  .controller('BarCtrl', function($scope, $http, socket, Orden, message, Auth, $state, $interval, $modal) {
    Auth.isLoggedIn(function(response) {
      if (!response) {
        $state.go('login')
      }
    })

    moment.locale("es")

    $scope.categories = []
    $scope.filterArray = []
    $scope.data = {
      ordenes: []
    }

    $http.get('/api/categories').then(function(response) {
      $scope.categories = response.data
      $scope.busqueda = { category: { name: $scope.categories[0].name } }
    })

    $http.get('/api/ordenes/').then(function(response) {
      $scope.data.ordenes = response.data
      $scope.original = response.data
      socket.syncUpdates('ordenes', $scope.data.ordenes, function(){
        $scope.applyFilterOnOrdenes()
      })
      
    })

    $scope.addMeseroToBarFilter = function(mesero) {
      var found = $scope.filterArray.find(function(m) {
        if (m.name === mesero.name)
          return true
      })

      if (found) {
        angular.element(document.querySelector("#" + mesero.name)).removeClass("btn btn-success")
        angular.element(document.querySelector("#" + mesero.name)).addClass("btn btn-default")
        $scope.filterArray.splice($scope.filterArray.indexOf(found), 1)
      } else {
        angular.element(document.querySelector("#" + mesero.name)).addClass("btn btn-success")
        $scope.filterArray.push(mesero)
      }

      $scope.applyFilterOnOrdenes()
    }

    $scope.applyFilterOnOrdenes = function() {
      console.log("running")
      var filteredOrdenes = []
      if ($scope.filterArray.length >= 1) {
        $scope.filterArray.forEach(function(filterUser) {
          $scope.original.forEach(function(orden) {
            if (orden.usuario.name === filterUser.name)
              filteredOrdenes.push(orden)
          })
        })
        $scope.data.ordenes = filteredOrdenes.sort(function(a, b){
          return a.fechaEditado - b.fechaEditado
        })
      } else {
        $scope.data.ordenes = $scope.original
      }
    }

    $http.get('/api/users/').then(function(response) {
      $scope.meseros = response.data.filter(function(user) {
        if (user.role == "mesero" || user.role == "administrador" || user.role == "caja")
          return true
      })

      $scope.meseros = $scope.meseros.sort(function(a, b) {
        var roleA = a.role.toUpperCase()
        var roleB = b.role.toUpperCase()

        if (roleA < roleB) {
          return -1
        }
        if (roleA > roleB) {
          return 1
        }

        return 0
      })
    })

    $scope.listo = function(o, p) {
      _.find(o.productos, { _id: p._id }).servido = true
      Orden.update({ id: o._id }, o)
    }

    $scope.calculateTime = function(createdTime) {
      return moment(new Date(createdTime)).fromNow()
    }

    $scope.revisa = function(orden) {
      var productosBar = orden.productos.filter(function(producto) {
        if (producto.tipo == 'bar') {
          return true
        }
      })

      var productosPendientes = productosBar.filter(function(producto) {
        if (producto.servido == false) {
          return true
        }
      })

      var productosPorCategoria = productosPendientes.filter(function(producto) {
        if (producto.category == $scope.busqueda.category.name) {
          return true
        }
      })

      if (productosPorCategoria.length > 0) {
        return true
      }
    }

    $scope.mostrarObservacion = function(index, producto) {
      if (producto.showObservacion)
        producto.showObservacion = false
      else
        producto.showObservacion = true
    }

    $interval(function() {
      socket.syncUpdates('ordenes', $scope.data.ordenes, function(){
        $scope.applyFilterOnOrdenes()
      })
    }, 60000)

  })
