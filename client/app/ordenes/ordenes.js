'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ordenes', {
        url: '/ordenes',
        templateUrl: 'app/ordenes/ordenes.html',
        controller: 'OrdenesCtrl'
      });
  });
