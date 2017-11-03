'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('archivo', {
        url: '/archivo',
        templateUrl: 'app/archivo/archivo.html',
        controller: 'ArchivoCtrl'
      });
  });
