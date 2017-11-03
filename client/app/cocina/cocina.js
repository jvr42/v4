'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cocina', {
        url: '/cocina',
        templateUrl: 'app/cocina/cocina.html',
        controller: 'CocinaCtrl'
      });
  });
