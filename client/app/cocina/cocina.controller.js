'use strict';

angular.module('posApp')
    .controller('CocinaCtrl', function($scope, $http, socket, Orden, message, Auth, $state, $interval) {

        moment.locale("es")

        Auth.isLoggedIn(function(response) {
            if (!response) {
                $state.go('login');
            }
        });

        $http.get('/api/ordenes/').then(function(response) {
            $scope.ordenes = response.data;
            socket.syncUpdates('ordenes', $scope.ordenes);
        });

        $scope.listo = function(o, p) {
            _.find(o.productos, { _id: p._id }).servido = true;
            
            var m = new message({
                orden_id: o.orden_id,
                mesa: o.mesa,
                usuario: o.usuario,
                producto: p,
                createdOn: new Date().getTime(),
                read: false
            });

            m.$save();

            Orden.update({ id: o._id }, o);
        }

        $scope.mostrarObservacion = function(index, producto) {
            if (producto.showObservacion)
                producto.showObservacion = false;
            else
                producto.showObservacion = true;
        }

        $scope.revisa = function(orden) {
            if (_.find(orden.productos, { tipo: 'cocina' })) {
                if (_.find(orden.productos, { servido: false, tipo: 'cocina' })) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }

        $scope.calculateTime = function(createdTime){
           return moment(new Date(createdTime)).fromNow()        
        }

        $interval(function(){
            socket.syncUpdates('ordenes', $scope.ordenes);
        }, 60000)

    });
