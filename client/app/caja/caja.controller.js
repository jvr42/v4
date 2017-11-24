'use strict';

angular.module('posApp')
  .controller('CajaCtrl', function ($scope, $http, socket, Orden, $modal, $state, Modal, Auth) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });

    $scope.user = '';
    $scope.orden_id = '';
    $scope.totalOrdenes = 0;

    $http.get('/api/users').success(function(data){
      $scope.usuarios = data;
    });

    $http.get('/api/ordenes/').then(function(response) {
      $scope.ordenes = response.data;
      socket.syncUpdates('ordenes', $scope.ordenes);
      $scope.totalOrdenes = $scope.ordenes.length;
    });

/*    $scope.delete = Modal.confirm.delete(function(orden) {
  		Orden.remove({ id: orden._id });
  	  //$scope.ordenes.splice(this.$index, 1);
    });*/

    $scope.delete = function(orden) {      
      var modalInstance = $modal.open({
        templateUrl: 'deleteOrden.html',
        controller: 'deleteCtrl',
        resolve: {
          orden: function () {
            return orden;
          }
        }
      });
    };

    $scope.abierta = function(orden) {
      if (orden.status == 'cerrada' || orden.status == 'Borrado')
        return false;
      else
        return true;
    }

    $scope.productCount = function(orden){
    	var servidoCounter = 0;

    	$.each(orden.productos, function(i,p){
    		if (p.servido == true)
    		{
    			servidoCounter++;
    		}
    	});

    	return servidoCounter + " / " + orden.productos.length;
    }

    $scope.edit = function(id){
      $state.go('editar',{id:id});
    }

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
    $scope.pay = function (orden) {
        var modalInstance = $modal.open({
          templateUrl: 'payOrden.html',
          controller: 'payCtrl',
          resolve: {
            orden: function () {
              return orden;
            }
          }
        });
    };
    $scope.divide = function (orden) {
        var modalInstance = $modal.open({
          templateUrl: 'divideOrden.html',
          controller: 'divideCtrl',
          resolve: {
            orden: function () {
              return orden;
            }
          }
        });
    };
});

angular.module('posApp')
  .controller('deleteCtrl', function ($scope, $modalInstance, orden, Orden) {
    $scope.orden = orden;
    $scope.observacion = '';        

    $scope.borrar = function(){
      $scope.orden.observacion = $scope.observacion;
      $scope.orden.status = 'Borrado';

      Orden.update({id: $scope.orden._id}, $scope.orden, function(){
        $modalInstance.dismiss();
      });
      
    }
});

