'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('caja', {
        url: '/caja',
        templateUrl: 'app/caja/caja.html',
        controller: 'CajaCtrl'
      });
  });
