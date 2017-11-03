'use strict';

angular.module('posApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('usuarios', {
        url: '/usuarios',
        templateUrl: 'app/usuarios/usuarios.html',
        controller: 'UsuariosCtrl'
      });
  });
