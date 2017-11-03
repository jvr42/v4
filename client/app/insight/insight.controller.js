'use strict';

angular.module('posApp')
  .controller('InsightCtrl', function ($scope, DTOptionsBuilder, DTColumnBuilder, $resource) {

  		$scope.ordenes = [];

	    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
	        return $resource('api/ordenes/insights/index').query().$promise;
	    }).withPaginationType('full_numbers');

	    $scope.dtColumns = [
	        DTColumnBuilder.newColumn('orden_id').withTitle('Orde Id'),
	        DTColumnBuilder.newColumn('fecha_alt').withTitle('Fecha'),
	        DTColumnBuilder.newColumn('total').withTitle('Total')
	    ];


  });
