'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ticket', {
        url: '/ticket/:id',
        templateUrl: 'app/ticket/ticket.html',
        controller: 'TicketCtrl'
      });
  });
