'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('productos', {
        url: '/productos',
        templateUrl: 'app/productos/productos.html',
        controller: 'ProductosCtrl'
      });
  });
