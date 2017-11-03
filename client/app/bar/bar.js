'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bar', {
        url: '/bar',
        templateUrl: 'app/bar/bar.html',
        controller: 'BarCtrl'
      });
  });
