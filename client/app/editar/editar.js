'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editar', {
        url: '/editar/:id',
        templateUrl: 'app/editar/editar.html',
        controller: 'EditarCtrl'
      });
  });
