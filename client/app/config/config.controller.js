'use strict'

angular.module('posApp')
  .controller('ConfigCtrl', function($scope, Counter, Orden, $interval, Auth, $state, $http, socket) {
    Auth.isLoggedIn(function(response) {
      if (!response) {
        $state.go('login')
      }
    })

    $scope.categories = []
    $scope.category_name = ''
    $scope.addingMesero = 0;


    $http.get('/api/ordenes').then(function(response) {
      $scope.ordenes = response.data;

      $scope.ordenesCajaPrincipal = $scope.ordenes.filter(function(orden) {
        return orden.caja == "" || !orden.caja
      })

      $scope.totalOrdenesCajaPrincipal = $scope.ordenesCajaPrincipal.reduce(function(sum, value) {
        return sum += value.total
      }, 0)

    })

    $scope.ordenesCajaAuxiliar = function(caja) {
      var x = []
      if ($scope.ordenes.length > 0) {
        x = $scope.ordenes.filter(function(orden) {
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

    // seleccionar cajeros de la base de datos.

    $http.get('/api/cajas').then(function(response) {
      $scope.cajas = response.data
      socket.syncUpdates('caja', $scope.cajas)
    })

    $http.get('/api/users').then(function(response) {
      $scope.users = response.data
      $scope.users = $scope.users.filter(function(user) { if (user.role == 'mesero') return true })

      $scope.meserosAsignados = []

      if ($scope.cajas != 0) {
        $scope.cajas.forEach(function(caja) {
          caja.meseros_asignados.forEach(function(mesero) {
            $scope.meserosAsignados.push(mesero)
          })
        })
      }

      $scope.users = $scope.users.filter(function(user) {
        return $scope.meserosAsignados.findIndex(function(mesero) {
          return mesero.name === user.name
        }) == -1
      })
    })

    $http.get('/api/users').then(function(response) {
      $scope.cajeros = response.data
      $scope.cajeros = $scope.cajeros.filter(function(user) { if (user.role == 'caja') return true })

      $scope.cajerosAsignados = []

      $scope.cajas.forEach(function(caja) {
        $scope.cajerosAsignados.push(caja.cajero_asignado)
      })

      $scope.cajeros = $scope.cajeros.filter(function(cajero) {
        return $scope.cajerosAsignados.findIndex(function(c) {
          return c.name === cajero.name
        }) == -1
      })
    })

    $http.get('/api/categories').then(function(response) {
      $scope.categories = response.data
      socket.syncUpdates('categories', $scope.categories)
    })

    $scope.createCategory = function() {
      $http.post('/api/categories', { name: $scope.category_name })
      $scope.category_name = ''
    }

    $scope.deleteCategory = function(id) {
      $http.delete('/api/categories/' + id)
    }

    Counter.query(function(data) {
      $scope.counters = data
      $scope.countId = data[0]._id
      $scope.orden_id = data[0].orden_id
    })

    $scope.updateCounter = function(callback) {
      var counter = {
        orden_id: $scope.orden_id
      }

      Counter.update({ id: $scope.countId }, counter)

      return callback("Reseteado!")
    }

    $scope.showNotification = function(message) {

      $scope.notification = message

      $interval(function() {
        $scope.notification = ''
      }, 2000)
    }

    /// users functions

    $scope.usuarios_asignados = []
    $scope.cajero_asignado = []

    $scope.unselectCajero = function(user) {
      $scope.cajero_asignado = []
      $http.get('/api/users').then(function(response) {
        $scope.cajeros = response.data
        $scope.cajeros = $scope.cajeros.filter(function(user) { if (user.role == 'caja') return true })

        $scope.cajerosAsignados = []

        $scope.cajas.forEach(function(caja) {
          $scope.cajerosAsignados.push(caja.cajero_asignado)
        })

        $scope.cajeros = $scope.cajeros.filter(function(cajero) {
          return $scope.cajerosAsignados.findIndex(function(c) {
            return c.name === cajero.name
          }) == -1
        })
      })
    }

    $scope.selectCajero = function(user) {
      $scope.cajeros = []
      $scope.cajero_asignado.push(user)
    }

    $scope.selectUser = function(user) {
      $scope.users.splice($scope.users.indexOf(user), 1)
      $scope.usuarios_asignados.push(user)
    }

    $scope.unselectUser = function(user) {
      $scope.usuarios_asignados.splice($scope.usuarios_asignados.indexOf(user), 1)
      $scope.users.unshift(user)
    }


    $scope.addMeseroToMesa = function() {
      $scope.addingMesero = 1;
    }

    $scope.selectUserToCaja = function(user, caja) {
      $scope.users.splice($scope.users.indexOf(user), 1)
      caja.meseros_asignados.push(user)

      $http.put('/api/cajas/' + caja._id, caja)

      $scope.ordenes = $scope.ordenes.filter(function(orden) {
        return orden.usuario.name === user.name
      })

      $scope.ordenes.map(function(orden) {
        orden.caja = caja.nombre
        Orden.update({ id: orden._id }, orden)
      })

      $scope.addingMesero = 0;
    }

    $scope.removerMesero = function(mesero) {
      $http.get('/api/ordenes/').then(function(response) {
        $scope.ordenes = response.data

        $scope.ordenes = $scope.ordenes.filter(function(orden) {
          return orden.usuario.name === mesero.name
        })

        $scope.ordenes.map(function(orden) {
          orden.caja = ""
          Orden.update({ id: orden._id }, orden)
        })

        var c = [];
        $scope.cajas.forEach(function(caja) {
          caja.meseros_asignados.forEach(function(m) {
            if (m.name == mesero.name)
              c.push(caja)
            return true
          })
        })

        var index = c[0].meseros_asignados.findIndex(function(m) {
          return m.name == mesero.name
        })

        c[0].meseros_asignados.splice(index, 1)
        $scope.users.unshift(mesero)

        $http.put('/api/cajas/' + c[0]._id, c[0])
      })
    }

    $scope.deleteCaja = function(id, caja) {
      $scope.ordenes.map(function(orden) {
        caja.meseros_asignados.map(function(mesero) {
          if (orden.usuario.name === mesero.name) {
            orden.caja = ""
            Orden.update({ id: orden._id }, orden);
          }
        })
      })

      $http.delete('/api/cajas/' + id).then(function() {
        $http.get('/api/users').then(function(response) {
          $scope.users = response.data
          $scope.users = $scope.users.filter(function(user) { if (user.role == 'mesero') return true })

          $scope.meserosAsignados = []

          $scope.cajas.forEach(function(caja) {
            caja.meseros_asignados.forEach(function(mesero) {
              $scope.meserosAsignados.push(mesero)
            })
          })

          $scope.users = $scope.users.filter(function(user) {
            return $scope.meserosAsignados.findIndex(function(mesero) {
              return mesero.name === user.name
            }) == -1
          })
        })

        $http.get('/api/users').then(function(response) {
          $scope.cajeros = response.data
          $scope.cajeros = $scope.cajeros.filter(function(user) { if (user.role == 'caja') return true })

          $scope.cajerosAsignados = []

          $scope.cajas.forEach(function(caja) {
            $scope.cajerosAsignados.push(caja.cajero_asignado)
          })

          $scope.cajeros = $scope.cajeros.filter(function(cajero) {
            return $scope.cajerosAsignados.findIndex(function(c) {
              return c.name === cajero.name
            }) == -1
          })
        })
      })
    }

    $scope.crearCaja = function() {
      var caja = {
        nombre: $scope.caja_name,
        cajero_asignado: $scope.cajero_asignado[0],
        meseros_asignados: $scope.usuarios_asignados
      }

      var array = []

      $scope.ordenes.forEach(function(orden) {
        $scope.usuarios_asignados.forEach(function(mesero) {
          if (orden.usuario.name == mesero.name)
            array.push(orden)
        })
      })

      array.map(function(orden) {
        orden.caja = caja.nombre
        Orden.update({ id: orden._id }, orden)
      })

      $http.post('/api/cajas', caja).then(function() {
        $scope.usuarios_asignados = []
        $scope.cajero_asignado = []
        $http.get('/api/users').then(function(response) {
          $scope.cajeros = response.data
          $scope.cajeros = $scope.cajeros.filter(function(user) { if (user.role == 'caja') return true })

          $scope.cajerosAsignados = []

          $scope.cajas.forEach(function(caja) {
            $scope.cajerosAsignados.push(caja.cajero_asignado)
          })

          $scope.cajeros = $scope.cajeros.filter(function(cajero) {
            return $scope.cajerosAsignados.findIndex(function(c) {
              return c.name === cajero.name
            }) == -1
          })
        })
        $scope.caja_name = ''
      })
    }
  })