angular.module('posApp')
  .controller('verCtrl', function ($scope, $modalInstance, orden, $state) {

  $scope.orden = orden;

  $scope.calculateTotal = function(){
        var total = 0;

        for(var i=0; i<$scope.orden.productos.length;i++)
        {
            var valor = $scope.orden.productos[i].precio * $scope.orden.productos[i].cantidad;
            total = total + valor;
        }

        return total;
  }

    $scope.print = function(id){
      window.open('ticket/' + id, '', 'width=1000');
          
      $scope.cancel();
    }


  $scope.calculatePendiente = function(){
        var total = 0;
        var totalProductosPagos = 0;

        for(var i=0; i<$scope.orden.productos.length;i++)
        {
            var valorProductosPagos = $scope.orden.productos[i].pagados * $scope.orden.productos[i].precio;
            var valor = $scope.orden.productos[i].precio * $scope.orden.productos[i].cantidad;

            totalProductosPagos = totalProductosPagos + valorProductosPagos;
            total = total + valor;
        }

        return total - totalProductosPagos;
  }

  $scope.showPagados = function(producto){
    return producto.pagados + " / " + producto.cantidad; 
  } 

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('posApp')
  .controller('payCtrl', function ($rootScope, $scope, $modalInstance, orden, Orden, $state) {
 
  $scope.orden = orden;
  $scope.tipoPago = "efectivo";
  $scope.propinaclass = 'success';
  $scope.totalPropina = 0;
  $scope.descuento = "0";
  $scope.observacion_pedido = "";

  $scope.calculateTotal = function(){
        var total = 0;

        for(var i=0; i<$scope.orden.productos.length;i++)
        {
            var valor = $scope.orden.productos[i].precio * $scope.orden.productos[i].cantidad;
            total = total + valor;
        }

        return total;
  }

  $scope.calculateTotal()

  $scope.calculatePendiente = function(){
        var total = 0;
        var totalProductosPagos = 0;

        for(var i=0; i<$scope.orden.productos.length;i++)
        {
            var valorProductosPagos = $scope.orden.productos[i].pagados * $scope.orden.productos[i].precio;
            var valor = $scope.orden.productos[i].precio * $scope.orden.productos[i].cantidad;

            totalProductosPagos = totalProductosPagos + valorProductosPagos;
            total = total + valor;
        }

        return total - totalProductosPagos;
  }

  $scope.aplicarPropina = function(){    
    $scope.totalPropina = $scope.calculatePendiente() * 0.10;
    $scope.totalWithPropina = $scope.totalPropina + $scope.calculatePendiente();
  }

  $scope.aplicarDescuento = function(porcentaje){
    $scope.totalDescuento = Math.ceil(($scope.calculatePendiente()) * (porcentaje / 100)) ;
    $scope.totalMenosDescuento = $scope.calculatePendiente() - $scope.totalDescuento + $scope.totalPropina;
  }

  $scope.propina = true;
  
  $scope.aplicarPropina();

  $scope.showPagados = function(producto) {
    return producto.pagados + " / " + producto.cantidad; 
  }

  $scope.pagar = function(){

    $scope.orden.total = $scope.calculateTotal();
    $scope.orden.propina = $scope.propina;
    $scope.orden.propinaPagada = $scope.propinaPagada;
    $scope.orden.servida = true;
    $scope.orden.descuento = $scope.totalDescuento;
    $scope.orden.fechaCierre = new Date().getTime();
    $scope.orden.numeroBoleta = $scope.numeroBoleta;
    $scope.orden.tipoPago = $scope.tipoPago;
    $scope.orden.observacion_pedido = $scope.observacion_pedido;

    for(var i=0; i<$scope.orden.productos.length;i++)
    {
      $scope.orden.productos[i].pagado = 'true';
      $scope.orden.productos[i].servido = 'true';
    }

    $scope.orden.status = 'cerrada';

    Orden.update({id: $scope.orden._id},$scope.orden); 

    $modalInstance.dismiss('cerrar');
  }

  $scope.cerrar = function () {
    $modalInstance.dismiss('cerrar');
  };
});

angular.module('posApp')
  .controller('divideCtrl', function ($scope, $modalInstance, orden, Orden) {
 
  $scope.o = orden;

  $scope.subticket = [];

  $scope.pagar = function(producto){
    // clonar el producto para poder cambiar sus propiedades sin afectar el producto del pedido general.
    var p = _.clone(producto);

    // se cambia la cantidad del producto clonado a 1 para ser ingresado al subticket como un solo producto.
    p.cantidad = 1;    

    // si el producto se encuentra en el subticket 
    if (_.find($scope.subticket, {_id : p._id})){

      // encuentra ese producto en el subticket y aumenta su cantidad sumandole 1 mas.
      _.find($scope.subticket, {_id : p._id}).cantidad++;

      // se actualiza el producto general a reflejar un producto mas pagado
      producto.pagados++;

      // se revisa cada vez que la cantidad de producto pagados sea igual a la cantidad de productos unitarios y se da por pago el ITEM general
      if (producto.pagados == producto.cantidad)
        producto.pagado = true;
      else
        producto.pagado = false;    
    }
    else{
      // si no esta el producto se inserta en el subticket 
      $scope.subticket.push(p);

      // se actualiza el producto general a reflejar un producto mas pagado
      producto.pagados++; 

      // se revisa cada vez que la cantidad de producto pagados sea igual a la cantidad de productos unitarios y se da por pago el ITEM general
      if (producto.pagados == producto.cantidad)
        producto.pagado = true;
      else
        producto.pagado = false;  
    }

    //envia los cambios a servidor
    Orden.update({id: $scope.o._id}, $scope.o);
  }

  $scope.revertir = function(producto){
    var p = _.clone(producto);

    // si esta el producto en el subticket se le resta 1 a su cantidad.
    if (_.find($scope.subticket, {_id : p._id})){

      _.find($scope.subticket, {_id : p._id}).cantidad--;

      // disminuye la cantidad unitaria de producto pagado
      producto.pagados--;

      // se revisa cada vez que la cantidad de producto pagados sea igual a la cantidad de productos unitarios y se da por pago el ITEM general
      if (producto.pagados == producto.cantidad)
        producto.pagado = true;
      else
        producto.pagado = false;  

      // quita el producto del subticket cuando su cantidad es 0
      if (_.find($scope.subticket, {_id : p._id}).cantidad == 0)
      {
        _.remove($scope.subticket, {_id : p._id});
      }
    }

    // envia los cambios a servidor
    Orden.update({id: $scope.o._id}, $scope.o);
  }

  $scope.calculateTotal = function(){
        var total = 0;

        for(var i=0; i<$scope.subticket.length;i++)
        {
            var valor = $scope.subticket[i].precio * $scope.subticket[i].cantidad;
            total = total + valor;
        }

        return total;
  }


  $scope.checkSubticket = function(producto){
    return _.find($scope.subticket,{_id: producto._id});
  }

  $scope.cerrar = function () {
    $modalInstance.dismiss('cerrar');
  };
});

