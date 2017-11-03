'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('insight', {
        url: '/insight',
        templateUrl: 'app/insight/insight.html',
        controller: 'InsightCtrl'
      });
  });
